type Money = number //todo: in cents, but will require higher precision
type Quantity = number
type Datetime = number // milliseconds

type Result<T> = {
  outcome: boolean
  message?: string
  data?: T
}

const log = console.log //todo: replace with real logger after v0.1

// keep it simple 
let currentID: number = 0
const seqGenerator = () => currentID++

export { Money, Quantity, Datetime, Result, log, seqGenerator } 