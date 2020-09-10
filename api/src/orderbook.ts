import { IOrder, OrderBook, MarketResponse, Ticker } from './model'
import { getEmptyOrder, Order } from './order'
import * as OrderBooks from './orderbooks'
import { log } from './utils'

function match (order: IOrder): MarketResponse {
  let orderBook = OrderBooks.insertOrder(order)
  
  let matchOrder = getMatching(order, orderBook)
  if (matchOrder.status === 'None') {
    log(`Orderbook.match: no trade possible: NO matching order`)
    return { order, trade: getEmptyTrade(order.ticker) }
  }
  if (matchOrder.trader.username === order.trader.username) {
    log(`Orderbook.match: no trade possible: SAME trader on both sides`)
    return { order, trade: getEmptyTrade(order.ticker) }
  }

  let trade = getEmptyTrade(order.ticker)
  trade.price = matchOrder.limit
  trade.quantity = order.quantity > matchOrder.quantity ? matchOrder.quantity : order.quantity
  trade.buyOrder = order.side === 'Buy' ? order : matchOrder
  trade.sellOrder = order.side === 'Sell' ? order : matchOrder
  trade.message = 'Success'

  if (order.quantity > matchOrder.quantity) {
    order.status = 'Open'
    order.filledQuantity = matchOrder.quantity
    matchOrder.status = 'Completed'
    matchOrder.filledQuantity = matchOrder.quantity
  } 
  else if (order.quantity < matchOrder.quantity) {
    order.status = 'Completed'
    order.filledQuantity = order.quantity
    matchOrder.status = 'Open'
    matchOrder.filledQuantity = order.quantity
  }
  else if (order.quantity === matchOrder.quantity) {
    order.status = 'Completed'
    order.filledQuantity = order.quantity
    matchOrder.status = 'Completed'
    matchOrder.filledQuantity = order.quantity
  }

  OrderBooks.updateOrder(order)
  log(`\n\nOrderbook.match: updated order ${JSON.stringify(order)}`)
  OrderBooks.updateOrder(matchOrder)
  log(`\n\nOrderbook.match: updated matchOrder ${JSON.stringify(matchOrder)}`)

  return { order, trade }
}

function getMatching (order: IOrder, orderBook: OrderBook): IOrder {
  if (order.side === 'Buy') {
    if (orderBook.sellSide.size === 0) {
      log(`Orderbook.getMatching: no SELL side orders`)
      return order
    }
    let matchOrder = orderBook.sellSide.entries().next().value[1]
    if (matchOrder.status === 'Open' && matchOrder.limit <= order.limit) {
      log(`Orderbook.getMatching: FOUND MATCH order on the SELL side`)
      return matchOrder // there are sellers at given or better price
    }
    log(`Orderbook.getMatching : no MATCH order on the SELL side found`)
    return order
  }

  if (order.side === 'Sell') {
    if (orderBook.buySide.size === 0) {
      log(`Orderbook.getMatching: no BUY sidee orders`)
      return order
    }
    let matchingOrder = orderBook.buySide.entries().next().value[1]
    if (matchingOrder.status === 'Open' && matchingOrder.limit >= order.limit) {
      log(`Orderbook.getMatching: FOUND MATCH order on the BUY side`)
      return matchingOrder // there are buyers at given or better price
    }
    log(`Orderbook.getMatching: no MATCH order on the BUY side found`)
    return order
  }

  return getEmptyOrder()
}

function getEmptyTrade(ticker: Ticker) {
  return {
    ticker: ticker,
    price: 0,
    quantity: 0,
    buyOrder: getEmptyOrder(),
    sellOrder: getEmptyOrder(),
    createdAt: new Date().getTime(),
    message: 'Fail'
  }
}

export { match }
