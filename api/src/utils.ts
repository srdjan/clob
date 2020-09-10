type Money = number //todo: in cents, but will require higher precision
type Quantity = number
type Timestamp = number // milliseconds

type Result<T> = {
  outcome: boolean
  message?: string
  data?: T
}

const log = console.log //todo: replace with real logger after v0.1

//todo: extract
class SeqGen {
  static sequence: number = 0

  static next (): number {
    return SeqGen.sequence++
  }
}
class TradeId {
  static sequence: number = 0

  static next (): number {
    return SeqGen.sequence++
  }
}


export { Money, Quantity, Timestamp, Result, log, SeqGen, TradeId } 