type Money = number //todo: in cents, but will require higher precision
type Quantity = number
type Timestamp = number // milliseconds

type Result<T> = {
  outcome: boolean
  message?: string
  data?: T
}

const log = console.log //todo: replace with real logger after v0.1


export { Money, Quantity, Timestamp, Result, log } 