import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as OrderBooks from '../../src/orderbooks'
import * as OrderBook from '../../src/orderbook'
import { IOrder, Side, Ticker } from '../../src/model'
import {Order} from '../../src/order'

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
  assert.equal(buyResponse.order.filledQuantity, 90)
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
  assert.equal(sellResponse.order.filledQuantity, 90)
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
  console.log(`sellResponse: ${JSON.stringify(sellResponse)}`)
  assert.equal(sellResponse.trades, [])
})
test8.after(() => OrderBooks.clearAll())
test8.run()

