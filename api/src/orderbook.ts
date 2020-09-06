import { Order, Trade, Ticker, Side } from './model'
import { Uid } from './utils'

const maxDepth = 1000
type Bid = [id: Uid, price: number, quantity: number]

//todo: optimize (try https://github.com/snovakovic/fast-sort)
const orderBooks = new Map<Ticker, 
                            [ buyOrders: Array<Bid>, 
                              sellOrders: Array<Bid>
                            ]>()

const getOrder = (id: Uid, ticker: Ticker, side: Side): Order => {
  if (side === 'Buy') {
    return orderBooks[ticker].buyOrders[id]
  }
  else if (side === 'Sell') {
    return orderBooks[ticker].sellOrders[id]
  }
}

const saveOrder = (order: Order): boolean => {
  if (order.side === 'Buy') {
    orderBooks[order.ticker].buyOrders[order.id] = order
  } else if (order.side === 'Sell') {
    orderBooks[order.ticker].sellOrders[order.id] = order
  }
  return true
}

function execute (order: Order): Trade {
  let trade: Trade = {
    ticker: order.ticker,
    price: 0,
    quantity: 0,  //todo: match(needs to return number of executed shares
    buyOrderId: order.id,
    sellOrderId: order.id,
    createdAt: new Date().getTime(),
    message: 'message'
  }

  let bid: Bid = match(order)
  if (bid[1] > 0) {
    trade.price = bid[1]
    trade.quantity = bid[2]
    trim(order)
    sort(order)
  }
  return trade
}

function match (order: Order): Bid {
  if (order.side === 'Buy') {
    if (canBuy(order)) {
      return buy(order)
    }
    orderBooks[order.ticker].buyOrders.push([order.id, order.limit, order.quantity])
  } else if (order.side === 'Sell') {
    if (canSell(order)) {
      return sell(order)
    }
    orderBooks[order.ticker].sellOrders.push(order.limit)
  } 
  throw new Error(`Orderbook: invalid order side: ${order}`)
}

function buy (order: Order): Bid {
  if (!canBuy(order)) {
    return [null, 0, 0] // no sellers
  }
  return orderBooks[order.ticker].buyOrders.shift()
}

function canBuy (order: Order) : boolean {
  if (orderBooks[order.ticker].sellOrders.length == 0) {
    return false // No sellers
  }
  if (orderBooks[order.ticker].sellOrders[0] < order.limit) {
    return true // there are sellers at given or better price
  }
  return false
}

function sell (order: Order): Bid {
  if (!canSell(order)) {
    return [null, 0, 0] // no buyers
  }
  return orderBooks[order.ticker].buyOrders.shift()
}

function canSell (order: Order): boolean {
  if (orderBooks[order.ticker].buyOrders.length == 0) {
    return false // no buyers
  }
  if (orderBooks[order.ticker].buyOrders[0] > order.limit) {
    return true // there are buyers at given or better price
  }
  return false
}

function sort(order: Order) {
  orderBooks[order.ticker].buyOrders.sort((a, b) => b - a).slice(0)
  orderBooks[order.ticker].sellOrders.sort((a, b) => a - b).slice(0)
}

function trim(order: Order) {
  if (orderBooks[order.ticker].buyOrders.length >= maxDepth) {
    orderBooks[order.ticker].buyOrders.splice(-1, 1)
  }
  if (orderBooks[order.ticker].sellOrders.length >= maxDepth) {
    orderBooks[order.ticker].sellOrders.splice(-1, 1)
  }
}

export { execute, getOrder, saveOrder }

