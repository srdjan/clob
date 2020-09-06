import { Uid, Money } from './utils'

type Ticker = 'TW' | 'NET' | 'T'
type Quantity = number
type Side = 'Buy' | 'Sell'
type Status = 'Open' | 'Partial' | 'Completed' | 'Canceled'
type Datetime = number // milliseconds

type Trader = {
  username: string
  password?: string
}

type Order = {
  id: Uid
  trader: Trader
  ticker: Ticker
  side: Side
  limit: Money
  quantity: Quantity
  filledQuantity?: Quantity
  status?: Status
  createdAt?: Datetime
}

type OrderBook = []

type Trade = {
  ticker: Ticker
  price: Money
  quantity: Quantity
  buyOrderId: Uid
  sellOrderId: Uid
  createdAt: Datetime
  message: string
}

export { Ticker, Side, Order, OrderBook, Trade, Trader }
