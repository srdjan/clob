import { Ticker, Order, Side } from './model'
import { seqGenerator, log } from './utils'
import * as Ob from './orderbook'
import * as Traders from './traders'

function bid (
  username: string,
  ticker: Ticker,
  side: Side,
  limit: number,
  quantity: number
): string {
  try {
    let trader = Traders.getOrCreate(username)

    let order: Order = {
      id: seqGenerator(),
      trader: trader,
      ticker: ticker,
      side: side,
      limit: limit,
      quantity: quantity,
      filledQuantity: 0,
      status: 'Open',
      createdAt: new Date().getTime()
    }

    // find if there are matching orders to execute
    let trade = Ob.execute(order)
    if (!trade) {
      return 'No matches, No Trade!'
    }

    if (trade.quantity < quantity) {
      order.status = 'Open'
      order.filledQuantity = quantity - trade.quantity
    } else if (trade.quantity === quantity) {
      order.status = 'Completed'
      order.filledQuantity = quantity
    } else {
      log(`Market: Invalid order: ${order} state after trade ${trade} execution`)
      throw new Error(
        `Market: Invalid order: ${order} state after trade ${trade} execution`
      )
    }
    return 'Success'
  } catch (error) {
    log(`Market: Error ${error}`)
    return `This BID request has failed. Please try later`
  }
}

function cancel (username: string, id: string): string {
  try {
    Traders.verify(username)

    if (!Ob.cancelOrder(id)) {
      throw new Error(`Markets: Order for id: ${id} not found`)
    }
    log(`Market: Order with id: ${id} canceled`)
  } catch (error) {
    log(`MArket: Error ${error}`)
    return `This Cancel order has failed. Please try later`
  }
  return 'Success'
}

const show = (ticker: string, top: number = 10): ['TODO'] | Error => {
  throw Error('SHOW Not Implemented!')
}

export default { bid, cancel, show }
