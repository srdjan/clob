import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as Market from '../src/market'
import * as Traders from '../src/traders'
import { log } from '../src/utils'

// ---- Traders --------
const testTraders = suite('Test Traders')
testTraders('getOrCreate', () => {
  let trader = Traders.getOrCreate('traderjoe')

  assert.equal(trader.username, 'traderjoe')
  assert.equal(trader.password, 'todo')
})
testTraders('verify: success', () => {
  let trader = Traders.getOrCreate('joe')
  let verified = Traders.verify('joe')
  assert.equal(verified, true)
})
testTraders('verify: fail', () => {
  Traders.getOrCreate('joe')
  assert.throws(() => Traders.verify('sam'))
})
testTraders.run()

// ---- Market --------
const testMarket = suite('Test Market')
testMarket('Market: make first Buy Order', () => {
  let [trade, order] = Market.bid('treaderjoe', 'Buy', 'TW', 10, 100)

  assert.equal(trade.ticker, 'TW')
  assert.equal(trade.quantity, 0)
  assert.equal(trade.price, 0)
  assert.equal(trade.message, 'NoOrder')
})

testMarket('Market: make first Sell Order', () => {
  let [trade, order] = Market.bid('treaderjoe', 'Sell', 'TW', 10, 100)

  assert.equal(trade.ticker, 'TW')
  assert.equal(trade.quantity, 0)
  assert.equal(trade.price, 0)
  assert.equal(trade.message, 'NoOrder')
})

testMarket('Market: Cancels order', () => {
  let [trade, order] = Market.bid('treaderjoe', 'Sell', 'TW', 10, 100)
  let savedOrder = Market.findOrder(order.id)
  const output = JSON.stringify(savedOrder)

  log(`Output: ${output}`)
  // assert.equal(order.limit, savedOrder.limit)
  // assert.equal(order.quantity, savedOrder.quantity)

  // let result = Market.cancel('treaderjoe', order.id)
  // assert.equal(result, true)
})

testMarket.run()

