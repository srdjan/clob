import { Order } from './order'
import { Ticker, Side, IOrder, IOrderBooks, IMarket, MarketResponse, MarketList } from './model'
import { OrderBooks } from './orderbooks'
import { Traders } from './traders'
import { log } from './utils'

const orderBooks: IOrderBooks = new OrderBooks()

class Market implements IMarket {
  #name: string

  constructor(name: string) {
    this.#name = name
  }

  get (userName: string, ticker: string, id: string): IOrder | undefined {
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

  post (
    username: string,
    ticker: string,
    side: string,
    limit: number,
    quantity: number
  ): MarketResponse {
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
      let response = orderBook.open(order)
      log(`Market[${this.#name}].postOrder: ${response.message}`)
      return response
    } catch (e) {
      log(`Market[${this.#name}].postOrder: Unexpected error: ${e}`)
    }
    throw new Error('Unexpected Error!')
  }

  cancel (userName: string, ticker: Ticker, id: string): boolean {
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

  getHistory (userName: string, ticker: string): IOrder[] {
    Traders.verify(userName)

    let orderBook = orderBooks.get(ticker as Ticker)
    if (!orderBook) {
      log(`Market[${this.#name}].getOrderHistory: OrderBook for ticker: ${ticker} not found`)
      return []
    }

    return orderBook.getHistory()
  }

  getState(userName: string, ticker: Ticker): MarketList {
    Traders.verify(userName)

    let orderBook = orderBooks.get(ticker as Ticker)
    if (!orderBook) {
      log(`Market[${this.#name}].getOrderHistory: OrderBook for ticker: ${ticker} not found`)
      return {buys: [], sells: []}
    }

    return orderBook.getMarket()
  }
  
  clearAll(userName: string, ticker: string) {
    Traders.verify(userName)

    let orderBook = orderBooks.get(ticker as Ticker)
    if (!orderBook) {
      log(`Market[${this.#name}].getOrderHistory: OrderBook for ticker: ${ticker} not found`)
      return []
    }
    orderBook.clearAll()    
  }
}

export { Market }
