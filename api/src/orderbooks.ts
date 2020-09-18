import { Ticker, IOrderBook, IOrderBooks } from './model'
import { OrderBook } from './orderbook'
import { log } from './utils'

class OrderBooks implements IOrderBooks {
  #store: Map<Ticker, IOrderBook>

  constructor() {
    this.#store = new Map<Ticker, IOrderBook>()
  }

  get(ticker: Ticker): IOrderBook | undefined {
    let orderbook =  this.#store.get(ticker)
    if(!orderbook) {
      log(`OrderBooks.get: Orderbook for ticcker: ${ticker} not found`)
      return undefined
    }
    return orderbook
  }

  getOrCreate(ticker: Ticker): IOrderBook {
    let orderbook =  this.#store.get(ticker)
    if(!orderbook) {
      orderbook = new OrderBook(ticker)
      this.#store.set(ticker, orderbook)
    }
    return orderbook
  }
}

export { OrderBooks }
