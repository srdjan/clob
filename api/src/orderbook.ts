import { Order, OrderBook, Orders, OrderHistory, Ticker, MarketResponse } from './model'
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
  createdAt: new Date ().getTime()
}

const OrderHistory= new Map<string, Order>()
const OrderBook: OrderBook = new Map<Ticker, Orders>()
const sortAsc = (a: any, b: any) =>
  (a[1].limit > b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)
const sortDsc = (a: any, b: any) =>
  (a[1].limit < b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)

const getOrder = (id: string): Order => {
  let orderId = fromString(id) //validate
  let orderBook = OrderBook.get(orderId.ticker)
  if (!orderBook) {
    throw new Error(`Orderbook.getOrder: Orders for ticker: ${orderId.ticker} not found`)
  }

  let order = orderId.side === 'Buy' ? orderBook.buy.get(id) : orderBook.sell.get(id)
  if (!order) {
    throw new Error(`Orderbook.getOrder: Order with id: ${id} not found`)
  }
  return order
}

function cancelOrder (id: string): boolean {
  let order = getOrder(id)
  if (!order) {
    throw new Error(`Orderbook.cancelOrder: Order for id:${id} not found`)
  }
  
  order.status = 'Canceled'
  OrderHistory.set(order.id, order)
  
  deleteOrder(order) 
  return true
}

function deleteOrder(order: Order): void {
  let orderBook = OrderBook.get(order.ticker)
  if (!orderBook) {
    throw new Error(`Orderbook.deleteOrder: OrderBook for ticker:${order.ticker} not found`)
  }

  if(order.side === 'Buy') {
    orderBook.buy.delete(order.id)
    let sorted = new Map([...orderBook.buy].sort(sortAsc))
    orderBook.buy = sorted
   }
   else {
     orderBook.sell.delete(order.id)
    let sorted = new Map([...orderBook.sell].sort(sortDsc))
    orderBook.sell = sorted
   } 
}

function updateOrder (order: Order): Orders {
  OrderHistory.set(order.id, order)

  let orders = OrderBook.get(order.ticker) as Orders
  if (orders && order.side === 'Buy') {
    orders.buy.set(order.id, order)
  }

  if (orders && order.side === 'Sell') {
    orders.sell.set(order.id, order)
  }

  return orders
}

function insertOrder (order: Order): Orders {
  OrderHistory.set(order.id, order)

  let orders = OrderBook.get(order.ticker) as Orders
  if (orders && order.side === 'Buy') {
    orders.buy.set(order.id, order)
    let sorted = new Map([...orders.buy].sort(sortAsc))
    orders.buy = sorted
  }

  if (orders && order.side === 'Sell') {
    orders.sell.set(order.id, order)
    let sorted = new Map([...orders.sell].sort(sortDsc))
    orders.sell = sorted
  }

   return orders
}

function match (order: Order): MarketResponse {
  if (!OrderBook.has(order.ticker)) {
    log(`Orderbook.match: initiate new OrderBook for ticker: ${order.ticker}`)
    OrderBook.set(order.ticker, {
      buy: new Map<string, Order>(),
      sell: new Map<string, Order>()
    })
  }

  let orders = insertOrder(order)

  let trade = {
    ticker: order.ticker,
    price: 0,
    quantity: 0,
    buyOrderId: '',
    sellOrderId: '',
    createdAt: new Date().getTime(),
    message: 'Fail'
  }

  let matchOrder = getMatchOrder(order, orders)
  if (matchOrder.status === 'None') {
    log(`Orderbook.match: no trade possible: NO matching order`)
    return { order, trade }
  }
  if (matchOrder.trader.username === order.trader.username) {
    log(`Orderbook.match: no trade possible: SAME trader on both sides`)
    return { order, trade }
  }

  log(`Orderbook.match: order quantity ${order.quantity}, matchOrder quantity: ${matchOrder.quantity}`)
  let quantity = order.quantity > matchOrder.quantity ? matchOrder.quantity : order.quantity
  log(`Orderbook.match: order quantity ${quantity}`)

  trade.price = matchOrder.limit
  trade.quantity = quantity
  trade.buyOrderId = order.side === 'Buy' ? order.id : matchOrder.id
  trade.sellOrderId = order.side === 'Sell' ? order.id : matchOrder.id
  trade.message = 'Success'
  log(`Orderbook.match: saved trade ${JSON.stringify(trade)}`)

  if (order.quantity > trade.quantity) {
    order.status = 'Partial'
    order.filledQuantity = trade.quantity
  } else if (order.quantity === trade.quantity) {
    order.status = 'Completed'
    order.filledQuantity = order.quantity
  } 
  updateOrder(order)
  log(`Orderbook.match: saved order ${JSON.stringify(order)}`)

  if (matchOrder.quantity > trade.quantity) {
    matchOrder.status = 'Partial'
    matchOrder.filledQuantity = trade.quantity
  } else if (matchOrder.quantity === trade.quantity) {
    matchOrder.status = 'Completed'
    matchOrder.filledQuantity = order.quantity
  }
  updateOrder(matchOrder)
  log(`Orderbook.match: saved matchingOrder ${JSON.stringify(matchOrder)}`)

  return { order, trade }
}

function getMatchOrder (order: Order, orders: Orders): Order {
  if (order.side === 'Buy') {
    if (orders.sell.size === 0) {
      log(`Orderbook.getMatchOrder: no BUY trade possible: no SELL side orders`)
      return emptyOrder
    }
    let matchOrder = orders.sell.entries().next().value[1]
    if (matchOrder.status === 'Open' && matchOrder.limit <= order.limit) {
      log(`Orderbook.getMatchOrder: MATCH order on the SELL side found`)
      return matchOrder // there are sellers at given or better price
    }
    log(`Orderbook.getMatchOrder : no MATCH order on the SELL side found`)
    return emptyOrder
  }

  if (order.side === 'Sell') {
    if (orders.buy.size === 0) {
      log(`Orderbook.getMatchOrder: no SELL trade possible: no BUY sideeorders`)
      return emptyOrder
    }
    let matchingOrder = orders.buy.entries().next().value[1]
    if (matchingOrder.status === 'Open' && matchingOrder.limit >= order.limit) {
      log(`Orderbook.getMatchOrder: MATCH order on the BUY side found`)
      return matchingOrder // there are buyers at given or better price
    }
    log(`Orderbook.getMatchOrder : no MATCH order on the BUY side found`)
    return emptyOrder
  }

  return emptyOrder
}

export { getOrder, match, cancelOrder }
