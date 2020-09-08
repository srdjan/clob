import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as Market from '../../src/market'

const test = suite('Test Market Trades')

test('Complite a full match Buy trade', () => {
  let buyTrade = Market.bid('joe', 'Buy', 'TW', 10, 100)
  console.log(`buy trade: ${JSON.stringify(buyTrade)}`);
  assert.equal(buyTrade.price, 10)
  assert.equal(buyTrade.quantity, 100)

  let sellTrade = Market.bid('sue', 'Sell', 'TW', 10, 100)
  console.log(`sell trade: ${JSON.stringify(sellTrade)}`);
  assert.equal(sellTrade.price, 10)
  assert.equal(sellTrade.quantity, 100)
})

test.skip('Complite a partial match Sell trade', () => {
  // let buyTrade= Market.bid('joe', 'Buy', 'TW', 10, 150)
  // let sellTrade = Market.bid('sue', 'Sell', 'TW', 10, 100)

  // assert.equal(buyTrade.quantity, 50)
  // assert.equal(sellTrade.quantity, 50)
})

test.run()
