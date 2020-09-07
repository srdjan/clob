import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as Market from '../src/market'
import * as Traders from '../src/traders'
import { log } from '../src/utils'

const test = suite('test')

test('Traders: getOrCreate', () => {
  let trader = Traders.getOrCreate('traderjoe')

  assert.equal(trader.username, 'traderjoe')
  assert.equal(trader.password, 'todo')
})

test('Market: make first Buy Order', () => {
  let [trade, order] = Market.bid('treaderjoe', 'Buy', 'TW', 10, 100)

  assert.equal(trade.ticker, 'TW')
  assert.equal(trade.quantity, 0)
  assert.equal(trade.price, 0)
  assert.equal(trade.message, 'NoOrder')
})

test('Market: make first Sell Order', () => {
  let [trade, order] = Market.bid('treaderjoe', 'Sell', 'TW', 10, 100)

  assert.equal(trade.ticker, 'TW')
  assert.equal(trade.quantity, 0)
  assert.equal(trade.price, 0)
  assert.equal(trade.message, 'NoOrder')
})

test('Market: Cancels order', () => {
  let [trade, order] = Market.bid('treaderjoe', 'Sell', 'TW', 10, 100)
  let savedOrder = Market.findOrder(order.id)
  const output = JSON.stringify(savedOrder)

  log(`Output: ${output}`)
  // assert.equal(order.limit, savedOrder.limit)
  // assert.equal(order.quantity, savedOrder.quantity)

  // let result = Market.cancel('treaderjoe', order.id)
  // assert.equal(result, true)
})

test.run()
