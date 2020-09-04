type Money = number //todo: in cents, but will require higher precision
const decimals = 2  //todo: in cents, but will require higher precision

type Uuid = string
type Ticker = 'TW' | 'NET' | 'T' 
type Quantity = number
type Side = 'Buy' | 'Sell'
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
  side: Side
  limit: Money  
  quantity: Quantity
  filledQuantity: Quantity
  status: Status
  createdAt: Datetime
}

type Trade = {
 ticker: Ticker 
 price: Money
 quantity: Quantity
 buyOrder: Order
 sellOrder: Order
 createdAt: Datetime
}

export {Money, Quantity, Ticker, Trader, Order, Trade}
