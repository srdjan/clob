import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import Clob from '../src/index'

const test = suite('test')

test('Buy', () => {
  let response = Clob.Buy('traderjoe', 'TW', 10000, 10 )
  let result = JSON.parse(response)
  assert.equal(result.outcome, undefined)
  
  let order = JSON.parse(response)
  assert.equal(order.ticker, 'TW') 
})

test('Sell', () => {
  let json = Clob.Sell('traderjoe', 'TW', 9999, 10)
  let result = JSON.parse(json)
  assert.equal(result.outcome, undefined)
})

test('Cancel', () => {
  let response = Clob.Buy('traderjoe', 'TW', 10000, 10)
  let order = JSON.parse(response)

  response = Clob.Cancel(order.username, order.id, order.ticker)
  assert.equal(response, 'This Cancel order has failed. Please try later')
})

test.run()
