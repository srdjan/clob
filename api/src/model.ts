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
  getOrderHistory(): IOrder[]
  getMarketList(): MarketList
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
  getOrder(userName: string, ticker: string, id: string): IOrder | undefined
  postOrder (username: string,ticker: string, side: string, limit: number, quantity: number): MarketResponse
  cancelOrder(userName: string, ticker: Ticker, id: string): boolean 
  getOrderHistory(userName: string, ticker: string): IOrder[] | undefined
  getOrderBook(userName: string, ticker: string): IOrderBook | undefined
  getMarketList(userName: string, ticker: Ticker): MarketList
  clearAll(userName: string, ticker: string): void
}

export { Ticker, Side, Status, IOrder, IOrderId, IOrderBook, IOrderBooks, Trade, Trader, MarketResponse, MarketList, IMarket }
