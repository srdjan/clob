import { IOrder, Side, OrderBookSide, MarketResponse, Ticker, Trade } from './model'
import { getEmptyOrder } from './order'
import * as Engine from './engine'
import { log, TradeId } from './utils'

function match (order: IOrder): MarketResponse {
  let trades = new Array<Trade>()
  let orderBook = Engine.insertOrder(order)

  let orderBookSide = order.side == 'Buy' ? orderBook.sellSide : orderBook.buySide
  let i: number
  for (i = 0; i < 100; i++) {
    let matchOrder = getMatching(order, orderBookSide)
    if (!matchOrder) {
      break
    }

    let trade = initializeTrade(order.ticker)
    trade.price = matchOrder.limit
    trade.quantity =
      order.quantity > matchOrder.quantity
        ? matchOrder.quantity
        : order.quantity
    trade.buyOrder = order.side === 'Buy' ? order : matchOrder
    trade.sellOrder = order.side === 'Sell' ? order : matchOrder
    trade.message = 'Success'
    trades.push(trade)

    let availableQuantity = order.quantity - order.filledQuantity
    if (availableQuantity > matchOrder.quantity) {
      order.status = 'Open'
      order.filledQuantity = matchOrder.quantity
      matchOrder.status = 'Completed'
      matchOrder.filledQuantity = matchOrder.quantity
    } else if (availableQuantity < matchOrder.quantity) {
      order.status = 'Completed'
      order.filledQuantity = order.quantity
      matchOrder.status = 'Open'
      matchOrder.filledQuantity = order.quantity
    } else if (order.quantity === matchOrder.quantity) {
      order.status = 'Completed'
      order.filledQuantity = order.quantity
      matchOrder.status = 'Completed'
      matchOrder.filledQuantity = order.quantity
    }

    Engine.updateOrder(orderBook, order)
    log(`\n\nOrderbook.match: updated order ${JSON.stringify(order)}`)
    Engine.updateOrder(orderBook, matchOrder)
    log(`\n\nOrderbook.match: updated matchOrder ${JSON.stringify(matchOrder)}`)
  }

  return { order, trades }
}

function getMatching (order: IOrder, orderBookSide: OrderBookSide): IOrder | undefined {
  if (orderBookSide.size === 0) {
    log(`Orderbook.getMatching: NO matched [${order.side}] side orders`)
    return undefined
  }

  let openOrders = Array.from(orderBookSide.values()).filter(o => o.status === 'Open')
  openOrders.forEach(openOrder => {
    if (
      openOrder.status === 'Open' &&
      openOrder.limit <= order.limit &&
      openOrder.trader.username !== order.trader.username
    ) {
      log(`Orderbook.getMatching: FOUND match ${openOrder.id} on the [${openOrder.side}] side`)
      return openOrder
    }
  })
  return undefined
}

function initializeTrade (ticker: Ticker): Trade {
  return {
    ticker: ticker,
    price: 0,
    quantity: 0,
    buyOrder: getEmptyOrder(),
    sellOrder: getEmptyOrder(),
    createdAt: TradeId.next(), //new Date().getTime(),
    message: 'Fail'
  }
}

export { match }
