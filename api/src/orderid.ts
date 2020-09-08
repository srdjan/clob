import { OrderId, Ticker, Side } from './model'
import { seqGenerator } from './utils'

function create (ticker: Ticker, side: Side): OrderId {
  return {
    ticker,
    side,
    sequence: seqGenerator()
  }
}

function createAsString (ticker: Ticker, side: Side): string {
  let orderId: OrderId = create(ticker, side)
  return toString(orderId)
}

function fromString (id: string): OrderId {
  let idFields = id.split('.')
  let orderId: OrderId
  try {
    orderId = {
      ticker: idFields[0] as Ticker,
      side: idFields[1] as Side,
      sequence: parseInt(idFields[2]) as number
    }
  } catch (e) {
    throw new Error(`OrderId: Invalid id string format ${id}`)
  }
  return orderId
}

function toString (orderId: OrderId) {
  return `${orderId.ticker}.${orderId.side}.${orderId.sequence}`
}

export { createAsString, fromString, toString }
