import { IOrderId, Ticker, Side } from './model'

class OrderId {
  static idSequence = 0
  
  static next (ticker: Ticker, side: Side): string {
    let uid = OrderId.idSequence++
    return `${ticker}.${side}.${uid}`
  }

  static fromString (id: string): IOrderId {
    let idFields = id.split('.')
    try {
      return {
        ticker: idFields[0] as Ticker,
        side: idFields[1] as Side,
        id: idFields[2] as string
      }
    } catch (e) {
      throw new Error(`Order: Invalid id string format ${id}`)
    }
  }

  static asString (orderId: IOrderId): string {
    return `${orderId.ticker}.${orderId.side}.${orderId.id}`
  }
}

export default OrderId
