import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import Clob from '../src/index'

const test = suite('test')

test('Buy', () => {
  let json = Clob.Buy('traderjoe', 'TW', 10000, 10 )
  let result = JSON.parse(json)
  assert.equal(result.outcome, undefined)
})

test.run()
