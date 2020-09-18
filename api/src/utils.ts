type Money = number //todo: in cents, but will require higher precision
type Quantity = number
type Timestamp = number

const log = console.log //todo: replace with real logger after v0.1

class SeqGen {
  static sequence: number = 0

  static next (): number {
    return SeqGen.sequence++
  }
}

export { Money, Quantity, Timestamp, log, SeqGen } 