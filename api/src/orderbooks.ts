import { uuid } from 'uuidv4'
import {
  Ticker,
  Order,
  Side,
  Trade
} from './model'
import { getTrader } from './traders'
import { Result } from './utils'

type OrderBook = {
  buyOrders: Order[] //todo: just a placeholder, more appropriate data structure required
  sellOrders: Order[] //todo: just a placeholder, more appropriate data structure required
}
const orderBooks = new Map<Ticker, OrderBook>()

const create = (ticker: Ticker): OrderBook => {
  if (orderBooks.has(ticker)) {
    return orderBooks.get(ticker) as OrderBook
  }

  let orderBook = {
    buyOrders: new Array<Order>(),
    sellOrders: new Array<Order>()
  }
  orderBooks.set(ticker, orderBook)
  return orderBook
}

const execute = (orderBook: OrderBook): Result<Trade> => {
  //todo: 
  // match prices
  // execute trade
  // log trade
  return {
    outcome: false,
    message: 'Not implemented yet'
  }
}

const add = (userName: string, side: Side, ticker: Ticker, limit: number, quantity: number): Order => {
  let trader = getTrader(userName)

  // check if the orderbook for requested ticker exist, and create if not
  let orderBook = orderBooks.get(ticker)
  if (!orderBook) {
    orderBook = create(ticker)
  }

  // create order
  let order: Order = {
    id: uuid(),
    trader: trader,
    ticker: ticker,
    side: side,
    limit: limit,
    quantity: quantity,
    filledQuantity: 0,
    status: 'Open',
    createdAt: new Date().getTime()
  }

  // persist the order
  if(order.side === 'Buy') orderBook.buyOrders.push(order)  //todo: replace array with better data structure
  if(order.side === 'Sell') orderBook.sellOrders.push(order)  //todo: replace array with better data structure
  
  // find if there are matching orders to execute
  let result = execute(orderBook) //todo: extract executor into separate file?
  if (!result.outcome) {
    return order
  }
  if(result && result.data && result.data.quantity < quantity) {
    order.status = 'Open'
    order.filledQuantity = quantity - result.data.quantity
  }
  else if (result && result.data && result.data.quantity === quantity) {
    order.status = 'Completed'
    order.filledQuantity = quantity
  }
  else {
    throw new Error('Invalid state after trade execution')
  }
  return order
}

const cancel = (order: Order): boolean => {
  let orderBook = orderBooks.get(order.ticker)
  if (!orderBook) {
    //todo: add logging
    return true
  }

  let result = orderBooks.delete(order.ticker)
  if(!result) {
    //todo: add logging
  }
  return result
}

export { add, cancel }
