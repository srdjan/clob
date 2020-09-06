import { Ticker, Order, Side, Trade } from './model'
import { seqGenerator, log } from './utils'
import * as Ob from './orderbook'
import * as Traders from './traders'

let emptyTrade: Trade = {
  ticker: 'None',
  price: 0,
  quantity: 0,
  buyOrderId: -1,
  sellOrderId: -1,
  createdAt: 0,
  message: `No Match - No Trade. Order placed!`
}

const findOrder = (id: number): Order => {
  return Ob.getOrder(id)
}

const bid = (
  userName: string,
  side: Side,
  ticker: Ticker,
  limit: number,
  quantity: number
): [Trade, Order] => {
  // get or create trader
  let trader = Traders.getOrCreate(userName)

  // create order
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
    return [emptyTrade, order]
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
  return [trade, order]
}

const cancel = (userName: string, id: number): boolean => {
  Traders.verify(userName)

  if (! Ob.cancelOrder(id)) {
    throw new Error(`Markets: Order for id: ${id} not found`)
  }
  log(`Orderbooks: Order with id: ${id} canceled`)
  return true
}

export { findOrder, bid, cancel }
