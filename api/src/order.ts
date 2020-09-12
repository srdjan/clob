import { IOrder, Ticker, Trader, Side, Status } from './model'
import OrderId from './orderid'
import { Money, Quantity, SeqGen, Timestamp } from './utils'
import OrderHistory from './orderHistory'

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

  constructor (
    trader: Trader,
    ticker: Ticker,
    side: Side,
    limit: number,
    quantity: number
  ) {
    this.id = OrderId.next(ticker, side)
    this.trader = trader
    this.ticker = ticker
    this.side = side
    this.limit = limit
    this.quantity = quantity
    this.filledQuantity = 0
    this.status = 'Open'
    this.createdAt = SeqGen.next()

    OrderHistory.push(this)
  }

  cancel (): void {
    this.status = 'Canceled'
    OrderHistory.push(this)
  }

  update(): void {
    OrderHistory.push(this)
  }

  complete (): void {
    this.status = 'Completed'
    OrderHistory.push(this)
  }
}

function getEmptyOrder (): IOrder {
  return new Order({ username: '', password: '' }, 'None', 'None', 0, 0)
}

export { Order, getEmptyOrder }
