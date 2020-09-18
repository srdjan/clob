import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { Order } from '../../src/order'

const test = suite('Test Orders')

test('initialize empty order', () => {
  let order = Order.getEmpty()

  assert.equal(order.trader.username, '')
  assert.equal(order.limit, 0)
  assert.equal(order.quantity, 0)
})

test('initialize order', () => {
  let order = new Order({username: 'trader1', password: 'ds2!'},'TW','Buy', 10, 10 )

  assert.equal(order.trader.username, 'trader1')
  assert.equal(order.ticker, 'TW')
  assert.equal(order.limit, 10)
})

test.run()
