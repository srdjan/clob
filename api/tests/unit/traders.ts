import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as Traders from '../../src/traders'

const test = suite('Test Traders')

test('getOrCreate', () => {
  let trader = Traders.getOrCreate('traderjoe')

  assert.equal(trader.username, 'traderjoe')
  assert.equal(trader.password, 'todo')
})

test('verify: success', () => {
  let trader = Traders.getOrCreate('joe')
  let verified = Traders.verify('joe')
  assert.equal(verified, true)
})

test('verify: fail', () => {
  Traders.getOrCreate('joe')
  assert.throws(() => Traders.verify('sam'))
})

test.run()

