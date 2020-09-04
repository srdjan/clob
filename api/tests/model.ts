import { uuid } from 'uuidv4'
import {Trader, Order, Trade } from '../src/model'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

const test = suite('test')

test('Trader', () => {
  const trader: Trader = {
    username: 'traderjoe',
    password: 'pswrd',
    balance: 44400009
  }

  const output = JSON.stringify(trader)

  assert.snapshot(output, `{"username":"traderjoe","password":"pswrd","balance":44400009}`)
  assert.equal(JSON.parse(output), trader, 'matches original')
})

test('Order', () => {
  const trader: Trader = {
    username: 'traderjoe',
    password: 'pswrd',
    balance: 44400009
  }
  const buyOrder: Order = {
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
  assert.equal(buyOrder.trader.password, 'pswrd')
})

test('Order', () => {
  const trader: Trader = {
    username: 'traderjoe',
    password: 'pswrd',
    balance: 44400009
  }
  const buyOrder: Order = {
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
  const trader: Trader = {
    username: 'tradersam',
    password: 'pswrd',
    balance: 1400022
  }
  const buyOrder: Order = {
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
  const sellOrder: Order = {
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

  const trade: Trade = {
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

test.run()
