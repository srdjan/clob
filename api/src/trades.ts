import { Trade, Ticker } from './model'
import { Order } from './order'

const trades = new Array<Trade>()
let idSequence = 0

class Trades {

  static initializeTrade (ticker: Ticker): Trade {
    return {
      ticker: ticker,
      price: 0,
      quantity: 0,
      buyOrder: Order.getEmpty(),
      sellOrder: Order.getEmpty(),
      createdAt: idSequence++,
      message: 'None'
    }
  }

  static insert(trade: Trade) {
    trades.push(trade)
  }

  static getSize(): number {
    return trades.length
  }
}

export { Trades }
