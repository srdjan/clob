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
  // let [_, buyOrder] = Market.bid('joe', 'Buy', 'TW', 10, 150)
  // let [trade, sellOrder] = Market.bid('sue', 'Sell', 'TW', 10, 100)

  // assert.equal(buyOrder.status, 'Complete')
  // assert.equal(buyOrder.filledQuantity, 50)
  // assert.equal(sellOrder.status, 'Complete')
  // assert.equal(sellOrder.filledQuantity, 50)
  // assert.equal(trade.price, 10)
  // assert.equal(trade.quantity, 50)
  // assert.equal(trade.buyOrderId, buyOrder.id)
  // assert.equal(trade.sellOrderId, sellOrder.id)
})

test.run()
