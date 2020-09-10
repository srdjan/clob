import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as Clob from '../../src/index'
import {MarketResponse} from '../../src/model'
const test = suite('Acceptance test')

test('A single valid order is accepted into the limit order book Given an empty orderbook for "TW"', () => {
  let response = Clob.bid('trader1', 'TW', 'Buy', 9950, 100)
  let result = JSON.parse(response) as MarketResponse
  
  assert.equal(result.order.ticker, 'TW')
  assert.equal(result.order.trader.username, 'trader1')
})

test.only('Multiple valid orders are accepted into the limit order book Given an empty orderbook for "TW"', () => {
  let response1 = Clob.bid('trader1', 'TW', 'Buy', 9950, 100)
  let response2 = Clob.bid('trader2', 'TW', 'Sell', 9960, 200)
  let orderBook = Clob.getEntries('TW')

  assert.equal(orderBook.length, 2)
})

test('Cancel', () => {
  let response = Clob.bid('traderjoe', 'TW', 'Buy', 10000, 10)
  let order = JSON.parse(response)

  response = Clob.cancel(order.username, order.id)
  assert.equal(response, 'This Cancel order has failed. Please try later')
})

test.run()
