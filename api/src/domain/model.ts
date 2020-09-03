type Money = number // cents, but will require higher precision
const decimals = 2

type Uuid = string
type Ticker = 'TW' | 'NET' | 'T' 
type Quantity = number
type Buy = 'Buy'
type Sell = 'Sell'
type Status = 'Open' | 'Completed' | 'Canceled'
type Datetime = number    // milliseconds

type Trader = {
  username: string
  password: string
  balance: Money
}

type Order = {
  id: Uuid
  trader: Trader
  ticker: Ticker 
  side: Buy | Sell
  limit: Money  
  quantity: Quantity
  filledQuantity: Quantity
  status: Status
  createdAt: Datetime
}
type BuyOrder = Order & {side: Buy}
type SellOrder = Order & {side: Sell}

type CompletedTrade = {
 ticker: Ticker 
 price: Money
 quantity: Quantity
 order: BuyOrder | SellOrder
 createdAt: Datetime
}
type NoTrade = { message: 'No match, No trade '}
type Trade = CompletedTrade | NoTrade

export {Money, Quantity, Ticker, Trader, Order, Trade}
