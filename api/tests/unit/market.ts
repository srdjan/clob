// import { suite } from 'uvu'
// import * as assert from 'uvu/assert'
// import * as Market from '../../src/market'

// const test = suite('Test Market')

// test('make first Buy Order', () => {
//   let [trade, order] = Market.bid('joe', 'Buy', 'TW', 10, 100)

//   assert.equal(trade.ticker, 'TW')
//   assert.equal(trade.quantity, 0)
//   assert.equal(trade.price, 0)
//   assert.equal(trade.message, 'NoOrder')
// })

// test('make first Sell Order', () => {
//   let [trade, order] = Market.bid('joe', 'Sell', 'TW', 10, 100)

//   assert.equal(trade.ticker, 'TW')
//   assert.equal(trade.quantity, 0)
//   assert.equal(trade.price, 0)
//   assert.equal(trade.message, 'NoOrder')
// })

// test('cancel order', () => {
//   let [trade, placedOrder] = Market.bid('joe', 'Sell', 'TW', 10, 100)
//   let savedOrder = Market.findOrder(placedOrder.id)

//   assert.equal(placedOrder.limit, savedOrder.limit)
//   assert.equal(placedOrder.quantity, savedOrder.quantity)
// })

// test.skip()

