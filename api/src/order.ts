import { IOrder, Ticker, Trader, Side, Status } from './model'
import OrderId from './orderid'
import { Money, Quantity, Timestamp } from './utils'
import OrderHistory from './orderHistory'
// import { performance } from 'perf_hooks'

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
    this.createdAt = 1//performance.now()//new Date().getTime()
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
