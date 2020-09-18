import { Ticker, IOrderBook, IOrderBooks } from './model'
import { OrderBook } from './orderbook'
import { log } from './utils'

let store = new Map<Ticker, IOrderBook>()

class OrderBooks implements IOrderBooks {

  get(ticker: Ticker): IOrderBook | undefined {
    let orderbook =  store.get(ticker)
    if(!orderbook) {
      log(`OrderBooks.get: Orderbook for ticcker: ${ticker} not found`)
      return undefined
    }
    return orderbook
  }

  getOrCreate(ticker: Ticker): IOrderBook {
    let orderbook =  store.get(ticker)
    if(!orderbook) {
      orderbook = new OrderBook(ticker)
      store.set(ticker, orderbook)
    }
    return orderbook
  }
}

export { OrderBooks }
