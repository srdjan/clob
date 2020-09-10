import { IOrder, OrderBooks, OrderBook, Ticker, MarketResponse } from './model'
import { getEmptyOrder } from './order'
import OrderId from './orderid'
import { log } from './utils'

const OrderBooks: OrderBooks = new Map<Ticker, OrderBook>()

const sortAscByLimit = (a: any, b: any) =>
  (a[1].limit > b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)
const sortDscByLimit = (a: any, b: any) =>
  (a[1].limit < b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)
const sortDscByTimestamp = (a: any, b: any) =>
  (a[1].createdAt < b[1].createdAt && 1) ||
  (a[1].createdAt === b[1].createdAt ? 0 : -1)

const getOrder = (id: string): IOrder => {
  let orderId = OrderId.fromString(id) //validate
  let orderBook = OrderBooks.get(orderId.ticker)
  if (!orderBook) {
    throw new Error(
      `Orderbook.getOrder: Orders for ticker: ${orderId.ticker} not found`
    )
  }

  let order =
    orderId.side === 'Buy'
      ? orderBook.buySide.get(id)
      : orderBook.sellSide.get(id)
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
  deleteOrder(order)
  return true
}

function deleteOrder (order: IOrder): void {
  let orderBook = OrderBooks.get(order.ticker)
  if (!orderBook) {
    throw new Error(
      `Orderbook.deleteOrder: OrderBook for ticker:${order.ticker} not found`
    )
  }

  if (order.side === 'Buy') {
    orderBook.buySide.delete(order.id)
    let sorted = new Map([...orderBook.buySide].sort(sortAscByLimit))
    orderBook.buySide = sorted
  } else {
    orderBook.sellSide.delete(order.id)
    let sorted = new Map([...orderBook.sellSide].sort(sortDscByLimit))
    orderBook.sellSide = sorted
  }
}

function updateOrder (order: IOrder): OrderBook {
  order.update()

  let orderBook = OrderBooks.get(order.ticker) as OrderBook
  if (orderBook && order.side === 'Buy') {
    orderBook.buySide.set(order.id, order)
  }

  if (orderBook && order.side === 'Sell') {
    orderBook.sellSide.set(order.id, order)
  }

  return orderBook
}

function insertOrder (order: IOrder): OrderBook {
  if (!OrderBooks.has(order.ticker)) {
    log(`Orderbooks.insertOrder: initiate new OrderBook for ticker: ${order.ticker}`)
    OrderBooks.set(order.ticker, {
      buySide: new Map<string, IOrder>(),
      sellSide: new Map<string, IOrder>()
    })
  }

  let bookOrder = OrderBooks.get(order.ticker) as OrderBook
  if (bookOrder && order.side === 'Buy') {
    bookOrder.buySide.set(order.id, order)
    let sorted = new Map([...bookOrder.buySide].sort(sortAscByLimit))
    bookOrder.buySide = sorted
  }

  if (bookOrder && order.side === 'Sell') {
    bookOrder.sellSide.set(order.id, order)
    let sorted = new Map([...bookOrder.sellSide].sort(sortDscByLimit))
    bookOrder.sellSide = sorted
  }

  return bookOrder
}

function getOrders (ticker: Ticker): IOrder[] {
  let orderBook = OrderBooks.get(ticker)
  if (!orderBook) {
    throw new Error(
      `Orderbook.getOrderBook: Orders for ticker: ${ticker} not found`
    )
  }
  let merged = Array.from(orderBook.buySide.values()).concat(Array.from(orderBook.sellSide.values()))
  let sorted = merged.sort((a, b) => a.createdAt - b.createdAt)

  log(`\n\SORTED book: ${JSON.stringify(sorted)}`)

  return sorted
}
export { getOrders, getOrder, insertOrder, updateOrder, cancelOrder }
