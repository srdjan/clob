import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as Market from '../../src/index'

const test = suite('Test Market')

test('make first Buy Order', () => {
  let trade = Market.bid('joe', 'Buy', 'TW', 10, 100)

  assert.equal(trade.ticker, 'TW')
  assert.equal(trade.quantity, 0)
  assert.equal(trade.price, 0)
  assert.equal(trade.message, 'NoOrder')
})

test('make first Sell Order', () => {
  let trade = Market.bid('joe', 'Sell', 'TW', 10, 100)

  assert.equal(trade.ticker, 'TW')
  assert.equal(trade.quantity, 0)
  assert.equal(trade.price, 0)
  assert.equal(trade.message, 'NoOrder')
})

test.skip('cancel order', () => {
  let trade = Market.bid('joe', 'Sell', 'TW', 10, 100)
  let savedOrder = Market.cancel("trade.sellOrderId")

  assert.equal(placedOrder.limit, savedOrder.limit)
  assert.equal(placedOrder.quantity, savedOrder.quantity)
})

test.skip()

