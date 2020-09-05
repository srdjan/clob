import { Side } from './model'
import { log } from './utils'

type Trader = {
  username: string
  password?: string
}

const traders = new Map<string, Trader>()

function get (userName: string, side: Side): Trader {
  if (traders.has(userName)) {
    return traders.get(userName) as Trader
  }

  if (side !== 'Buy') {
    throw new Error(
      `Traders: invalid request to cancel sell order for non-existing account`
    )
  }

  log(`Traders: trader's first bid, auto registering ${userName}`)
  let trader: Trader = { username: userName, password: 'todo' }
  traders.set(trader.username, trader)
  return trader
}

function verify (userName: string): boolean {
  if (!traders.has(userName)) {
    throw new Error(
      `Traders: invalid user: ${userName}, cancel order not allowed`
    )
  }
  return true
}

export { Trader, get, verify }
