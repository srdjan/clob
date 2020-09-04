import {
  Ticker,
  Order,
  Trade
} from './model'

type OrderBook = {
  ticker: Ticker
  buyOrders: Order[] //todo: just a placeholder, more appropriate data structure required
  sellOrders: Order[] //todo: just a placeholder, more appropriate data structure required
}

const create = (ticker: Ticker) => {
  return {
    ticker: ticker,
    buyOrders: new Array<Order>(),
    sellOrders: new Array<Order>()
  }
}

const match = (orderBook: OrderBook): Trade | Error => {
  return new Error('Not Implemented!')
}

const add = (orderBook: OrderBook, order: Order): Trade | Error => {
  if (orderBook.ticker !== order.ticker) {
    return new Error('Fail: OrderBook has to match Order ticker')
  }

  orderBook.orders.push(order)  //todo: replace array with sortable, efficient data structure
  let result = match(orderBook) //todo: raise event (?), extract matcher into separate file
  return result
}

const cancel = (orderBook: OrderBook, order: Order): true | Error => {
  return new Error('Not Implemented!')
}

export { OrderBook, create, add, cancel }
