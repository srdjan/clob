import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as Traders from '../../src/traders'

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

