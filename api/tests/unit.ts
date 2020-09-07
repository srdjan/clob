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
testMarket('make first Buy Order', () => {
  let [trade, order] = Market.bid('joe', 'Buy', 'TW', 10, 100)

  assert.equal(trade.ticker, 'TW')
  assert.equal(trade.quantity, 0)
  assert.equal(trade.price, 0)
  assert.equal(trade.message, 'NoOrder')
})

testMarket('make first Sell Order', () => {
  let [trade, order] = Market.bid('joe', 'Sell', 'TW', 10, 100)

  assert.equal(trade.ticker, 'TW')
  assert.equal(trade.quantity, 0)
  assert.equal(trade.price, 0)
  assert.equal(trade.message, 'NoOrder')
})

testMarket('cancel order', () => {
  let [trade, placedOrder] = Market.bid('joe', 'Sell', 'TW', 10, 100)
  log(`placed order: ${placedOrder.id}`)

  let savedOrder = Market.findOrder(placedOrder.id)
  log(`saved order: ${savedOrder.id}`)

  assert.equal(placedOrder.limit, savedOrder.limit)
  assert.equal(placedOrder.quantity, savedOrder.quantity)
})

testMarket.run()

