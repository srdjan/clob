import { IOrder, MarketResponse } from './model'
import * as Engine from './orderbooks'
import { Trades } from './trades'
import { log } from './utils'

function match (order: IOrder): MarketResponse {
  let trade = Trades.initializeTrade(order.ticker)
  let orderBook = Engine.insert(order)

  let orderBookSide =
    order.side === 'Buy' ? orderBook.sellSide : orderBook.buySide
  if (orderBookSide.size === 0) {
    log(`Orderbook.match: NO matched [${order.side}] side orders`)
    return { order, trade }
  }

  let openOrders = Array.from(orderBookSide.values()).filter(
    o => o.status === 'Open' && o.trader.username !== order.trader.username  )
  for (let matchOrder of openOrders) {
    if (matchOrder.status !== 'Open') {
      continue
    }

    if (matchOrder.trader.username === order.trader.username) {
      log(
        `Orderbook.getMatching: NOT allowed, same trader on both sides ${matchOrder.trader.username}`
      )
      continue
    }

    if (order.side === 'Buy' && order.limit < matchOrder.limit) {
      log(
        `Orderbook.getMatching: NOT FOUND match ${matchOrder.id} on the [${matchOrder.side}] side`
      )
      continue
    }

    if (order.side === 'Sell' && order.limit > matchOrder.limit) {
      log(
        `Orderbook.getMatching: NOT FOUND match ${matchOrder.id} on the [${matchOrder.side}] side`
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

    Engine.update(orderBook, order)
    Engine.update(orderBook, matchOrder)
  }
  return { order, trade }
}

export { match }
