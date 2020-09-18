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
  ticker: Ticker
  side: Side
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
  lastChangedAt?: Timestamp
} 

interface IOrderBook {
  get(id: string): IOrder | undefined
  getBuySide(): string[]
  getSellSide(): string[]
  getOrderHistory(): IOrder[]
  open(order: IOrder): void
  cancel (id: string): boolean 
  match (order: IOrder): MarketResponse
}

interface IOrderBooks {
  get(ticker: Ticker): IOrderBook | undefined
  getOrCreate(ticker: Ticker): IOrderBook 
}

type Trade = {
  ticker: Ticker
  price: Money
  quantity: Quantity
  buyOrder: IOrder
  sellOrder: IOrder
  createdAt: Timestamp
  message: string
}

type MarketResponse = {
  order: IOrder
  trade: Trade
}

interface IMarket {
  getOrder(userName: string, ticker: string, id: string): IOrder | undefined
  postOrder (username: string,ticker: string, side: string, limit: number, quantity: number): string
  cancelOrder(userName: string, ticker: Ticker, id: string): boolean 
  getOrderHistory(userName: string, ticker: string): IOrder[] | undefined
  getOrderBook(userName: string, ticker: string): IOrderBook | undefined
}

export { Ticker, Side, Status, IOrder, IOrderId, IOrderBook, IOrderBooks, Trade, Traders, Trader, MarketResponse, IMarket }
