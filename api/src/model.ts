import { Money, Quantity, Timestamp } from './utils'

type Ticker = 'TW' | 'NET' | 'T' | 'None'
type Side = 'Buy' | 'Sell' | 'None'
type Status = 'Open' | 'Completed' | 'Canceled' | 'None'

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
  createdAt: number
  cancel (): void
  update(): void
  complete (): void
} 

type OrderBookSide = Map<string, IOrder>
type OrderBook = {
  buySide: OrderBookSide,
  sellSide: OrderBookSide
}
type OrderBooks = Map<Ticker, OrderBook>

type Trade = {
  ticker: Ticker
  price: Money
  quantity: Quantity
  buyOrder: IOrder
  sellOrder: IOrder
  createdAt: Timestamp
  message: string
}

type OrderTicker = {
  buys: Array<{limit: number, quantity: number}>,
  sells: Array<{limit: number, quantity: number}>
}

type MarketResponse = {
  order: IOrder
  trade: Trade
}

export { Ticker, Side, Status, IOrder, IOrderId, OrderBooks, OrderBook, OrderTicker, OrderBookSide, Trade, Traders, Trader, MarketResponse }
