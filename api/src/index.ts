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
  userName: string,
  ticker: string,
  side: string,
  limit: number,
  quantity: number
): string => {
  let trader = Traders.getOrCreate(userName)
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

function getAll (ticker: string): IOrder[] {
  return Array.from(OrderBooks.getAll(ticker as Ticker))
}

function clearAll (): void {
  OrderBooks.clearAll()
}

export { find, post, cancel, getAll, clearAll }
