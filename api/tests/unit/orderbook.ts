import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as OrderBooks from '../../src/orderbooks'
import * as OrderBook from '../../src/engine'
import { IOrder, Side, Ticker } from '../../src/model'
import { Order } from '../../src/order'

const log = console.log

function showOrders (ob: IOrder[]) {
  log(`\n\r${ob[0].trader.username}\t${ob[0].limit}\t${ob[0].quantity}\t${ob[0].filledQuantity}\t${ob[0].status}`)
  log(`${ob[1].trader.username}\t${ob[1].limit}\t${ob[1].quantity}\t${ob[1].filledQuantity}\t${ob[1].status}`)
  log(`${ob[2].trader.username}\t${ob[2].limit}\t${ob[2].quantity}\t${ob[2].filledQuantity}\t${ob[2].status}`)
  log(`${ob[3].trader.username}\t${ob[3].limit}\t${ob[3].quantity}\t${ob[3].filledQuantity}\t${ob[3].status}`)
}

function newOrder (
  trader: string,
  ticker: Ticker,
  side: Side,
  limit: number,
  quantity: number
): IOrder {
  return new Order({ username: trader }, ticker, side, limit, quantity)
}

const test1 = suite('Test OrderBook')
test1('make first Buy Order', () => {
  let response = OrderBook.match(newOrder('joe', 'TW', 'Buy', 10, 100))

  assert.equal(response.order.ticker, 'TW')
  assert.equal(response.order.side, 'Buy')
  assert.equal(response.order.limit, 10)
  assert.equal(response.order.quantity, 100)
})
test1.after(() => OrderBooks.clearAll())
test1.run()

const test2 = suite()
test2('make first Sell Order', () => {
  let response = OrderBook.match(newOrder('joe', 'TW', 'Sell', 10, 100))

  assert.equal(response.order.ticker, 'TW')
  assert.equal(response.order.side, 'Sell')
  assert.equal(response.order.limit, 10)
  assert.equal(response.order.quantity, 100)
})
test2.after(() => OrderBooks.clearAll())
test2.run()

const test3 = suite()
test3('cancel order', () => {
  let buyResponse = OrderBook.match(newOrder('joe', 'TW', 'Buy', 10, 100))
  let buyOrder = OrderBooks.getOrder(buyResponse.order.id)
  let canceledOrder = OrderBooks.cancelOrder(buyOrder.id)
  assert.equal(canceledOrder, true)
})
test3.after(() => OrderBooks.clearAll())
test3.run()

const test4 = suite()
test4('Complete a full Buy trade', () => {
  let sellResponse = OrderBook.match(newOrder('joe', 'TW', 'Sell', 10, 100))
  assert.equal(sellResponse.order.limit, 10)
  assert.equal(sellResponse.order.quantity, 100)

  let buyResponse = OrderBook.match(newOrder('sue', 'TW', 'Buy', 10, 100))
  assert.equal(buyResponse.order.limit, 10)
  assert.equal(buyResponse.order.quantity, 100)
})
test4.after(() => OrderBooks.clearAll())
test4.run()

const test5 = suite()
test5('Complete a full Sell trade', () => {
  let buyResponse = OrderBook.match(newOrder('joe', 'TW', 'Buy', 10, 100))
  assert.equal(buyResponse.order.limit, 10)
  assert.equal(buyResponse.order.quantity, 100)

  let sellResponse = OrderBook.match(newOrder('sue', 'TW', 'Sell', 10, 100))
  assert.equal(sellResponse.order.limit, 10)
  assert.equal(sellResponse.order.quantity, 100)
})
test5.after(() => OrderBooks.clearAll())
test5.run()

const test6 = suite()
test6('Complete a partial Buy trade', () => {
  let sellResponse = OrderBook.match(newOrder('joe', 'NET', 'Sell', 2000, 90))
  assert.equal(sellResponse.order.limit, 2000)
  assert.equal(sellResponse.order.quantity, 90)
  assert.equal(sellResponse.order.status, 'Open')

  let buyResponse = OrderBook.match(newOrder('sue', 'NET', 'Buy', 2000, 100))
  assert.equal(buyResponse.order.limit, 2000)
  assert.equal(buyResponse.order.quantity, 100)
  assert.equal(buyResponse.order.filledQuantity, 10)
  assert.equal(buyResponse.order.status, 'Open')
})
test6.after(() => OrderBooks.clearAll())
test6.run()

const test7 = suite()
test7('Complete a partial Sell trade', () => {
  let buyResponse = OrderBook.match(newOrder('joe', 'T', 'Buy', 10, 90))
  assert.equal(buyResponse.order.limit, 10)
  assert.equal(buyResponse.order.quantity, 90)
  assert.equal(buyResponse.order.status, 'Open')

  let sellResponse = OrderBook.match(newOrder('sue', 'T', 'Sell', 10, 100))
  assert.equal(sellResponse.order.limit, 10)
  assert.equal(sellResponse.order.quantity, 100)
  assert.equal(sellResponse.order.filledQuantity, 10)
  assert.equal(sellResponse.order.status, 'Open')
})
test7.after(() => OrderBooks.clearAll())
test7.run()

const test8 = suite()
test8('Fail a self trade', () => {
  let buyResponse = OrderBook.match(newOrder('joe', 'TW', 'Buy', 10, 100))
  assert.equal(buyResponse.order.limit, 10)
  assert.equal(buyResponse.order.quantity, 100)

  let sellResponse = OrderBook.match(newOrder('joe', 'TW', 'Sell', 10, 100))
  log(`sellResponse: ${JSON.stringify(sellResponse)}`)
  assert.equal(sellResponse.trades, [])
})
test8.after(() => OrderBooks.clearAll())
test8.run()

const test9 = suite('multiple trades on one bid')
test9('Complete a multiple matching trades on one Sell trade', () => {
  OrderBook.match(newOrder('trader1', 'TW', 'Buy', 9950, 100))
  OrderBook.match(newOrder('trader2', 'TW', 'Buy', 9945, 300))
  OrderBook.match(newOrder('trader3', 'TW', 'Buy', 9935, 500))
  OrderBook.match(newOrder('trader4', 'TW', 'Sell', 9930, 1000))

  let ob = OrderBooks.getOrders('TW')
  assert.equal(ob.length, 4)

  showOrders(ob)

  assert.equal(ob[0].ticker, 'TW')
  assert.equal(ob[0].trader.username, 'trader1')
  assert.equal(ob[0].side, 'Buy')
  assert.equal(ob[0].limit, 9950)
  assert.equal(ob[0].quantity, 100)
  assert.equal(ob[0].filledQuantity, 100)
  assert.equal(ob[0].status, 'Completed')

  assert.equal(ob[1].ticker, 'TW')
  assert.equal(ob[1].trader.username, 'trader2')
  assert.equal(ob[1].side, 'Buy')
  assert.equal(ob[1].limit, 9945)
  assert.equal(ob[1].quantity, 300)
  assert.equal(ob[1].filledQuantity, 300)
  assert.equal(ob[1].status, 'Completed')

  assert.equal(ob[2].ticker, 'TW')
  assert.equal(ob[2].trader.username, 'trader3')
  assert.equal(ob[2].side, 'Buy')
  assert.equal(ob[2].limit, 9935)
  assert.equal(ob[2].quantity, 500)
  assert.equal(ob[2].filledQuantity, 500)
  assert.equal(ob[2].status, 'Completed')

  assert.equal(ob[3].ticker, 'TW')
  assert.equal(ob[3].trader.username, 'trader4')
  assert.equal(ob[3].side, 'Sell')
  assert.equal(ob[3].limit, 9930)
  assert.equal(ob[3].quantity, 1000)
  assert.equal(ob[3].filledQuantity, 900)
  assert.equal(ob[3].status, 'Open')
})
test9.after(() => OrderBooks.clearAll())
test9.run()
