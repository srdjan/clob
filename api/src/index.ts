import { Ticker } from './model'
import { log } from '../src/utils'
import * as OrderBook from './orderbooks'

function Buy (
  username: string,
  ticker: Ticker,
  limit: number,
  quantity: number
): string {
  try {
    let order = OrderBook.bid(username, 'Buy', ticker, limit, quantity)
    return JSON.stringify(order)
  } catch (error) {
    log(`Error: ${error}`)
    return `This Buy order has failed. Please try later`
  }
}

function Sell (
  username: string,
  ticker: Ticker,
  limit: number,
  quantity: number
): string {
  try {
    let order = OrderBook.bid(username, 'Sell', ticker, limit, quantity)
    return JSON.stringify(order)
  } catch (error) {
    log(`Error: ${error}`)
    return `This Sell order has failed. Please try later`
  }
}

function Cancel (username: string, id: string, ticker: Ticker): string {
  try {
    let result = OrderBook.cancel(username, id, ticker, 'Buy')
    return JSON.stringify(result)
  } catch (error) {
    log(`Error: ${error}`)
    return `This Cancel order has failed. Please try later`
  }
}

const Show = (ticker: string, top: number = 10): ['TODO'] | Error => {
  throw Error('SHOW Not Implemented!')
}

export default { Buy, Sell, Cancel, Show }
