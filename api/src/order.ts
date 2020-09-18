import { IOrder, Ticker, Trader, Side, Status, IOrderId } from './model'
import { Money, Quantity, SeqGen, Timestamp } from './utils'

class Order implements IOrder {
  static idSequence = 0
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
    this.id = Order.nextId(ticker, side)
    this.trader = trader
    this.ticker = ticker
    this.side = side
    this.limit = limit
    this.quantity = quantity
    this.filledQuantity = 0
    this.status = 'Open'
    this.createdAt = SeqGen.next()
  }

  static nextId (ticker: Ticker, side: Side): string {
    let uid = Order.idSequence++
    return `${ticker}.${side}.${uid}`
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

  static idAsString (orderId: IOrderId): string {
    return `${orderId.ticker}.${orderId.side}.${orderId.id}`
  }
  
  static getEmptyOrder (): IOrder {
    return new Order({ username: '', password: '' }, 'None', 'None', 0, 0)
  }
}


export { Order }
