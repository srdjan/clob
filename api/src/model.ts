import { Uuid, Money } from './utils'
import {Trader} from './traders'

type Ticker = 'TW' | 'NET' | 'T' 
type Quantity = number
type Side = 'Buy' | 'Sell'
type Status = 'Open' | 'Completed' | 'Canceled'
type Datetime = number    // milliseconds

type Order = {
  id: Uuid
  trader?: Trader //todo: Map.get returns T | undefined, this is temporary solution, FIX IT!
  ticker: Ticker 
  side: Side
  limit: Money  
  quantity: Quantity
  filledQuantity?: Quantity
  status?: Status
  createdAt?: Datetime
}

type Trade = {
 ticker: Ticker 
 price: Money
 quantity: Quantity
 buyOrder: Order
 sellOrder: Order
 createdAt: Datetime,
 message: string
}

export {Money, Quantity, Ticker, Side, Order, Trade}
