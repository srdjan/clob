import { Order } from './order'
import { Ticker, Side, IOrder } from './model'
import * as OrderBooks from './orderbooks'
import * as OrderBook from './engine'
import * as Traders from './traders'
import { log } from './utils'

const find = (id: string): string => {
  try {
    return JSON.stringify(OrderBooks.get(id))
  } catch (e) {
    log(`Market.find: unexpected error, orderId: ${id}`)
  }
  return JSON.stringify({ Result: 'Unexpected Error' })
}

const post = (
  username: string,
  ticker: string,
  side: string,
  limit: number,
  quantity: number
): string => {
  log(`USERNAME: ${username}`)

  let trader = Traders.getOrCreate(username)
  let order = new Order(trader, ticker as Ticker, side as Side, limit, quantity)

  try {
    let response = OrderBook.match(order)
    if (response.trade.price === 0) {
      log(`Market.post: No Trade for orderId: ${order.id}`)
    }
    return JSON.stringify(response)
  } catch (e) {
    log(`Market.post: (1) unexpected error, order: ${order}, error: ${e}`)
  }
  return JSON.stringify({ result: 'Unexpected Error' })
}

const cancel = (userName: string, id: string): string => {
  try {
    Traders.verify(userName)

    if (!OrderBooks.cancel(id)) {
      throw new Error(`Market.cancel: Order for id: ${id} not found`)
    }
    log(`Market.cancel: Order with id: ${id} canceled`)
    return JSON.stringify({ Result: 'Success' })
  } catch (e) {
    log(`Market.cancel: Unexpected error, order: ${id}`)
  }
  return JSON.stringify({ Result: 'Unexpected Error' })
}

function getOrderBook (ticker: string): string {
  let orderBooks = OrderBooks.getOrderBook(ticker as Ticker)
  let buys = orderBooks.buys.map(o => `${o.limit},${o.quantity}`)
  let sells = orderBooks.sells.map(o => `${o.limit},${o.quantity}`)

  return JSON.stringify({buys, sells})
}

function getOrderHistory (ticker: string): IOrder[] {
  return Array.from(OrderBooks.getOrderHistory(ticker as Ticker))
}

function clearAll (): void {
  OrderBooks.clearAll()
}

export { find, post, cancel, getOrderHistory, getOrderBook, clearAll }
