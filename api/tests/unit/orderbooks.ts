import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { OrderBooks } from '../../src/orderbooks'

const test = suite('Test OrderBooks')

test('getOrCreate', () => {
  let orderBooks = new OrderBooks()
  let orderBook = orderBooks.getOrCreate('TSLA')

  assert.equal(orderBook.ticker, 'TSLA')
})

test('get, success', () => {
  let orderBooks = new OrderBooks()
  orderBooks.getOrCreate('TSLA')
  let orderBook = orderBooks.get('TSLA')

  assert.equal(orderBook && orderBook.ticker, 'TSLA')
})

test('get, fail', () => {
  let orderBooks = new OrderBooks()
  orderBooks.getOrCreate('TSLA')
  let orderBook = orderBooks.get('NET')

  assert.equal(orderBook, undefined)
})

test.run()
