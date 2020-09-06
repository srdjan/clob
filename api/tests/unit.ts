import * as Market from '../src/market'
import * as Traders from '../src/traders'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

const test = suite('test')

test('Traders: getOrCreate', () => {
  let trader = Traders.getOrCreate('treaderjoe')

  assert.equal(trader.username, 'traderjoe')
  assert.equal(trader.password, 'todo')
})

test('Market: Buy Order', () => {
  let trade = Market.bid('treaderjoe', 'Buy', 'TW', 10, 100)

  assert.equal(trade.ticker, 'TW')
  assert.equal(trade.quantity, 100)
  assert.equal(trade.price, 10)
})

test('Market: Sell Order', () => {
  let trade = Market.bid('treaderjoe', 'Sell', 'TW', 10, 100)

  assert.equal(trade.ticker, 'TW')
  assert.equal(trade.quantity, 100)
  assert.equal(trade.price, 10)
})

test('Market: Cancels order', () => {
  let trade = Market.bid('treaderjoe', 'Sell', 'TW', 10, 100)
  let result = Market.cancel('treaderjoe', trade.sellOrderId, 'TW', 'Sell')

  assert.equal(result, true)
})

test.run()
