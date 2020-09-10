import { Money, Quantity, Timestamp } from './utils'

type Ticker = 'TW' | 'NET' | 'T' | 'None'
type Side = 'Buy' | 'Sell' | 'None'
type Status = 'Open' | 'Partial' | 'Completed' | 'Canceled' | 'None'

type Trader = {
  username: string
  password?: string
}
type Traders = Map<string, Trader>

interface IOrderId {  
  ticker: Ticker,
  side: Side,
  id: string
}

interface IOrder {
  id: string
  trader: Trader
  ticker: Ticker
  side: Side
  limit: Money
  quantity: Quantity
  filledQuantity: Quantity
  status: Status
  createdAt: Timestamp
  cancel (): void
  update(): void
  complete (): void
} 

type OrderBook = {
  buySide: Map<string, IOrder>,
  sellSide: Map<string, IOrder>
}
type OrderBooks = Map<Ticker, OrderBook>

type Trade = {
  ticker: Ticker
  price: Money
  quantity: Quantity
  buyOrderId: string
  sellOrderId: string
  createdAt: Timestamp
  message: string
}

type MarketResponse = {
  order: IOrder,
  trade: Trade
}

export { Ticker, Side, Status, IOrder, IOrderId, OrderBooks, OrderBook, Trade, Traders, Trader, MarketResponse }
