import {
  Ticker,
  Order,
  Side,
  Trade
} from './model'
import * as Traders from './traders'
import { Result, Uid, getUid, log } from './utils'

type OrderBook = {
  buyOrders: Map<Uid, Order>
  sellOrders: Map<Uid, Order> 
}
const orderBooks = new Map<Ticker, OrderBook>()

const create = (ticker: Ticker): OrderBook => {
  if (orderBooks.has(ticker)) {
    return orderBooks.get(ticker) as OrderBook
  }

  let orderBook = {
    buyOrders: new Map<Uid, Order>(),//todo: just a placeholder, more appropriate data structure required
    sellOrders: new Map<Uid, Order>()//todo: just a placeholder, more appropriate data structure required
  }
  orderBooks.set(ticker, orderBook)
  return orderBook
}

const match = (orderBook: OrderBook): Result<Trade> => {
  //todo: 
  // match prices
  // execute trade
  // log trade
  return {
    outcome: false,
    message: 'Not implemented yet'
  }
}

const bid = (userName: string, side: Side, ticker: Ticker, limit: number, quantity: number): Order => {
  let trader = Traders.get(userName, side)

  // check if the orderbook for requested ticker exist, and create if not
  let orderBook = orderBooks.get(ticker)
  if (!orderBook) {
    orderBook = create(ticker)
  }

  // create order
  let order: Order = {
    id: getUid(),
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
  if(order.side === 'Buy') orderBook.buyOrders.set(ticker, order)  
  if(order.side === 'Sell') orderBook.sellOrders.set(ticker, order)  
  
  // find if there are matching orders to execute
  let result = match(orderBook) //todo: extract executor into separate file?
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
    throw new Error(`Orderbooks: Invalid state after trade execution`)
  }
  return order
}

const cancel = (userName: string, id: Uid, ticker: Ticker, side: Side): boolean => {
  Traders.verify(userName)

  let orderBook = orderBooks.get(ticker)
  if (!orderBook) {
    log(`Orderbooks: Invalid request, OrderBook for ${ticker} not found`)
    throw new Error(`Order Book not found for ${ticker}`)
  }

  let order: Order
  if (side === 'Buy') {
    order = orderBook.buyOrders.get(id) as Order
    if(order.status === 'Open' || order.status === 'Partial') {
      order.status = 'Canceled'
      orderBook.buyOrders.set(id, order)
    }
  }
  else if (side === 'Sell') {
    order = orderBook.sellOrders.get(id) as Order
    if(order.status === 'Open' || order.status === 'Partial') {
      order.status = 'Canceled'
      orderBook.sellOrders.set(id, order)
    }
  }
  else {
    throw new Error(`Orderbooks: Invalid request, OrderBook ${side} incorrect`)
  }

  log(`Orderbooks: Order with id: ${id}  canceled`)
  return true
}

export { bid, cancel }
