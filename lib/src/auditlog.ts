import { IOrder } from './model'

class AuditLog {
  static store = new Map<number, IOrder>()
  static sequenceId: number = 0

  static push (order: IOrder): void {
    AuditLog.store.set(AuditLog.sequenceId++, order)
  }
}

export { AuditLog }
