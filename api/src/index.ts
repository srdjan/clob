import { Order } from './order'
import { Ticker, Side, IOrder } from './model'
import * as OrderBooks from './orderbooks'
import * as OrderBook from './engine'
import * as Traders from './traders'
import { log } from './utils'
import OrderHistory from './orderHistory'

const findOrder = (id: string): string => {
  try {
    return JSON.stringify(OrderBooks.getOrder(id))
  } catch (e) {
    log(`Market.findOrder: unexpected error, orderId: ${id}`)
  }
  return JSON.stringify({ Result: 'Unexpected Error' })
}

const bid = (
  userName: string,
  ticker: string,
  side: string,
  limit: number,
  quantity: number
): string => {
  let trader = Traders.getOrCreate(userName)  // get or create trader
  let order = new Order(trader, ticker as Ticker, side as Side, limit, quantity)  // create and save order
  OrderHistory.push(order)

  //Save incoming order and find if there are matching orders to execute
  try {
    let response = OrderBook.match(order)
    if (!response.trades || response.trades.length === 0) {
      log(`Market.bid: No Trade, orderId: ${order.id}`)
    }
    return JSON.stringify(response)
  } catch (e) {
    log(`Market.bid: (1) unexpected error, order: ${order}, error: ${e}`)
  }
  return JSON.stringify({ Result: 'Unexpected Error' })
}

const cancel = (userName: string, id: string): string => {
  try {
    Traders.verify(userName)

    if (!OrderBooks.cancelOrder(id)) {
      throw new Error(`Market.cancel: Order for id: ${id} not found`)
    }
    log(`Market.cancel: Order with id: ${id} canceled`)
    return JSON.stringify({ Result: 'Success' })
  } catch (e) {
    log(`Market.cancel:(2) unexpected error, order: ${id}`)
  }
  return JSON.stringify({ Result: 'Unexpected Error' })
}

function getOrders (ticker: string): IOrder[] {
  return Array.from(OrderBooks.getOrders(ticker as Ticker))
}

function clearAll(): void {
  OrderBooks.clearAll()
}

export { findOrder, bid, cancel, getOrders, clearAll }
