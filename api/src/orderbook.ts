import { IOrder, OrderBook, LiveOrders, Ticker, MarketResponse } from './model'
import { getEmptyOrder } from './order'
import OrderId from './orderid'
import { log } from './utils'

const OrderBook: OrderBook = new Map<Ticker, LiveOrders>()
const sortAsc = (a: any, b: any) =>
  (a[1].limit > b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)
const sortDsc = (a: any, b: any) =>
  (a[1].limit < b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)

const getOrder = (id: string): IOrder => {
  let orderId = OrderId.fromString(id) //validate
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
  
  order.cancel()
  deleteFromOrderBook(order) 
  return true
}

function deleteFromOrderBook(order: IOrder): void {
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

function updateOrder (order: IOrder): LiveOrders {
  order.update()

  let liveOrders = OrderBook.get(order.ticker) as LiveOrders
  if (liveOrders && order.side === 'Buy') {
    liveOrders.buy.set(order.id, order)
  }

  if (liveOrders && order.side === 'Sell') {
    liveOrders.sell.set(order.id, order)
  }

  return liveOrders
}

function insertOrder (order: IOrder): LiveOrders {
  let liveOrders = OrderBook.get(order.ticker) as LiveOrders
  if (liveOrders && order.side === 'Buy') {
    liveOrders.buy.set(order.id, order)
    let sorted = new Map([...liveOrders.buy].sort(sortAsc))
    liveOrders.buy = sorted
  }

  if (liveOrders && order.side === 'Sell') {
    liveOrders.sell.set(order.id, order)
    let sorted = new Map([...liveOrders.sell].sort(sortDsc))
    liveOrders.sell = sorted
  }

   return liveOrders
}

function match (order: IOrder): MarketResponse {
  if (!OrderBook.has(order.ticker)) {
    log(`Orderbook.match: initiate new OrderBook for ticker: ${order.ticker}`)
    OrderBook.set(order.ticker, {
      buy: new Map<string, IOrder>(),
      sell: new Map<string, IOrder>()
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

  let quantity = order.quantity > matchOrder.quantity ? matchOrder.quantity : order.quantity
  log(`Orderbook.match: before: order quantity ${order.quantity}, matchOrder quantity: ${matchOrder.quantity}, after: order quantity ${quantity}`)

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

function getMatchOrder (order: IOrder, liveOrders: LiveOrders): IOrder {
  if (order.side === 'Buy') {
    if (liveOrders.sell.size === 0) {
      log(`Orderbook.getMatchOrder: no BUY trade possible: no SELL side orders`)
      return order
    }
    let matchOrder = liveOrders.sell.entries().next().value[1]
    if (matchOrder.status === 'Open' && matchOrder.limit <= order.limit) {
      log(`Orderbook.getMatchOrder: MATCH order on the SELL side found`)
      return matchOrder // there are sellers at given or better price
    }
    log(`Orderbook.getMatchOrder : no MATCH order on the SELL side found`)
    return order
  }

  if (order.side === 'Sell') {
    if (liveOrders.buy.size === 0) {
      log(`Orderbook.getMatchOrder: no SELL trade possible: no BUY sideeorders`)
      return order
    }
    let matchingOrder = liveOrders.buy.entries().next().value[1]
    if (matchingOrder.status === 'Open' && matchingOrder.limit >= order.limit) {
      log(`Orderbook.getMatchOrder: MATCH order on the BUY side found`)
      return matchingOrder // there are buyers at given or better price
    }
    log(`Orderbook.getMatchOrder : no MATCH order on the BUY side found`)
    return order
  }

  return getEmptyOrder()
}

export { getOrder, match, cancelOrder }
