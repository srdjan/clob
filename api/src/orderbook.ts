import { Order, OrderBook, Bids, Ticker, MarketResponse } from './model'
import { fromString, createAsString } from './orderid'
import { log } from './utils'

const emptyOrder: Order = {
  id: createAsString('None', 'None'),
  trader: {username: '', password: ''},
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
  let orderId = fromString(id) //validate
  let orderBook = OrderBook.get(orderId.ticker)
  if (!orderBook) {
    throw new Error(`Orderbook: Bids for ticker: ${orderId.ticker} not found`)
  }

  let order =
    orderId.side === 'Buy' ? orderBook.buy.get(id) : orderBook.sell.get(id)
  if (!order) {
    throw new Error(`Orderbook.getOrder: Order with id: ${id} not found`)
  }
  return order
}

function cancelOrder (id: string): boolean {
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
  if (bids && order.side === 'Buy') {
    bids.buy.set(order.id, order)
    let sorted = new Map([...bids.buy].sort(sortAsc))
    bids.buy = sorted
  }

  if (bids && order.side === 'Sell') {
    bids.sell.set(order.id, order)
    let sorted = new Map([...bids.sell].sort(sortDsc))
    bids.sell = sorted
  }

   return bids
}

function match (order: Order): MarketResponse {
  let bids = updateOrderBook(order)

  let trade = {
    ticker: order.ticker,
    price: 0,
    quantity: 0,
    buyOrderId: '',
    sellOrderId: '',
    createdAt: new Date().getTime(),
    message: 'Fail'
  }

  let matchingOrder = getMatchingOrder(order, bids)
  if (matchingOrder && matchingOrder !== emptyOrder) {
    if (matchingOrder.trader.username === order.trader.username) {
      return { order, trade }
    }

    trade.price = matchingOrder.limit
    trade.quantity = order.quantity > matchingOrder.quantity ? matchingOrder.quantity : order.quantity
    trade.buyOrderId = order.side === 'Buy' ? order.id : matchingOrder.id
    trade.sellOrderId = order.side === 'Sell' ? order.id : matchingOrder.id
    trade.message = 'Success'

    if (order.quantity > trade.quantity) {
      order.status = 'Partial'
      order.filledQuantity = trade.quantity
    } else if (order.quantity === trade.quantity) {
      order.status = 'Completed'
      order.filledQuantity = order.quantity
    } 
  }

  return { order, trade }
}

function getMatchingOrder (order: Order, bids: Bids): Order {
  if (order.side === 'Buy') {
    if (bids.sell.size === 0) {
      log(`getMatchingOrder: No BUY trade possible: bids.SELL.size is 0`)
      return emptyOrder
    }
    let matchingOrder = bids.sell.entries().next().value[1]
    if (
      matchingOrder.status === 'Open' &&
      matchingOrder.limit <= order.limit
    ) {
      log(`getMatchingOrder: matching SELL side found`)
      return matchingOrder // there are sellers at given or better price
    }
    else {
      log(`getMatchingOrder: No SELL side MATCH, ${JSON.stringify(matchingOrder)}`)
      return emptyOrder
    }
  }

  if (order.side === 'Sell') {
    if (bids.buy.size === 0) {
      log(`getMatchingOrder: No SELL trade possible: bids.BUY.size is 0`)
      return emptyOrder
    }
    let matchingOrder = bids.buy.entries().next().value[1]
    if (matchingOrder.status === 'Open' && matchingOrder.limit >= order.limit) {
      log(`getMatchingOrder: matching BUY side found`)
      return matchingOrder // there are buyers at given or better price
    }
    else {
      log(`getMatchingOrder : No BUY side MATCH, `)
      return emptyOrder
    }
  }
  return emptyOrder
}

export { getOrder, match, cancelOrder }
