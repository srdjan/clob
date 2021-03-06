import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { Market } from '../../src/index'

const market = new Market('stock@clob')
const log = console.log

const test1 = suite('Acceptance test1')
test1.only('A single valid order is accepted into the limit order book Given an empty orderbook for "TSLA"', () => {
  let result = market.post('trader1', 'TSLA', 'Buy', 9950, 100)
  
  assert.equal(result.order.ticker, 'TSLA')
  assert.equal(result.order.trader.username, 'trader1')
  market.clearAll('trader1', 'TSLA')
})
test1.run()

const test2 = suite('Acceptance test2')
test2('Multiple valid orders are accepted into the limit order book Given an empty orderbook for "TSLA"', () => {
  market.post('trader1', 'TSLA', 'Buy', 9950, 100)
  market.post('trader2', 'TSLA', 'Sell', 9960, 200)
  
  let orderBook = market.getHistory('trader1', 'TSLA')
  assert.equal(orderBook.length, 2)

  assert.equal(orderBook[0].ticker, 'TSLA')
  assert.equal(orderBook[1].ticker, 'TSLA')

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
  
  market.clearAll('trader1', 'TSLA')
})
test2.run()

const test3 = suite('Acceptance test3')
test3('Two tradable orders result in a trade Given an empty orderbook for "TSLA"', () => {
  let response1 = market.post('trader1', 'TSLA', 'Buy', 9950, 100)
  let response2 = market.post('trader2', 'TSLA', 'Sell', 9950, 100)

  let orderBook = market.getHistory('trader1', 'TSLA')
  assert.equal(orderBook.length, 2)

  assert.equal(orderBook[0].ticker, 'TSLA')
  assert.equal(orderBook[1].ticker, 'TSLA')

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

  assert.equal(response2.trade.ticker, 'TSLA')
  assert.equal(response2.trade.price, 9950)
  assert.equal(response2.trade.quantity, 100)
  assert.equal(response2.trade.buyOrder.trader.username, 'trader1')
  assert.equal(response2.trade.sellOrder.trader.username, 'trader2')
  
  market.clearAll('trader1', 'TSLA')
})
test3.run()

const test4 = suite('Acceptance test4')
test4('Two tradable orders with different quantities are partially filled Given an empty orderbook for "TSLA"',
  () => {
    let response1 = market.post('trader1', 'TSLA', 'Buy', 9950, 100)
    let response2 = market.post('trader2', 'TSLA', 'Sell', 9950, 300)
    let orderBook = market.getHistory('trader1', 'TSLA')

    assert.equal(orderBook.length, 2)

    assert.equal(orderBook[0].ticker, 'TSLA')
    assert.equal(orderBook[1].ticker, 'TSLA')

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

    assert.equal(response2.trade.ticker, 'TSLA')
    assert.equal(response2.trade.price, 9950)
    assert.equal(response2.trade.quantity, 100)
    assert.equal(response2.trade.buyOrder.trader.username, 'trader1')
    assert.equal(response2.trade.sellOrder.trader.username, 'trader2')
  
    market.clearAll('trader1', 'TSLA')
  }
)
test4.run()

const test5 = suite('Acceptance test5')
test5('A valid single order is able to sweep the book Given an empty orderbook for "TSLA"',
  () => {
    market.post('trader1', 'TSLA', 'Buy', 9950, 100)
    market.post('trader2', 'TSLA', 'Buy', 9945, 300)
    market.post('trader3', 'TSLA', 'Buy', 9935, 500)
    market.post('trader4', 'TSLA', 'Sell', 9930, 1000)

    let ob = market.getHistory('trader1', 'TSLA')
    assert.equal(ob.length, 4)

    console.log(`\n\r${ob[0].trader.username}\t${ob[0].status}\t${ob[0].createdAt}\t${ob[0].limit}\t${ob[0].quantity}\t${ob[0].filledQuantity}`)
    console.log(`${ob[1].trader.username}\t${ob[1].status}\t${ob[1].createdAt}\t${ob[0].limit}\t${ob[0].quantity}\t${ob[0].filledQuantity}`)
    console.log(`${ob[2].trader.username}\t${ob[2].status}\t${ob[2].createdAt}\t${ob[0].limit}\t${ob[0].quantity}\t${ob[0].filledQuantity}`)
    console.log(`${ob[3].trader.username}\t${ob[3].status}\t${ob[3].createdAt}\t${ob[0].limit}\t${ob[0].quantity}\t${ob[0].filledQuantity}`)

    assert.equal(ob[0].ticker, 'TSLA')
    assert.equal(ob[0].trader.username, 'trader1')
    assert.equal(ob[0].side, 'Buy')
    assert.equal(ob[0].limit, 9950)
    assert.equal(ob[0].quantity, 100)
    assert.equal(ob[0].filledQuantity, 100)
    assert.equal(ob[0].status, 'Completed')

    assert.equal(ob[1].ticker, 'TSLA')
    assert.equal(ob[1].trader.username, 'trader2')
    assert.equal(ob[1].side, 'Buy')
    assert.equal(ob[1].limit, 9945)
    assert.equal(ob[1].quantity, 300)
    assert.equal(ob[1].filledQuantity, 300)
    assert.equal(ob[1].status, 'Completed')

    assert.equal(ob[2].ticker, 'TSLA')
    assert.equal(ob[2].trader.username, 'trader3')
    assert.equal(ob[2].side, 'Buy')
    assert.equal(ob[2].limit, 9935)
    assert.equal(ob[2].quantity, 500)
    assert.equal(ob[2].filledQuantity, 500)
    assert.equal(ob[2].status, 'Completed')

    assert.equal(ob[3].ticker, 'TSLA')
    assert.equal(ob[3].trader.username, 'trader4')
    assert.equal(ob[3].side, 'Sell')
    assert.equal(ob[3].limit, 9930)
    assert.equal(ob[3].quantity, 1000)
    assert.equal(ob[3].filledQuantity, 900)
    assert.equal(ob[3].status, 'Open')
  
    market.clearAll('trader1', 'TSLA')
  }
)
test5.run()

