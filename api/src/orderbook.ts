import { Order, OrderBook, Bids, Ticker, MarketResponse } from './model'
import { fromString, createAsString } from './orderid'
import { log } from './utils'

const emptyOrder: Order = {
  id: createAsString('None', 'None'),
  ticker: 'None',
  side: 'None',
  limit: 0,
  quantity: 0,
  filledQuantity: 0,
  status: 'None',
  createdAt: new Date().getTime()
}

const OrderBook: OrderBook = new Map<Ticker, Bids>()
const sortAsc = (a: any, b: any) =>
  (a[1].limit > b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)
const sortDsc = (a: any, b: any) =>
  (a[1].limit < b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)

const getOrder = (id: string): Order => {
  let orderId = fromString(id)  //validate
  let orderBook = OrderBook.get(orderId.ticker)
  if (!orderBook) {
    throw new Error(`Orderbook: Bids for ticker: ${orderId.ticker} not found`)
  }

  let order =
    orderId.side === 'Buy'
      ? orderBook.buy.get(id)
      : orderBook.sell.get(id)
  if (!order) {
    throw new Error(`Orderbook.getOrder: Order with id: ${id} not found`)
  }
  return order
}

const cancelOrder = (id: string): boolean => {
  let order = getOrder(id)

  let ticker: Ticker = 'None'
  ticker = order.ticker
  let orderBook = OrderBook.get(ticker)
  if (!orderBook) {
    throw new Error(`Orderbook: Bids for ticker: ${ticker} not found`)
  }

  if (order.side === 'Buy') {
    orderBook.buy.delete(id)
  } else if (order.side === 'Sell') {
    orderBook.sell.delete(id)
  } else {
    throw new Error(`Orderbooks: invalid side: ${order.side}`)
  }

  //todo: log audit of (all) changes or use persisted data structures
  order.status = 'Canceled'
  updateOrderBook(order)
  return true
}

function updateOrderBook (order: Order): Bids {
  if (!OrderBook.has(order.ticker)) {
    log(`Orderbook.process: Empty OrderBook for ticker: ${order.ticker}`)
    OrderBook.set(order.ticker, {
      buy: new Map<string, Order>(),
      sell: new Map<string, Order>()
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

function match (order: Order): MarketResponse {
  let bids = updateOrderBook(order)

  let trade
  let matchingOrder = tradePossible(order, bids)
  if (matchingOrder) {
    trade = {
              ticker: order.ticker,
              price: matchingOrder.limit,
              quantity: getQuantity(order.quantity, matchingOrder.quantity),
              buyOrderId: order.side === 'Buy' ? order.id : matchingOrder.id,
              sellOrderId: order.side === 'Sell' ? order.id : matchingOrder.id,
              createdAt: new Date().getTime(),
              message: 'Success'
            }
    if (trade.quantity < order.quantity) {
      order.status = 'Open'
      order.filledQuantity = order.quantity - trade.quantity
    } else if (trade.quantity === order.quantity) {
      order.status = 'Completed'
      order.filledQuantity = order.quantity
    } else {
      throw new Error(`Orderbook: Invalid order: ${order} state after trade execution`)
    }
  }

  return { order, trade }
}

function tradePossible(order: Order, bids: Bids): Order {
  if (bids.buy.size === 0) {
    return emptyOrder
  }

  if (order.side === 'Buy') {
    let matchingOrder = bids.buy.entries().next().value[1]
    if (matchingOrder.status === 'Open' && matchingOrder.limit <= order.limit) {
      return matchingOrder // there are sellers at given or better price
    }
  }

  // Sell side
  let matchingOrder = bids.sell.entries().next().value[1]
  if (matchingOrder.status === 'Open' && matchingOrder.limit >= order.limit) {
    return matchingOrder // there are buyers at given or better price
  }

  return emptyOrder
}

function getQuantity (orderQuantity: number, bidQuantity: number): number {
  if (bidQuantity < orderQuantity) {
    return bidQuantity
  }
  return orderQuantity
}

export { getOrder, match, cancelOrder }
