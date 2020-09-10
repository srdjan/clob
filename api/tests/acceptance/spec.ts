import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as Clob from '../../src/index'
import {MarketResponse} from '../../src/model'

const test1 = suite('Acceptance test1')
test1('A single valid order is accepted into the limit order book Given an empty orderbook for "TW"', () => {
  let response = Clob.bid('trader1', 'TW', 'Buy', 9950, 100)
  let result = JSON.parse(response) as MarketResponse
  
  assert.equal(result.order.ticker, 'TW')
  assert.equal(result.order.trader.username, 'trader1')

})
test1.after(() => Clob.clearAll())
test1.run()

const test2 = suite('Acceptance test2')
test2('Multiple valid orders are accepted into the limit order book Given an empty orderbook for "TW"', () => {
  let response1 = Clob.bid('trader1', 'TW', 'Buy', 9950, 100)
  let response2 = Clob.bid('trader2', 'TW', 'Sell', 9960, 200)
  let orderBook = Clob.getOrders('TW')
  console.log(`\n\ORDERBOOK: ${JSON.stringify(orderBook)}`)
  assert.equal(orderBook.length, 2)

  assert.equal(orderBook[0].ticker, 'TW')
  assert.equal(orderBook[1].ticker, 'TW')

  assert.equal(orderBook[0].trader.username, 'trader1')
  assert.equal(orderBook[1].trader.username, 'trader2')

  assert.equal(orderBook[0].side, 'Buy')
  assert.equal(orderBook[1].side, 'Sell')

  assert.equal(orderBook[0].limit, 9950)
  assert.equal(orderBook[1].limit, 9960)

  assert.equal(orderBook[0].quantity, 100)
  assert.equal(orderBook[1].quantity, 200)

  assert.equal(orderBook[0].filledQuantity, 0)
  assert.equal(orderBook[1].filledQuantity, 0)

  assert.equal(orderBook[0].status, 'Open')
  assert.equal(orderBook[1].status, 'Open')
})
test2.after(() => Clob.clearAll())
test2.run()

const test3 = suite('Acceptance test3')
test3('Two tradable orders result in a trade Given an empty orderbook for "TW"', () => {
  let response1 = Clob.bid('trader1', 'TW', 'Buy', 9950, 100)
  let response2 = Clob.bid('trader2', 'TW', 'Sell', 9950, 100)
  let orderBook = Clob.getOrders('TW')

  assert.equal(orderBook.length, 2)

  assert.equal(orderBook[0].ticker, 'TW')
  assert.equal(orderBook[1].ticker, 'TW')

  assert.equal(orderBook[0].trader.username, 'trader1')
  assert.equal(orderBook[1].trader.username, 'trader2')

  assert.equal(orderBook[0].side, 'Buy')
  assert.equal(orderBook[1].side, 'Sell')

  assert.equal(orderBook[0].limit, 9950)
  assert.equal(orderBook[1].limit, 9950)

  assert.equal(orderBook[0].quantity, 100)
  assert.equal(orderBook[1].quantity, 100)

  assert.equal(orderBook[0].filledQuantity, 100)
  assert.equal(orderBook[1].filledQuantity, 100)

  assert.equal(orderBook[0].status, 'Completed')
  assert.equal(orderBook[1].status, 'Completed')
})
test3.after(() => Clob.clearAll())
test3.run()
