import { Order, OrderBook, Bids, Trade, Ticker, Side } from './model'
import { log } from './utils'

const Orders = new Map<number, Order>()
const OrderBook: OrderBook = new Map<Ticker, Bids>()
const sortAsc = (a:any, b:any) =>  (a[1].limit > b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)
const sortDsc = (a:any, b:any) =>  (a[1].limit < b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)

const getOrder = (id: number): Order => {
  let order = Orders.get(id) as Order
  if (!order) {
    throw new Error(`Orderbook.getOrder: Order with id: ${id} not found`)
  }
  return order
}

const cancelOrder = (id: number): boolean => {
  let order = getOrder(id)

  let ticker: Ticker = 'None'
  ticker = order.ticker
  let orderBook = OrderBook.get(ticker)
  if (!orderBook) {
    throw new Error(`Orderbook: Bids for ticker: ${ticker} not found`)
  }

  if (order.side === 'Buy') {
    orderBook.buy.delete(id)
  }
  else if (order.side === 'Sell') {
    orderBook.sell.delete(id)
  }
  else {
    throw new Error(`Orderbooks: invalid side: ${order.side}`)
  }

  //todo: log audit of (all) changes or use persisted data structures
  order.status = 'Canceled'
  Orders.set(id, order)
  return true
}

function setOrderBook(order: Order): Bids {
  if (!OrderBook.has(order.ticker)) {
    log(`Orderbook.process: Empty OrderBook for ticker: ${order.ticker}`)
    OrderBook.set(order.ticker, {
                            buy: new Map<number, Order>(),
                            sell: new Map<number, Order>()
                          })
  }
  let bids = OrderBook.get(order.ticker) as Bids
  if (order.side === 'Buy') {
    bids.buy.set(order.id, order)
    let sorted = new Map([...bids.buy].sort(sortAsc))
    bids.buy = sorted
  } else {
    bids.sell.set(order.id, order)
    let sorted = new Map([...bids.buy].sort(sortDsc))
    bids.sell = sorted
  }

  return bids
}

function match(order: Order): Trade {
  Orders.set(order.id, order)
  let bids = setOrderBook(order)
 
  if (order.side === 'Buy') {
    let matchingOrder = canBuy(bids, order.limit)
    if(matchingOrder) {
      return execute(order.side, order, matchingOrder as Order)
    }
  } 
  
  if (order.side === 'Sell') {
    let matchingOrder = canSell(bids, order.limit)
    if(matchingOrder) {
      return execute(order.side, order, matchingOrder as Order)
    }
  }
  throw new Error(`Orderbook.process: invalid order side: ${order}`)
}

function execute(side: Side, order: Order, matchingOrder: Order): Trade {
  return {
    ticker: order.ticker,
    price: matchingOrder.limit,
    quantity: getQuantity(order.quantity, matchingOrder.quantity),
    buyOrderId: side === 'Buy' ? order.id : matchingOrder.id,
    sellOrderId: side === 'Sell' ? order.id : matchingOrder.id,
    createdAt: new Date().getTime(),
    message: 'Success'
  }
}

function getQuantity(orderQuantity: number, bidQuantity: number): number {
  if(bidQuantity < orderQuantity) {
    return bidQuantity 
  }
  return orderQuantity 
}

function canBuy (bids: Bids, limit: number): Order | boolean {
  if (bids.buy.size === 0) {
    return false // No sellers
  }
  let order = bids.buy.entries().next().value[1]
  if(order.limit <= limit) {
    return order // there are sellers at given or better price
  }
  return false
}

function canSell (bids: Bids, limit: number): Order | boolean {
  if (bids.sell.size === 0) {
    return false // no buyers
  }
  let order = bids.sell.entries().next().value[1]
  if(order.limit >= limit) {
    return order // there are buyers at given or better price
  }
  return false
}

function saveOrder(order: Order) {
  Orders.set(order.id, order)
}

export {  getOrder, match, saveOrder, cancelOrder }
