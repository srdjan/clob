import { Money } from './utils'

type Ticker = 'TW' | 'NET' | 'T' | 'None'
type Quantity = number
type Side = 'Buy' | 'Sell'
type Status = 'Open' | 'Partial' | 'Completed' | 'Canceled'
type Datetime = number // milliseconds

type Trader = {
  username: string
  password?: string
}

type Order = {
  id: number
  trader: Trader
  ticker: Ticker
  side: Side
  limit: Money
  quantity: Quantity
  filledQuantity?: Quantity
  status?: Status
  createdAt?: Datetime
}

type OrderBook = Map<Ticker, {buyBids: Bids, sellBids: Bids}>
type Bids = Map<number, Order>

type Trade = {
  ticker: Ticker
  price: Money
  quantity: Quantity
  buyOrderId: number
  sellOrderId: number
  createdAt: Datetime
  message: string
}
type NoTrade = 'None'

export { Ticker, Side, Order, OrderBook, Bids, Trade, NoTrade, Trader }
