import { Ticker, Order, Side, Trade } from './model'
import { Uid, getUid, log } from './utils'
import * as Ob from './orderbook'
import * as Traders from './traders'

let emptyTrade: Trade = {
  ticker: null,
  price: 0,
  quantity: 0,
  buyOrderId: '',
  sellOrderId: '',
  createdAt: null,
  message: ';`No Match - Order placed!`'
}

const bid = (
  userName: string,
  side: Side,
  ticker: Ticker,
  limit: number,
  quantity: number
): Trade => {
  // get or create trader
  let trader = Traders.getOrCreate(userName)

  // create order
  let order: Order = {
    id: getUid(),
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
    return emptyTrade
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
  return trade
}

const cancel = (
  userName: string,
  id: Uid,
  ticker: Ticker,
  side: Side
): boolean => {
  Traders.verify(userName)

  let order: Order = Ob.getOrder(id, ticker, side)
  if (!order) {
    throw new Error(`Markets: Order for id: ${id} not found`)
  }

  if (side === 'Buy') {
    if (order.status === 'Open' || order.status === 'Partial') {
      order.status = 'Canceled'
      Ob.saveOrder(order)
    }
  } else if (side === 'Sell') {
    order = Ob.getOrder(id, ticker, side)
    if (order.status === 'Open' || order.status === 'Partial') {
      order.status = 'Canceled'
      Ob.saveOrder(order)
    }
  } else {
    throw new Error(`Orderbooks: Invalid request, OrderBook ${side} incorrect`)
  }
  log(`Orderbooks: Order for ${side} with id: ${id} canceled`)
  return true
}

export { bid, cancel }
