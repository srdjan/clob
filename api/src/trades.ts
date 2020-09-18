import { Trade, Ticker } from './model'
import { Order } from './order'

class Trades {
  static idSequence = 0
  static trades = new Array<Trade>()

  static initializeTrade (ticker: Ticker): Trade {
    return {
      ticker: ticker,
      price: 0,
      quantity: 0,
      buyOrder: Order.getEmptyOrder(),
      sellOrder: Order.getEmptyOrder(),
      createdAt: Trades.idSequence++,
      message: 'None'
    }
  }

  static insert(trade: Trade) {
    Trades.trades.push(trade)
  }
}

export { Trades }
