import { Money, Quantity, Datetime } from './utils'

type Ticker = 'TW' | 'NET' | 'T' | 'None'
type Side = 'Buy' | 'Sell' | 'None'
type Status = 'Open' | 'Partial' | 'Completed' | 'Canceled' | 'None'

type OrderId = {
  ticker: Ticker
  side: Side
  sequence: number
}

type Trader = {
  username: string
  password?: string
}
type Traders = Map<string, Trader>

type Order = {
  id: string
  trader?: Trader
  ticker: Ticker
  side: Side
  limit: Money
  quantity: Quantity
  filledQuantity?: Quantity
  status?: Status
  createdAt?: Datetime
} 

type OrderBook = Map<Ticker, Bids>
type Bids = {
  buy: Map<string, Order>,
  sell: Map<string, Order>
}

type Trade = {
  ticker: Ticker
  price: Money
  quantity: Quantity
  buyOrderId: string
  sellOrderId: string
  createdAt: Datetime
  message: string
}

type MarketResponse = {
  order: Order,
  trade?: Trade
}

export { Ticker, Side, Order, OrderBook, Bids, Trade, Traders, Trader, OrderId, MarketResponse }
