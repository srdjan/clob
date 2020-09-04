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

const execute = (orderBook: OrderBook): Trade | Error => {
  return new Error('Not Implemented!')
}

const add = (orderBook: OrderBook, order: Order): Trade | Error => {
  if (orderBook.ticker !== order.ticker) {
    return new Error('Fail: OrderBook has to match Order ticker')
  }

  if(order.side === 'Buy') orderBook.buyOrders.push(order)  //todo: replace array with better data structure
  if(order.side === 'Sell') orderBook.sellOrders.push(order)  //todo: replace array with better data structure
  
  let result = execute(orderBook) //todo: raise event (?), extract executor into separate file?
  return result
}

const cancel = (orderBook: OrderBook, order: Order): true | Error => {
  return new Error('Not Implemented!')
}

export { OrderBook, create, add, cancel }
