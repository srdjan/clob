import { IOrder, OrderBook, MarketResponse } from './model'
import { getEmptyOrder } from './order'
import * as OrderBooks from './orderbooks'
import { log } from './utils'

function match (order: IOrder): MarketResponse {
  let orders = OrderBooks.insertOrder(order)

  let trade = {
    ticker: order.ticker,
    price: 0,
    quantity: 0,
    buyOrderId: '',
    sellOrderId: '',
    createdAt: new Date().getTime(),
    message: 'Fail'
  }

  let matchOrder = getMatching(order, orders)
  if (matchOrder.status === 'None') {
    log(`Orderbook.match: no trade possible: NO matching order`)
    return { order, trade }
  }
  if (matchOrder.trader.username === order.trader.username) {
    log(`Orderbook.match: no trade possible: SAME trader on both sides`)
    return { order, trade }
  }

  let quantity = order.quantity > matchOrder.quantity ? matchOrder.quantity : order.quantity
  trade.price = matchOrder.limit
  trade.quantity = quantity
  trade.buyOrderId = order.side === 'Buy' ? order.id : matchOrder.id
  trade.sellOrderId = order.side === 'Sell' ? order.id : matchOrder.id
  trade.message = 'Success'

  if (order.quantity > trade.quantity) {
    order.status = 'Partial'
    order.filledQuantity = trade.quantity
  } else if (order.quantity === trade.quantity) {
    order.status = 'Completed'
    order.filledQuantity = order.quantity
  }

  OrderBooks.updateOrder(order)
  log(`Orderbook.match: saved order ${JSON.stringify(order)}`)

  if (matchOrder.quantity > trade.quantity) {
    matchOrder.status = 'Partial'
    matchOrder.filledQuantity = trade.quantity
  } else if (matchOrder.quantity === trade.quantity) {
    matchOrder.status = 'Completed'
    matchOrder.filledQuantity = order.quantity
  }
  OrderBooks.updateOrder(matchOrder)
  log(`Orderbook.match: saved matchingOrder ${JSON.stringify(matchOrder)}`)

  return { order, trade }
}

function getMatching (order: IOrder, bookOrder: OrderBook): IOrder {
  if (order.side === 'Buy') {
    if (bookOrder.sellSide.size === 0) {
      log(`Orderbook.getMatchOrder: no BUY trade possible: no SELL side orders`)
      return order
    }
    let matchOrder = bookOrder.sellSide.entries().next().value[1]
    if (matchOrder.status === 'Open' && matchOrder.limit <= order.limit) {
      log(`Orderbook.getMatchOrder: MATCH order on the SELL side found`)
      return matchOrder // there are sellers at given or better price
    }
    log(`Orderbook.getMatchOrder : no MATCH order on the SELL side found`)
    return order
  }

  if (order.side === 'Sell') {
    if (bookOrder.buySide.size === 0) {
      log(`Orderbook.getMatchOrder: no SELL trade possible: no BUY sideeorders`)
      return order
    }
    let matchingOrder = bookOrder.buySide.entries().next().value[1]
    if (matchingOrder.status === 'Open' && matchingOrder.limit >= order.limit) {
      log(`Orderbook.getMatchOrder: MATCH order on the BUY side found`)
      return matchingOrder // there are buyers at given or better price
    }
    log(`Orderbook.getMatchOrder : no MATCH order on the BUY side found`)
    return order
  }

  return getEmptyOrder()
}

export { match }
