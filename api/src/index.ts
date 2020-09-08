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

const findOrder = (id: string): Order => {
  return Ob.getOrder(id)
}

const bid = (
  userName: string,
  side: Side,
  ticker: Ticker,
  limit: number,
  quantity: number
): Trade => {
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
  let trade = Ob.match(order)
  if (trade.quantity < order.quantity) {
    order.status = 'Open'
    order.filledQuantity = order.quantity - trade.quantity
  } else if (trade.quantity === order.quantity) {
    order.status = 'Completed'
    order.filledQuantity = order.quantity
  } else {
    throw new Error(
      `Market: Invalid order: ${order} state after trade ${trade} execution`
    )
  }

  if (!trade) {
    log(`Market.match: No Trade, orderId: ${order.id}`)
    return emptyTrade
  }
  return trade
}

const cancel = (userName: string, id: string): boolean => {
  Traders.verify(userName)

  if (!Ob.cancelOrder(id)) {
    throw new Error(`Markets: Order for id: ${id} not found`)
  }
  log(`Orderbooks: Order with id: ${id} canceled`)
  return true
}

export { findOrder, bid, cancel }
