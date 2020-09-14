import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import * as Clob from '../../src/index'
import { MarketResponse } from '../../src/model'

const log = console.log

const test1 = suite('Acceptance test1')
test1('A single valid order is accepted into the limit order book Given an empty orderbook for "TW"', () => {
  let response = Clob.post('trader1', 'TW', 'Buy', 9950, 100)
  let result = JSON.parse(response) as MarketResponse
  
  assert.equal(result.order.ticker, 'TW')
  assert.equal(result.order.trader.username, 'trader1')

})
test1.after(() => Clob.clearAll())
test1.run()

const test2 = suite('Acceptance test2')
test2('Multiple valid orders are accepted into the limit order book Given an empty orderbook for "TW"', () => {
  let response1 = Clob.post('trader1', 'TW', 'Buy', 9950, 100)
  let response2 = Clob.post('trader2', 'TW', 'Sell', 9960, 200)
  let orderBook = Clob.getOrderHistory('TW')
  // console.log(`\n\ORDERBOOK: ${JSON.stringify(orderBook)}`)
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
test3('Two tradable orders result in a trade Given an empty orderbook for "TW"', () => {
  let response1 = Clob.post('trader1', 'TW', 'Buy', 9950, 100)
  let response2 = Clob.post('trader2', 'TW', 'Sell', 9950, 100)

  let orderBook = Clob.getOrderHistory('TW')
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

  let parsedResponse2 = JSON.parse(response2)
  // log(`\n\ntrade= ${JSON.stringify(parsedResponse2)}`)
  assert.equal(parsedResponse2.trade.ticker, 'TW')
  assert.equal(parsedResponse2.trade.price, 9950)
  assert.equal(parsedResponse2.trade.quantity, 100)
  assert.equal(parsedResponse2.trade.buyOrder.trader.username, 'trader1')
  assert.equal(parsedResponse2.trade.sellOrder.trader.username, 'trader2')
})
test3.after(() => Clob.clearAll())
test3.run()

const test4 = suite('Acceptance test4')
test4('Two tradable orders with different quantities are partially filled Given an empty orderbook for "TW"',
  () => {
    let response1 = Clob.post('trader1', 'TW', 'Buy', 9950, 100)
    let response2 = Clob.post('trader2', 'TW', 'Sell', 9950, 300)
    let orderBook = Clob.getOrderHistory('TW')

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
    assert.equal(orderBook[1].filledQuantity, 200)

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
    Clob.post('trader1', 'TW', 'Buy', 9950, 100)
    Clob.post('trader2', 'TW', 'Buy', 9945, 300)
    Clob.post('trader3', 'TW', 'Buy', 9935, 500)
    Clob.post('trader4', 'TW', 'Sell', 9930, 1000)

    let ob = Clob.getOrderHistory('TW')
    assert.equal(ob.length, 4)

    console.log(`\n\r${ob[0].trader.username}\t${ob[0].status}\t${ob[0].createdAt}\t${ob[0].limit}\t${ob[0].quantity}\t${ob[0].filledQuantity}`)
    console.log(`${ob[1].trader.username}\t${ob[1].status}\t${ob[1].createdAt}\t${ob[0].limit}\t${ob[0].quantity}\t${ob[0].filledQuantity}`)
    console.log(`${ob[2].trader.username}\t${ob[2].status}\t${ob[2].createdAt}\t${ob[0].limit}\t${ob[0].quantity}\t${ob[0].filledQuantity}`)
    console.log(`${ob[3].trader.username}\t${ob[3].status}\t${ob[3].createdAt}\t${ob[0].limit}\t${ob[0].quantity}\t${ob[0].filledQuantity}`)

    assert.equal(ob[0].ticker, 'TW')
    assert.equal(ob[0].trader.username, 'trader1')
    assert.equal(ob[0].side, 'Buy')
    assert.equal(ob[0].limit, 9950)
    assert.equal(ob[0].quantity, 100)
    assert.equal(ob[0].filledQuantity, 100)
    assert.equal(ob[0].status, 'Completed')

    assert.equal(ob[1].ticker, 'TW')
    assert.equal(ob[1].trader.username, 'trader2')
    assert.equal(ob[1].side, 'Buy')
    assert.equal(ob[1].limit, 9945)
    assert.equal(ob[1].quantity, 300)
    assert.equal(ob[1].filledQuantity, 300)
    assert.equal(ob[1].status, 'Completed')

    assert.equal(ob[2].ticker, 'TW')
    assert.equal(ob[2].trader.username, 'trader3')
    assert.equal(ob[2].side, 'Buy')
    assert.equal(ob[2].limit, 9935)
    assert.equal(ob[2].quantity, 500)
    assert.equal(ob[2].filledQuantity, 500)
    assert.equal(ob[2].status, 'Completed')

    assert.equal(ob[3].ticker, 'TW')
    assert.equal(ob[3].trader.username, 'trader4')
    assert.equal(ob[3].side, 'Sell')
    assert.equal(ob[3].limit, 9930)
    assert.equal(ob[3].quantity, 1000)
    assert.equal(ob[3].filledQuantity, 900)
    assert.equal(ob[3].status, 'Open')
  }
)
test5.after(() => Clob.clearAll())
test5.run()

