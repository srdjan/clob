import { IOrder, Ticker, Trader, Side, Status, IOrderId } from './model'
import { Money, Quantity, Timestamp } from './utils'

let idSequence = 0
let createdAtSequence = 0

class Order implements IOrder {
  id: string
  trader: Trader
  ticker: Ticker
  side: Side
  limit: Money
  quantity: Quantity
  filledQuantity: Quantity
  status: Status
  createdAt: Timestamp
  lastChangedAt?: Timestamp

  constructor (
    trader: Trader,
    ticker: Ticker,
    side: Side,
    limit: number,
    quantity: number
  ) {
    this.id = `${ticker}.${side}.${idSequence++}`
    this.trader = trader
    this.ticker = ticker
    this.side = side
    this.limit = limit
    this.quantity = quantity
    this.filledQuantity = 0
    this.status = 'Open'
    this.createdAt = createdAtSequence++
  }

  currentQuantity(): Quantity {
    return this.quantity - this.filledQuantity
  }

  idAsString (): string {
    return `${this.ticker}.${this.side}.${this.id}`
  }

  static idFromString (id: string): IOrderId {
    let idFields = id.split('.')
    try {
      return {
        ticker: idFields[0] as Ticker,
        side: idFields[1] as Side,
        id: idFields[2] as string
      }
    } catch (e) {
      throw new Error(`Order: Invalid id string format ${id}`)
    }
  }
  
  static getEmpty (): IOrder {
    return new Order({ username: '', password: '' }, 'None', 'None', 0, 0)
  }
}

export { Order }
