import { Order, OrderBook, Bids, Trade, Ticker } from './model'
import { log } from './utils'

const orders = new Map<number, Order>()
const orderBook: OrderBook = new Map<Ticker, { buyBids: Bids; sellBids: Bids}>()
const sortAsc = (a:any, b:any) =>  (a[1].limit > b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)
const sortDsc = (a:any, b:any) =>  (a[1].limit < b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)

const getOrder = (id: number): Order => {
  let order = orders.get(id) as Order
  if (!order) {
    throw new Error(`Orderbook.getOrder: Order with id: ${id} not found`)
  }
  return order
}

const cancelOrder = (id: number): boolean => {
  let order = getOrder(id)

  const index = 0
  let ticker: Ticker = 'None'
  ticker = order.ticker
  let bids = orderBook.get(ticker)
  if (!bids) {
    throw new Error(`Orderbook: Bids for ticker: ${ticker} not found`)
  }

  if (order.side === 'Buy') {
    bids.buyBids.delete(id)
  }
  else if (order.side === 'Sell') {
    bids.sellBids.delete(id)
  }
  else {
    throw new Error(`Orderbooks: invalid side: ${order.side}`)
  }

  //todo: log audit of (all) changes or use persisted data structures
  order.status = 'Canceled'
  orders.set(id, order)
  return true
}

function process(order: Order): Trade {
  orders.set(order.id, order)

  let trade: Trade = {
    ticker: order.ticker,
    price: 0,
    quantity: 0, //todo: match(needs to return number of executed shares
    buyOrderId: order.id,
    sellOrderId: order.id,
    createdAt: new Date().getTime(),
    message: 'NoOrder'
  }

  if (match(order, trade)) {
    trade.message = 'Success'
  }
  return trade
}

function match (order: Order, trade: Trade): boolean {
  let bids = orderBook.get(order.ticker)
  if (!bids) {
    log(`Orderbook.match: Bids for ticker: ${order.ticker} not found`)
    return false
  }

  if (order.side === 'Buy') {
    if (canBuy(bids.buyBids, order.limit)) {
      execute(order.id, bids.buyBids, trade)
    }
    bids.buyBids.set(order.id, order)
    let sorted = new Map([...bids.buyBids].sort(sortAsc))
    bids.buyBids = sorted
    return true
  } 
  
  if (order.side === 'Sell') {
    if (canSell(bids.sellBids, order.limit)) {
      execute(order.id, bids.sellBids, trade)
    }
    bids.sellBids.set(order.id, order)
    let sorted = new Map([...bids.sellBids].sort(sortDsc))
    bids.sellBids = sorted
    return true
  }
  throw new Error(`Orderbook: invalid order side: ${order}`)
}

function execute(id: number, bids: Bids, trade: Trade): boolean {
  let matchingOrder = bids.get(id)
  if(matchingOrder) {
    trade.price = matchingOrder.limit
    trade.quantity = getQuantity(trade.quantity, matchingOrder.limit)
    return true
  }
  return false
}

function getQuantity(orderQuantity: number, bidQuantity: number): number {
  if(bidQuantity < orderQuantity) {
    return bidQuantity 
  }
  return orderQuantity 
}

function canBuy (bids: Bids, limit: number): boolean {
  if (bids.size === 0) {
    return false // No sellers
  }
  if (bids.entries().next().value[1].limit <= limit) {
    return true // there are sellers at given or better price
  }
  return false
}

function canSell (bids: Bids, limit: number): boolean {
  if (bids.size === 0) {
    return false // no buyers
  }
  if (bids.entries().next().value[1].limit >= limit) {
    return true // there are buyers at given or better price
  }
  return false
}

export {  getOrder, process, cancelOrder }
