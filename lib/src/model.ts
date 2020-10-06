import { Money, Quantity, Timestamp } from './utils'

type Ticker = 'TSLA' | 'NET' | 'SNAP' | 'None'
type Side = 'Buy' | 'Sell' | 'None'
type Status = 'Open' | 'Completed' | 'Canceled' | 'None'

type Trader = {
  username: string
  password?: string
}

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
  currentQuantity(): Quantity
  idAsString (): string 
} 

interface IOrderBook {
  ticker: string
  get(id: string): IOrder | undefined
  getHistory(): IOrder[]
  getMarket(): MarketList
  open(order: IOrder): MarketResponse
  cancel (id: string): boolean 
  clearAll(): void
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
  message: string
  order: IOrder
  trade: Trade
}

type MarketList = {
  buys: Array<string>
  sells: Array<string>
}

interface IMarket {
  get (userName: string, ticker: string, id: string): IOrder | undefined
  post (username: string,ticker: string, side: string, limit: number, quantity: number): MarketResponse
  cancel (userName: string, ticker: Ticker, id: string): boolean 
  getHistory(userName: string, ticker: string): IOrder[] | undefined
  getState(userName: string, ticker: Ticker): MarketList
  clearAll(userName: string, ticker: string): void
}

export { Ticker, Side, Status, IOrder, IOrderId, IOrderBook, IOrderBooks, Trade, Trader, MarketResponse, MarketList, IMarket }
