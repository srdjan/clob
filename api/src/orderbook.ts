import { IOrder, OrderBook, MarketResponse, Ticker, Trade } from './model'
import { getEmptyOrder } from './order'
import * as OrderBooks from './orderbooks'
import { log } from './utils'
import { performance } from 'perf_hooks'

function match (order: IOrder): MarketResponse {
  let trades = new Array<Trade>()
  let orderBook = OrderBooks.insertOrder(order)
  let i: number
  for(i=0; i<10; i++) {
    let matchOrder = getMatching(order, orderBook)
    if (!matchOrder) {
      log(`Orderbook.match: NO matching orders`)
      break
    }

    if (matchOrder.trader.username === order.trader.username) {
      log(`Orderbook.match: no trade possible: SAME trader on both sides`)
      //todo: but check if there are trades to be made with ther traders???
      break
    }

    let trade = getEmptyTrade(order.ticker)
    trade.price = matchOrder.limit
    trade.quantity = order.quantity > matchOrder.quantity ? matchOrder.quantity : order.quantity
    trade.buyOrder = order.side === 'Buy' ? order : matchOrder
    trade.sellOrder = order.side === 'Sell' ? order : matchOrder
    trade.message = 'Success'
    trades.push(trade)

    let availableQuantity = order.quantity - order.filledQuantity
    if (availableQuantity > matchOrder.quantity) {
      order.status = 'Open'
      order.filledQuantity = matchOrder.quantity
      matchOrder.status = 'Completed'
      matchOrder.filledQuantity = matchOrder.quantity
    } 
    else if (availableQuantity < matchOrder.quantity) {
      order.status = 'Completed'
      order.filledQuantity = order.quantity
      matchOrder.status = 'Open'
      matchOrder.filledQuantity = order.quantity
    }
    else if (order.quantity === matchOrder.quantity) {
      order.status = 'Completed'
      order.filledQuantity = order.quantity
      matchOrder.status = 'Completed'
      matchOrder.filledQuantity = order.quantity
    }

    OrderBooks.updateOrder(orderBook, order)
    log(`\n\nOrderbook.match: updated order ${JSON.stringify(order)}`)
    OrderBooks.updateOrder(orderBook, matchOrder)
    log(`\n\nOrderbook.match: updated matchOrder ${JSON.stringify(matchOrder)}`)
    
    // if(matchOrder.quantity >= matchOrder.filledQuantity) {
    //   OrderBooks.removeOrder(orderBook, matchOrder)
    // }
  }

  return { order, trades }
}

function getMatching (order: IOrder, orderBook: OrderBook): IOrder | undefined {
  if (order.side === 'Buy') {
    if (orderBook.sellSide.size === 0) {
      log(`Orderbook.getMatching: no SELL side orders`)
      return undefined
    }
    let matchOrder = orderBook.sellSide.entries().next().value[1]
    if (matchOrder.status === 'Open' && matchOrder.limit <= order.limit) {
      log(`Orderbook.getMatching: FOUND MATCH order on the SELL side`)
      return matchOrder // there are sellers at given or better price
    }
    log(`Orderbook.getMatching : no MATCH order on the SELL side found`)
  }

  if (order.side === 'Sell') {
    if (orderBook.buySide.size === 0) {
      log(`Orderbook.getMatching: no BUY sidee orders`)
      return undefined
    }
    let matchOrder = orderBook.buySide.entries().next().value[1]
    if (matchOrder.status === 'Open' && matchOrder.limit >= order.limit) {
      log(`Orderbook.getMatching: FOUND MATCH order on the BUY side`)
      return matchOrder // there are buyers at given or better price
    }
    log(`Orderbook.getMatching: no MATCH order on the BUY side found`)
  }

  return undefined
}

function getEmptyTrade(ticker: Ticker) {
  return {
    ticker: ticker,
    price: 0,
    quantity: 0,
    buyOrder: getEmptyOrder(),
    sellOrder: getEmptyOrder(),
    createdAt: Number(performance.now().toString(0)),//new Date().getTime(),
    message: 'Fail'
  }
}

//todo: extract
class SeqGen {
  static sequence = 0
  
  static next (): number {
    return SeqGen.sequence + 10
  }
}

export { match }
