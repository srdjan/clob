import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { OrderBooks } from '../../src/orderbooks'

const test = suite('Test OrderBooks')

test('getOrCreate', () => {
  let orderBooks = new OrderBooks()
  let orderBook = orderBooks.getOrCreate('TW')

  assert.equal(orderBook.ticker, 'TW')
})

test('get, success', () => {
  let orderBooks = new OrderBooks()
  orderBooks.getOrCreate('TW')
  let orderBook = orderBooks.get('TW')

  assert.equal(orderBook && orderBook.ticker, 'TW')
})

test('get, fail', () => {
  let orderBooks = new OrderBooks()
  orderBooks.getOrCreate('TW')
  let orderBook = orderBooks.get('NET')

  assert.equal(orderBook, undefined)
})

test.run()
