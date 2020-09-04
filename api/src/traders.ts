import {Money} from './utils'

type Trader = {
  username: string
  balance: Money
}

type Traders = Map<string, Trader>

export {Trader, Traders}
