import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as Clob from '../../src/index'
import { MarketResponse } from '../../src/model'

const test1 = suite('Acceptance test1')
test1.skip('A single valid order is accepted into the limit order book Given an empty orderbook for "TW"', () => {
  let response = Clob.bid('trader1', 'TW', 'Buy', 9950, 100)
  let result = JSON.parse(response) as MarketResponse
  
  assert.equal(result.order.ticker, 'TW')
  assert.equal(result.order.trader.username, 'trader1')

})
test1.after(() => Clob.clearAll())
test1.run()

const test2 = suite('Acceptance test2')
test2.skip('Multiple valid orders are accepted into the limit order book Given an empty orderbook for "TW"', () => {
  let response1 = Clob.bid('trader1', 'TW', 'Buy', 9950, 100)
  let response2 = Clob.bid('trader2', 'TW', 'Sell', 9960, 200)
  let orderBook = Clob.getOrders('TW')
  console.log(`\n\ORDERBOOK: ${JSON.stringify(orderBook)}`)
  assert.equal(orderBook.length, 2)

  assert.equal(orderBook[0].ticker, 'TW')
  assert.equal(orderBook[1].ticker, 'TW')

  assert.equal(orderBook[0].trader.username, 'trader1')
  assert.equal(orderBook[1].trader.username, 'trader2')

  assert.equal(orderBook[0].side, 'Buy')
  assert.equal(orderBook[1].side, 'Sell')

  assert.equal(orderBook[0].limit, 9950)
  assert.equal(orderBook[1].limit, 9960)

  assert.equal(orderBook[0].quantity, 100)
  assert.equal(orderBook[1].quantity, 200)

  assert.equal(orderBook[0].filledQuantity, 0)
  assert.equal(orderBook[1].filledQuantity, 0)

  assert.equal(orderBook[0].status, 'Open')
  assert.equal(orderBook[1].status, 'Open')
})
test2.after(() => Clob.clearAll())
test2.run()

const test3 = suite('Acceptance test3')
test3.skip('Two tradable orders result in a trade Given an empty orderbook for "TW"', () => {
  let response1 = Clob.bid('trader1', 'TW', 'Buy', 9950, 100)
  let response2 = Clob.bid('trader2', 'TW', 'Sell', 9950, 100)

  let orderBook = Clob.getOrders('TW')
  assert.equal(orderBook.length, 2)

  assert.equal(orderBook[0].ticker, 'TW')
  assert.equal(orderBook[1].ticker, 'TW')

  assert.equal(orderBook[0].trader.username, 'trader1')
  assert.equal(orderBook[1].trader.username, 'trader2')

  assert.equal(orderBook[0].side, 'Buy')
  assert.equal(orderBook[1].side, 'Sell')

  assert.equal(orderBook[0].limit, 9950)
  assert.equal(orderBook[1].limit, 9950)

  assert.equal(orderBook[0].quantity, 100)
  assert.equal(orderBook[1].quantity, 100)

  assert.equal(orderBook[0].filledQuantity, 100)
  assert.equal(orderBook[1].filledQuantity, 100)

  assert.equal(orderBook[0].status, 'Completed')
  assert.equal(orderBook[1].status, 'Completed')

  let {order, trade} = JSON.parse(response2)
  assert.equal(trade.ticker, 'TW')
  assert.equal(trade.price, 9950)
  assert.equal(trade.quantity, 100)
  assert.equal(trade.buyOrder.trader.username, 'trader1')
  assert.equal(trade.sellOrder.trader.username, 'trader2')
})
test3.after(() => Clob.clearAll())
test3.run()

const test4 = suite('Acceptance test4')
test4.skip('Two tradable orders with different quantities are partially filled Given an empty orderbook for "TW"',
  () => {
    let response1 = Clob.bid('trader1', 'TW', 'Buy', 9950, 100)
    let response2 = Clob.bid('trader2', 'TW', 'Sell', 9950, 300)
    let orderBook = Clob.getOrders('TW')

    assert.equal(orderBook.length, 2)

    assert.equal(orderBook[0].ticker, 'TW')
    assert.equal(orderBook[1].ticker, 'TW')

    assert.equal(orderBook[0].trader.username, 'trader1')
    assert.equal(orderBook[1].trader.username, 'trader2')

    assert.equal(orderBook[0].side, 'Buy')
    assert.equal(orderBook[1].side, 'Sell')

    assert.equal(orderBook[0].limit, 9950)
    assert.equal(orderBook[1].limit, 9950)

    assert.equal(orderBook[0].quantity, 100)
    assert.equal(orderBook[1].quantity, 300)

    assert.equal(orderBook[0].filledQuantity, 100)
    assert.equal(orderBook[1].filledQuantity, 100)

    assert.equal(orderBook[0].status, 'Completed')
    assert.equal(orderBook[1].status, 'Open')

    let { order, trade } = JSON.parse(response2)
    assert.equal(trade.ticker, 'TW')
    assert.equal(trade.price, 9950)
    assert.equal(trade.quantity, 100)
    assert.equal(trade.buyOrder.trader.username, 'trader1')
    assert.equal(trade.sellOrder.trader.username, 'trader2')
  }
)
test4.after(() => Clob.clearAll())
test4.run()

const test5 = suite('Acceptance test5')
test5('A valid single order is able to sweep the book Given an empty orderbook for "TW"',
  () => {
    Clob.bid('trader1', 'TW', 'Buy', 9950, 100)
    Clob.bid('trader2', 'TW', 'Buy', 9945, 300)
    Clob.bid('trader3', 'TW', 'Buy', 9935, 500)
    Clob.bid('trader4', 'TW', 'Sell', 9930, 1000)

    let orderBook = Clob.getOrders('TW')
    assert.equal(orderBook.length, 4)

    console.log(`\n\rorderBook: ${orderBook[0].trader.username}\t${orderBook[0].limit}\t${orderBook[0].createdAt}`)
    console.log(`\n\rorderBook: ${orderBook[1].trader.username}\t${orderBook[1].limit}\t${orderBook[1].createdAt}`)
    console.log(`\n\rorderBook: ${orderBook[2].trader.username}\t${orderBook[2].limit}\t${orderBook[2].createdAt}`)
    console.log(`\n\rorderBook: ${orderBook[3].trader.username}\t${orderBook[3].limit}\t${orderBook[3].createdAt}`)

    // assert.equal(orderBook[0].ticker, 'TW')
    // assert.equal(orderBook[0].trader.username, 'trader1')
    // assert.equal(orderBook[0].side, 'Buy')
    // assert.equal(orderBook[0].limit, 9950)
    // assert.equal(orderBook[0].quantity, 100)
    // assert.equal(orderBook[0].filledQuantity, 100)
    // assert.equal(orderBook[0].status, 'Completed')

    // assert.equal(orderBook[1].ticker, 'TW')
    // assert.equal(orderBook[1].trader.username, 'trader2')
    // assert.equal(orderBook[1].side, 'Buy')
    // assert.equal(orderBook[1].limit, 9945)
    // assert.equal(orderBook[1].quantity, 300)
    // assert.equal(orderBook[1].filledQuantity, 300)
    // assert.equal(orderBook[1].status, 'Complete')

    // assert.equal(orderBook[2].ticker, 'TW')
    // assert.equal(orderBook[2].trader.username, 'trader3')
    // assert.equal(orderBook[2].side, 'Buy')
    // assert.equal(orderBook[2].limit, 9935)
    // assert.equal(orderBook[2].quantity, 500)
    // assert.equal(orderBook[2].filledQuantity, 500)
    // assert.equal(orderBook[2].status, 'Complete')

    // assert.equal(orderBook[3].ticker, 'TW')
    // assert.equal(orderBook[3].trader.username, 'trader4')
    // assert.equal(orderBook[3].side, 'Sell')
    // assert.equal(orderBook[3].limit, 9930)
    // assert.equal(orderBook[3].quantity, 1000)
    // assert.equal(orderBook[3].filledQuantity, 900)
    // assert.equal(orderBook[3].status, 'Open')
  }
)
test5.after(() => Clob.clearAll())
test5.run()

const test6 = suite('Order id creation')
test6.skip('check Id creation"',
  () => {
    let response = Clob.bid('trader1', 'TW', 'Buy', 9950, 100)
    console.log(`\n\nRESPONSE: ${JSON.stringify(response)}`)
    let {order, trade} = JSON.parse(response)

    // assert.equal(order.id, 1)
  }
)
test6.after(() => Clob.clearAll())
test6.run()
