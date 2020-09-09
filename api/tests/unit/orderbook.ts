import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as Ob from '../../src/orderbook'
import { Order, Side, Ticker } from '../../src/model'
import * as OrderId from '../../src/orderid'

const test = suite('Test OrderBook')

function makeOrder (
  trader: string,
  ticker: Ticker,
  side: Side,
  limit: number,
  quantity: number
): Order {
  return {
    id: OrderId.createAsString(ticker, side),
    trader: { username: trader },
    ticker: ticker,
    side: side,
    limit: limit,
    quantity: quantity,
    filledQuantity: 0,
    status: 'Open',
    createdAt: new Date().getTime()
  }
}

test('make first Buy Order', () => {
  let response = Ob.match(makeOrder('joe', 'TW', 'Buy', 10, 100))

  assert.equal(response.order.ticker, 'TW')
  assert.equal(response.order.side, 'Buy')
  assert.equal(response.order.limit, 10)
  assert.equal(response.order.quantity, 100)
})

test('make first Sell Order', () => {
  let response = Ob.match(makeOrder('joe', 'TW', 'Sell', 10, 100))

  assert.equal(response.order.ticker, 'TW')
  assert.equal(response.order.side, 'Sell')
  assert.equal(response.order.limit, 10)
  assert.equal(response.order.quantity, 100)
})

test('cancel order', () => {
  let buyResponse = Ob.match(makeOrder('joe', 'TW', 'Buy', 10, 100))
  let buyOrder = Ob.getOrder(buyResponse.order.id)
  let canceledOrder = Ob.cancelOrder(buyOrder.id)
  assert.equal(canceledOrder, true)
})

test('Complite a full Buy trade', () => {
  let sellResponse = Ob.match(makeOrder('joe', 'TW', 'Sell', 10, 100))
  assert.equal(sellResponse.order.limit, 10)
  assert.equal(sellResponse.order.quantity, 100)

  let buyResponse = Ob.match(makeOrder('sue', 'TW', 'Buy', 10, 100))
  assert.equal(buyResponse.order.limit, 10)
  assert.equal(buyResponse.order.quantity, 100)
})

test('Complite a full Sell trade', () => {
  let buyResponse = Ob.match(makeOrder('joe', 'TW', 'Buy', 10, 100))
  assert.equal(buyResponse.order.limit, 10)
  assert.equal(buyResponse.order.quantity, 100)

  let sellResponse = Ob.match(makeOrder('sue', 'TW', 'Sell', 10, 100))
  console.log(`sell order: ${JSON.stringify(sellResponse && sellResponse.order)}`)
  assert.equal(sellResponse.order.limit, 10)
  assert.equal(sellResponse.order.quantity, 100)
})

test('Complite a partial Buy trade', () => {
  let sellResponse = Ob.match(makeOrder('joe', 'TW', 'Sell', 10, 70))
  assert.equal(sellResponse.order.limit, 10)
  assert.equal(sellResponse.order.quantity, 70)
  assert.equal(sellResponse.order.status, 'Open')

  let buyResponse = Ob.match(makeOrder('sue', 'TW', 'Buy', 10, 100))
  // console.log(`${JSON.stringify(buyResponse)}`)
  assert.equal(buyResponse.order.limit, 10)
  assert.equal(buyResponse.order.quantity, 100)
  assert.equal(buyResponse.order.filledQuantity, 70)
  assert.equal(buyResponse.order.status, 'Partial')
})

test('Complite a partial Sell trade', () => {
  let buyResponse = Ob.match(makeOrder('joe', 'TW', 'Buy', 10, 90))
  assert.equal(buyResponse.order.limit, 10)
  assert.equal(buyResponse.order.quantity, 90)
  assert.equal(buyResponse.order.status, 'Open')

  let sellResponse = Ob.match(makeOrder('sue', 'TW', 'Sell', 10, 100))
  console.log(`${JSON.stringify(sellResponse)}`)
  assert.equal(sellResponse.order.limit, 10)
  assert.equal(sellResponse.order.quantity, 100)
  assert.equal(sellResponse.order.filledQuantity, 90)
  assert.equal(sellResponse.order.status, 'Partial')
})

test('Fail a self trade', () => {
  let buyResponse = Ob.match(makeOrder('joe', 'TW', 'Buy', 10, 100))
  assert.equal(buyResponse.order.limit, 10)
  assert.equal(buyResponse.order.quantity, 100)

  let sellResponse = Ob.match(makeOrder('joe', 'TW', 'Sell', 10, 100))

  assert.equal(sellResponse.trade.message, 'Fail')
})

test.run()
