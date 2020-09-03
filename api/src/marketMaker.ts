import { Money, Quantity, Ticker, Trader, Order, Trade } from './model'

const placeOrder = (trader: Trader, ticker: Ticker, price: Money, quantity: Quantity): Order | Error => {
  //todo
  return new Error('Not Implemented!')
}

export default {placeOrder}