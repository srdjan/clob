import { Ticker, Order, Side } from './model'
import * as Ob from './orderbook'
import * as Traders from './traders'
import * as orderId from './orderId'
import {log} from './utils'

const findOrder = (id: string): string => {
  try {
    return JSON.stringify(Ob.getOrder(id))
  }
  catch(e) {
    log(`Market.findOrder: unexpected error, orderId: ${id}`)
  }
  return JSON.stringify({ Result: 'Unexpected Error' })
}

const bid = (
  userName: string,
  side: string,
  ticker: string,
  limit: number,
  quantity: number
): string => {
  let trader = Traders.getOrCreate(userName)

  // create order
  let order: Order = {
    id: orderId.createAsString(ticker as Ticker, side as Side),
    trader: trader,
    ticker: ticker as Ticker,
    side: side as Side,
    limit: limit,
    quantity: quantity,
    filledQuantity: 0,
    status: 'Open',
    createdAt: new Date().getTime()
  }

  // Save incoming order and find if there are matching orders to execute
  try {
    let response = Ob.match(order)
      if (!response.trade) {
      log(`Market.bid: No Trade, orderId: ${order.id}`)
    }
    return JSON.stringify(response)
  }
  catch (e) {
    log(`Market.bid: unexpected error, order: ${order}`) 
  }
  return JSON.stringify( {Result: 'Unexpected Error'} )
}

//todo: add top level try-catch
const cancel = (userName: string, id: string): string => {
  try {
    Traders.verify(userName)

    if (!Ob.cancelOrder(id)) {
      throw new Error(`Market.cancel: Order for id: ${id} not found`)
    }
    log(`Market.cancel: Order with id: ${id} canceled`)
    return JSON.stringify({Result: 'Success'})
  }
  catch(e) {
    log(`Market.cancel: unexpected error, order: ${id}`) 
  }
  return JSON.stringify( {Result: 'Unexpected Error'} )
}

export { findOrder, bid, cancel }
