import { uuid } from 'uuidv4'
import { Order } from '../src/model'
import { Trader } from '../src/traders'
import * as Clob from '../src/orderbook'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

const test = suite('test')

test('Trader', () => {
  const trader = {
    username: 'traderjoe',
    balance: 44400009
  }

  const output = JSON.stringify(trader)

  assert.snapshot(output, `{"username":"traderjoe","balance":44400009}`)
  assert.equal(JSON.parse(output), trader, 'matches original')
})

test('Order', () => {
  const trader = {
    username: 'traderjoe',
    balance: 44400009
  }
  const buyOrder = {
    id: uuid(),
    trader: trader,
    ticker: 'TW',
    side: 'Buy',
    limit: 10000,
    quantity: 20,
    filledQuantity: 0,
    status: 'Open',
    createdAt: new Date().getTime()
  }

  assert.not.equal(buyOrder.ticker, 'ATT')
  assert.equal(buyOrder.trader.username, 'traderjoe')
})

test('Order', () => {
  const trader = {
    username: 'traderjoe',
    balance: 44400009
  }
  const buyOrder = {
    id: uuid(),
    trader: trader,
    ticker: 'TW',
    side: 'Buy',
    limit: 10000,
    quantity: 20,
    filledQuantity: 20,
    status: 'Completed',
    createdAt: new Date().getTime()
  }
  assert.equal(buyOrder.status, 'Completed')
  assert.equal(buyOrder.ticker, 'TW')
  assert.equal(buyOrder.quantity, buyOrder.filledQuantity)
})

test('Trade', () => {
  const trader = {
    username: 'tradersam',
    balance: 1400022
  }
  const buyOrder = {
    id: uuid(),
    trader: trader,
    ticker: 'TW',
    side: 'Buy',
    limit: 10000,
    quantity: 20,
    filledQuantity: 20,
    status: 'Completed',
    createdAt: new Date().getTime()
  }
  const sellOrder = {
    id: uuid(),
    trader: trader,
    ticker: 'TW',
    side: 'Sell',
    limit: 9900,
    quantity: 120,
    filledQuantity: 20,
    status: 'Open',
    createdAt: new Date().getTime()
  }

  const trade = {
    ticker: buyOrder.ticker,
    price: buyOrder.limit,
    quantity: 20,
    buyOrder: buyOrder,
    sellOrder: sellOrder,
    createdAt: new Date().getTime()
  }

  assert.equal(trade.buyOrder.status, 'Completed')
  assert.equal(trade.sellOrder.status, 'Open')
  assert.equal(trade.ticker, 'TW')
  assert.equal(trade.quantity, buyOrder.filledQuantity)
})

test('Add Order', () => {
  let order = Clob.add('traderjoe', 'Buy', 'TW', 1999, 100)
  assert.equal(order.trader?.username, 'traderjoe')
  assert.equal(order.quantity, 100)
})

test.run()
