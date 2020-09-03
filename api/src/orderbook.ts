import {
  Ticker,
  Order,
  Trade
} from './model'

type OrderBook = {
  ticker: Ticker
  orders: Order[] //todo: just a placeholder, more appropriate data structure required
}

const create = (ticker: Ticker) => {
  return {
    ticker: ticker,
    orders: []
  }
}

const match = (orderBook: OrderBook): Trade | Error => {
  //todo
  return new Error('Not Implemented!')
}

const add = (orderBook: OrderBook, order: Order): Trade | Error => {
  if (orderBook.ticker !== order.ticker) {
    return new Error('Fail: OrderBook has to match Order ticker')
  }

  orderBook.orders.push(order)
  let result = match(orderBook) //todo: extract into separate file
  return result
}

export { OrderBook, create, add }
