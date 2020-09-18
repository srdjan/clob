import { Order } from './order'
import { Ticker, Side, IOrder, IOrderBook, IOrderBooks, IMarket } from './model'
import { OrderBooks } from './orderbooks'
import * as Traders from './traders'
import { log } from './utils'

const orderBooks: IOrderBooks = new OrderBooks()

class Market implements IMarket {
  #name: string

  constructor(name: string) {
    this.#name = name
  }

  getOrder (userName: string, ticker: string, id: string): IOrder | undefined {
    try {
      Traders.verify(userName)

      let orderBook = orderBooks.get(ticker as Ticker)
      if (!orderBook) {
        log(`Market[${this.#name}].find: OrderBook for ticker: ${ticker} not found`)
        return undefined
      }

      let order = orderBook.get(id)
      if (!order) {
        log(`Market[${this.#name}].find: Order for ticker; ${ticker} id: ${id} not found`)
        return undefined
      }
      return order
    } catch (e) {
      log(`Market[${this.#name}].find: unexpected error, orderId: ${id}`)
    }
    return undefined
  }

  postOrder (
    username: string,
    ticker: string,
    side: string,
    limit: number,
    quantity: number
  ): string {
    try {
      let trader = Traders.getOrCreate(username)

      let orderBook = orderBooks.getOrCreate(ticker as Ticker)

      let order = new Order(
        trader,
        ticker as Ticker,
        side as Side,
        limit,
        quantity
      )
      orderBook.open(order)

      let response = orderBook.open(order)
      if (response.trade.price === 0) {
        log(`Market[${this.#name}].postOrder: No Trade for orderId: ${order.id}`)
      }
      return JSON.stringify(response)
    } catch (e) {
      log(`Market[${this.#name}].postOrder: Unexpected error: ${e}`)
    }
    return JSON.stringify({ result: 'Unexpected Error!' })
  }

  cancelOrder (userName: string, ticker: Ticker, id: string): boolean {
    try {
      Traders.verify(userName)

      let orderBook = orderBooks.get(ticker as Ticker)
      if (!orderBook) {
        log(`Market[${this.#name}].cancelOrder: Order for ticker: ${ticker} not found`)
        return false
      }

      let result = orderBook.cancel(id)
      if (!result) {
        log(`Market[${this.#name}].cancelOrder: Order for id: ${id} not found`)
        return false
      }

      log(`Market[${this.#name}].cancelOrder: Order with id: ${id} canceled`)
      return true
    } catch (e) {
      log(`Market[${this.#name}].cancelOrder: Unexpected error, order: ${id}`)
    }
    return false
  }

  getOrderBook (userName: string, ticker: string): IOrderBook | undefined {
    Traders.verify(userName)

    let orderBook = orderBooks.get(ticker as Ticker)
    if (!orderBook) {
      log(`Market[${this.#name}].getOrderBook: OrderBook for ticker: ${ticker} not found`)
      return undefined
    }
    return orderBook
  }

  getOrderHistory (userName: string, ticker: string): IOrder[] {
    Traders.verify(userName)

    let orderBook = orderBooks.get(ticker as Ticker)
    if (!orderBook) {
      log(`Market[${this.#name}].getOrderHistory: OrderBook for ticker: ${ticker} not found`)
      return []
    }

    return orderBook.getOrderHistory()
  }
}

export { Market }
