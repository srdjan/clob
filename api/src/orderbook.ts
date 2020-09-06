import { Order, Trade, Ticker } from './model'

const maxDepth = 1000

const OrderBooks = new Map<Ticker, { buyBids: Array<number>, sellBids: Array<number>}>()
const Orders = new Map<number, Order>()

const getOrder = (id: number): Order => {
  return Orders.get(id) as Order
}

const cancelOrder = (id: number): boolean => {
  let order = Orders.get(id) as Order
  if (!order) {
    throw new Error(`Orderbook: Order with id: ${id} not found`)
  }
  order.status = 'Canceled'
  //todo: log audit of a change

  const index = 0
  let ticker: Ticker = 'None'
  ticker = order.ticker
  let bids = OrderBooks.get(ticker)
  if (!bids) {
    throw new Error(`Orderbook: Bids for ticker: ${ticker} not found`)
  }

  if(order.side === 'Buy') {
    let index = bids.buyBids.indexOf(id, 0)
    if (index > -1) bids.buyBids.splice(index, 1)
    return true
  }

  if(order.side === 'Sell') {
    let index = bids.buyBids.indexOf(id, 0)
    if (index > -1) bids.buyBids.splice(index, 1)
    return true
  }
  throw new Error(`Orderbooks: invalid side: ${order.side}`)
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

  if(match(order, trade)) {
    trim(order)
    sort(order)
  }
  return trade
}

function match (order: Order, trade: Trade): boolean {
  let bids = OrderBooks.get(order.ticker)
  if (!bids) {
    throw new Error(`Orderbook.match: Bids for ticker: ${order.ticker} not found`)
  }

  if (order.side === 'Buy') {
    if (canBuy(order)) {
      return buy(order, trade)
    }
    bids.buyBids.push(order.limit)  //todo: use <limit>.<id> format for the item of array
  } else if (order.side === 'Sell') {
    if (canSell(order)) {
      return sell(order, trade)
    }
    bids.sellBids.push(order.limit) //todo: use <limit>.<id> format for the item of array
  } 
  throw new Error(`Orderbook: invalid order side: ${order}`)
}

function buy (order: Order, trade: Trade): boolean {
  if (!canBuy(order)) {
    return false // no sellers
  }
  let bids = OrderBooks.get(order.ticker)
  if(!bids) {
    throw new ErrorEvent(`Orderbook.buy: no bids, order: ${order}`)
  } 
  let matchingOrder = bids.buyBids.shift()
  trade.price = 0 //todo: matchingOrder.limit
  trade.quantity = 0 // todo: matchingOrder.quantity
  return true
}

function canBuy (order: Order) : boolean {
  let bids = OrderBooks.get(order.ticker)
  if (!bids) {
    throw new Error(`Orderbook.canBuy: Bids for ticker: ${order.ticker} not found`)
  }

  if (bids.sellBids.length === 0) {
    return false // No sellers
  }
  if (bids.sellBids[0] < order.limit) {
    return true // there are sellers at given or better price
  }
  return false
}

function sell (order: Order, trade: Trade): boolean {
  if (!canSell(order)) {
    return false // no buyers
  }
  let bids = OrderBooks.get(order.ticker)
  if (!bids) {
    throw new Error(
      `Orderbook.sell: Bids for ticker: ${order.ticker} not found`
    )
  }

  let matchingOrder = bids.sellBids.shift()
  trade.price = 0 //todo: matchingOrder.limit
  trade.quantity = 0 // todo: matchingOrder.quantity
  return true
}

function canSell (order: Order): boolean {
  let bids = OrderBooks.get(order.ticker)
  if (!bids) {
    throw new Error(
      `Orderbook.canBuy: Bids for ticker: ${order.ticker} not found`
    )
  }

  if (bids.buyBids.length === 0) {
    return false // no buyers
  }
  if (bids.buyBids[0] > order.limit) {
    return true // there are buyers at given or better price
  }
  return false
}

function sort(order: Order) {
  let bids = OrderBooks.get(order.ticker)
  if (!bids) {
    throw new Error(
      `Orderbook.sort: Bids for ticker: ${order.ticker} not found`
    )
  }

  bids.buyBids.sort((a, b) => b - a).slice(0)
  bids.sellBids.sort((a, b) => a - b).slice(0)
}

function trim(order: Order) {
  let bids = OrderBooks.get(order.ticker)
  if (!bids) {
    throw new Error(
      `Orderbook.canBuy: trim for ticker: ${order.ticker} not found`
    )
  }

  if (bids.buyBids.length >= maxDepth) {
    bids.buyBids.splice(-1, 1)
  }
  if (bids.sellBids.length >= maxDepth) {
    bids.sellBids.splice(-1, 1)
  }
}

export { execute, getOrder, cancelOrder }

