import { IOrder } from './model'

class OrderHistory {
  static store = new Map<number, IOrder>()
  static sequenceId = 0

  static push (order: IOrder): void {
    this.store.set(this.sequenceId++, order)
  }
}

export default OrderHistory
