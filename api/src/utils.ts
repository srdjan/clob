import { uuid } from "uuidv4"
import { Ticker } from "./model"

type Money = number //todo: in cents, but will require higher precision
const Decimals = 2 //todo: in cents, but will require higher precision

type Result<T> = {
  outcome: boolean
  message: string
  data?: T
}

type Uuid = string

export { Money, Decimals, Result, Uuid } 