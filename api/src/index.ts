import { Order } from './order'
import { Ticker, Side, IOrder } from './model'
import * as OrderBooks from './orderbooks'
import * as OrderBook from './orderbook'
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
  let trader = Traders.getOrCreate(userName)

  // create and save order
  let order = new Order(trader, ticker as Ticker, side as Side, limit, quantity)
  OrderHistory.push(order)

  // Save incoming order and find if there are matching orders to execute
  try {
    let response = OrderBook.match(order)
    if (!response.trade) {
      log(`Market.bid: No Trade, orderId: ${order.id}`)
    }
    return JSON.stringify(response)
  } catch (e) {
    log(`Market.bid: unexpected error, order: ${order}`)
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
    log(`Market.cancel: unexpected error, order: ${id}`)
  }
  return JSON.stringify({ Result: 'Unexpected Error' })
}

function getOrders (ticker: string): IOrder[] {
  //todo: flaten the response to time sorted (open only?) orders
  return Array.from(OrderBooks.getOrders(ticker as Ticker))
}

export { findOrder, bid, cancel, getOrders }
