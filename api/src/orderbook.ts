import {
  Ticker,
  IOrder,
  IOrderBook,
  MarketResponse,
  MarketList
} from './model'
import { AuditLog } from './auditlog'
import { Order } from './order'
import { log } from './utils'
import { Trades } from './trades'

const _sortAscByLimit = (a: any, b: any) =>
  (a[1].limit > b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)
const _sortDscByLimit = (a: any, b: any) =>
  (a[1].limit < b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)

class OrderBook implements IOrderBook {
  ticker: Ticker
  audit: AuditLog
  buys: Map<string, IOrder>
  sells: Map<string, IOrder>
  sequenceId: number

  constructor (ticker: Ticker) {
    this.ticker = ticker
    this.audit = new AuditLog()
    this.buys = new Map<string, IOrder>()
    this.sells = new Map<string, IOrder>()
    this.sequenceId = 0
  }

  get (id: string): IOrder | undefined {
    let orderId = Order.idFromString(id)
    let order = orderId.side === 'Buy' ? this.buys.get(id) : this.sells.get(id)
    if (!order) {
      return undefined
    }
    return order
  }

  getMarketList (): MarketList {
    let openBuys = Array.from(this.buys.values()).filter(
      o => o.status === 'Open'
    )
    let openSells = Array.from(this.sells.values()).filter(
      o => o.status === 'Open'
    )

    return {
      buys: Array.from(openBuys.values()).map(o => `${o.limit},${o.currentQuantity()}`),
      sells: Array.from(openSells.values()).map(o => `${o.limit},${o.currentQuantity()}`)
    }
  }

  getOrderHistory (): IOrder[] {
    let merged = Array.from(this.buys.values()).concat(
      Array.from(this.sells.values())
    )
    let sorted = merged.sort((a, b) => a.createdAt - b.createdAt)
    return sorted
  }

  cancel (id: string): boolean {
    let order = this.get(id)
    if (!order) {
      log(`Orderbook.cancel: Order for id:${id} not found`)
      return false
    }

    try {
      order.status = 'Canceled'
      order.lastChangedAt = Date.now()
      if (order.side === 'Buy') {
        this.buys.delete(order.id)
        let sorted = new Map([...this.buys].sort(_sortAscByLimit))
        this.buys = sorted
      } else {
        this.sells.delete(order.id)
        let sorted = new Map([...this.sells].sort(_sortDscByLimit))
        this.sells = sorted
      }
      AuditLog.push(order)
    } catch (e) {
      log(`Orderbook.cancel: Unexpcted error: ${e}`)
      return false
    }
    return true
  }

  private update (order: IOrder): void {
    if (order.side === 'Buy') {
      this.buys.set(order.id, order)
    }

    if (order.side === 'Sell') {
      this.sells.set(order.id, order)
    }

    AuditLog.push(order)
  }

  open (order: IOrder): MarketResponse {
    if (order.side === 'Buy') {
      if (this.traderHasMatchOrder(order.trader.username, order.limit, this.sells)) {
        return {
          message: `Trader cannot place matching order himself`,
          order,
          trade: Trades.initializeTrade(order.ticker)
        }
      }
      this.buys.set(order.id, order)
      let sorted = new Map([...this.buys.entries()].sort(_sortAscByLimit))
      this.buys = sorted
    }

    if (order.side === 'Sell') {
      if (this.traderHasMatchOrder(order.trader.username, order.limit, this.buys)) {
        return {
          message: `Trader cannot place matching order himself`,
          order,
          trade: Trades.initializeTrade(order.ticker)
        }
      }
      this.sells.set(order.id, order)
      let sorted = new Map([...this.sells].sort(_sortDscByLimit))
      this.sells = sorted
    }

    log(`Opened order: ${JSON.stringify(order)}`)

    return this.match(order)
  }

  private traderHasMatchOrder(
    username: string,
    limit: number,
    bookSide: Map<string, IOrder>
  ): boolean {
    let matchOrders = Array.from(bookSide.values()).filter(
      o => o.trader.username === username && o.limit === limit
    )
    if (matchOrders.length > 0) {
      return true
    }
    return false
  }

  private match (order: IOrder): MarketResponse {
    let trade = Trades.initializeTrade(order.ticker)

    let openOrders =
      order.side === 'Buy'
        ? Array.from(this.sells.values()).filter(o => o.status === 'Open')
        : Array.from(this.buys.values()).filter(o => o.status === 'Open')

    for (let matchOrder of openOrders) {
      if (matchOrder.trader.username === order.trader.username) {
        log(
          `OrderBook.match: NOT allowed, same trader on both sides ${matchOrder.trader.username}`
        )
        continue
      }

      if (order.side === 'Buy' && order.limit < matchOrder.limit) {
        log(
          `OrderBook.match: NOT FOUND match ${matchOrder.id} on the [${matchOrder.side}] side`
        )
        continue
      }

      if (order.side === 'Sell' && order.limit > matchOrder.limit) {
        log(
          `OrderBook.match: NOT FOUND match ${matchOrder.id} on the [${matchOrder.side}] side`
        )
        continue
      }

      trade.price = matchOrder.limit
      trade.quantity =
        order.quantity > matchOrder.quantity
          ? matchOrder.quantity
          : order.quantity
      trade.buyOrder = order.side === 'Buy' ? order : matchOrder
      trade.sellOrder = order.side === 'Sell' ? order : matchOrder
      trade.message = 'Success'
      Trades.insert(trade)

      let available = order.quantity - order.filledQuantity
      if (available > matchOrder.quantity) {
        order.status = 'Open'
        order.filledQuantity += available - matchOrder.quantity

        matchOrder.status = 'Completed'
        matchOrder.filledQuantity = matchOrder.quantity
      } else if (available < matchOrder.quantity) {
        order.status = 'Completed'
        order.filledQuantity = order.quantity

        matchOrder.status = 'Open'
        matchOrder.filledQuantity += available
      } else if (order.quantity === matchOrder.quantity) {
        order.status = 'Completed'
        order.filledQuantity = order.quantity

        matchOrder.status = 'Completed'
        matchOrder.filledQuantity = matchOrder.quantity
      }

      this.update(order)
      this.update(matchOrder)
    }
    if (trade.price === 0) {
      return {
        message: `No match Trade for orderId: ${order.id}`,
        order,
        trade
      }
    }
    return { message: 'Success', order, trade }
  }

  clearAll (): void {
    this.buys.clear()
    this.sells.clear()
  }
}

export { OrderBook }
