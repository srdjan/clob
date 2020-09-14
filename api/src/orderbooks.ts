import { IOrder, OrderBooks, OrderBook, OrderTicker, Ticker } from './model'
import { getEmptyOrder } from './order'
import OrderId from './orderid'
import { log } from './utils'

const OrderBooks: OrderBooks = new Map<Ticker, OrderBook>()

const _sortAscByLimit = (a: any, b: any) =>
  (a[1].limit > b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)
const _sortDscByLimit = (a: any, b: any) =>
  (a[1].limit < b[1].limit && 1) || (a[1].limit === b[1].limit ? 0 : -1)

function getOrderBook (ticker: Ticker): OrderTicker {
  let orderBook = OrderBooks.get(ticker)
  if (!orderBook) {
    log(`OrderBooks.getTicker: initiate new OrderBook for: ${ticker}`)
    return { buys: [], sells: [] } 
  }
  let buys = Array.from(orderBook.buySide.values()).sort((a,b) => b.limit - a.limit)
  let sells = Array.from(orderBook.sellSide.values()).sort((a,b) => a.limit - b.limit)
  
  let openBuys = buys.filter(o => o.status === 'Open')
  log(`OPEN BUYS: ${JSON.stringify(openBuys)}`)

  let openSells = sells.filter(o => o.status === 'Open')
  log(`OPEN SELLS: ${JSON.stringify(openSells)}`)

  return { buys: openBuys, sells: openSells }
}

function getOrderHistory (ticker: Ticker): IOrder[] {
  let orderBook = OrderBooks.get(ticker)
  if (!orderBook) {
    log(`OrderBooks.getAll: initiate new OrderBook for: ${ticker}`)
    OrderBooks.set(ticker, {
      buySide: new Map<string, IOrder>(),
      sellSide: new Map<string, IOrder>()
    })
    return new Array<IOrder>()
  }

  let merged = Array.from(orderBook.buySide.values()).concat(
    Array.from(orderBook.sellSide.values())
  )
  let sorted = merged.sort((a, b) => a.createdAt - b.createdAt)
  return sorted
}

const get = (id: string): IOrder => {
  let orderId = OrderId.fromString(id) //validate
  let orderBook = OrderBooks.get(orderId.ticker)
  if (!orderBook) {
    OrderBooks.set(orderId.ticker, {
      buySide: new Map<string, IOrder>(),
      sellSide: new Map<string, IOrder>()
    })
    return getEmptyOrder()
  }

  let order =
    orderId.side === 'Buy'
      ? orderBook?.buySide.get(id)
      : orderBook?.sellSide.get(id)
  if (!order) {
    throw new Error(`Orderbooks.getOrder: Order with id: ${id} not found`)
  }
  return order
}

function cancel (id: string): boolean {
  let order = get(id)
  if (!order) {
    throw new Error(`Orderbook.cancelOrderById: Order for id:${id} not found`)
  }

  let orderBook = OrderBooks.get(order.ticker)
  if (!orderBook) {
    throw new Error(
      `Orderbook.deleteOrderById: OrderBook for ticker:${order.ticker} not found`
    )
  }

  return _remove(orderBook, order)
}

function _remove (orderBook: OrderBook, order: IOrder): boolean {
  order.cancel()

  if (order.side === 'Buy') {
    orderBook.buySide.delete(order.id)
    let sorted = new Map([...orderBook.buySide].sort(_sortAscByLimit))
    orderBook.buySide = sorted
  } else {
    orderBook.sellSide.delete(order.id)
    let sorted = new Map([...orderBook.sellSide].sort(_sortDscByLimit))
    orderBook.sellSide = sorted
  }
  return true
}

function update (orderBook: OrderBook, order: IOrder): void {
  order.update()

  if (orderBook && order.side === 'Buy') {
    orderBook.buySide.set(order.id, order)
  }

  if (orderBook && order.side === 'Sell') {
    orderBook.sellSide.set(order.id, order)
  }
}

function insert (order: IOrder): OrderBook {
  if (!OrderBooks.has(order.ticker)) {
    log(`Orderbooks.insert: initiate new OrderBook for ticker: ${order.ticker}`)
    OrderBooks.set(order.ticker, {
      buySide: new Map<string, IOrder>(),
      sellSide: new Map<string, IOrder>()
    })
  }

  let orderBook = OrderBooks.get(order.ticker) as OrderBook
  if (orderBook && order.side === 'Buy') {
    orderBook.buySide.set(order.id, order)
    let sorted = new Map([...orderBook.buySide].sort(_sortAscByLimit))
    log(`sorted buys: ${JSON.stringify(sorted.entries())}`)
    orderBook.buySide = sorted
  }

  if (orderBook && order.side === 'Sell') {
    orderBook.sellSide.set(order.id, order)
    let sorted = new Map([...orderBook.sellSide].sort(_sortDscByLimit))
    log(`sorted sells: ${JSON.stringify(sorted.entries())}`)
    orderBook.sellSide = sorted
  }

  return orderBook
}

function clearAll(): void {
  OrderBooks.clear()
}

export { getOrderHistory, getOrderBook, get, insert, update, cancel, clearAll }
