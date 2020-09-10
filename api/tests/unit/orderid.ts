import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import OrderId from '../../src/orderid'

const test = suite('Test OrderId')

test('create', () => {
  let orderIdStr = OrderId.next('TW', 'Buy')
  let orderId = OrderId.fromString(orderIdStr)

  assert.equal(orderId.ticker, 'TW')
  assert.equal(orderId.side, 'Buy')
})

test.run()
