import { Ticker, Trader, Order, Money, Quantity, Trade } from './model'
import { OrderBook, create, add, cancel } from './orderbook'

const Buy = (
  trader: Trader,
  ticker: Ticker,
  price: Money,
  quantity: Quantity
): Order | Error => {
  return new Error('BUY Not Implemented!')
}

const Sell = (
  trader: Trader,
  ticker: Ticker,
  price: Money,
  quantity: Quantity
): Order | Error => {
  return new Error('SELL Not Implemented!')
}

const Cancel = (
  trader: Trader,
  ticker: Ticker,
  price: Money,
  quantity: Quantity
): Order | Error => {
  return new Error('CANCEL Not Implemented!')
}

const Show = (
  trader: Trader,
  ticker: Ticker,
  price: Money,
  quantity: Quantity
): Order | Error => {
  return new Error('SHOW Not Implemented!')
}

export default { Buy, Sell, Cancel, Show }
