import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { Trades } from '../../src/trades'

const test = suite('Test Trades')

test('initialize trade', () => {
  let trade = Trades.initializeTrade('TSLA')

  assert.equal(trade.ticker, 'TSLA')
  assert.equal(trade.message, 'None')
})

test('verify acreation', () => {
  let originalSize = Trades.getSize()
  let trade = Trades.initializeTrade('TSLA')
  Trades.insert(trade)
  assert.equal(Trades.getSize(), originalSize + 1)
})

test.run()
