import { uuid as id } from 'uuidv4'
type Money = number //todo: in cents, but will require higher precision

type Result<T> = {
  outcome: boolean
  message: string
  data?: T
}

type Uuid = string

export { Money, Result, Uuid, id } 