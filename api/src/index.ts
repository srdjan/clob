import { Order } from './model'
import * as OrderBook from './orderbooks'

const Buy = (
  username: string,
  ticker: string,
  limit: number,
  quantity: number
): string => {
  let order = OrderBook.add(username, 'Buy', 'TW', 10000, 20)
  return JSON.stringify(order)
}

const Sell = (
  username: string,
  ticker: string,
  limit: number,
  quantity: number
): Order | Error => {
  throw Error('SELL Not Implemented!')
}

const Cancel = (
  username: string,
  ticker: string,
  price: number,
  quantity: number
): Order => {
  throw Error('CANCEL Not Implemented!')
}

const Show = (
  username: string,
  ticker: string,
  price: number,
  quantity: number
): Order | Error => {
  throw Error('SHOW Not Implemented!')
}

export default { Buy, Sell, Cancel, Show }
