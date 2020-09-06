import { Trader } from './model'
import { log } from './utils'

const traders = new Map<string, Trader>()

function getOrCreate (userName: string): Trader {
  if (traders.has(userName)) {
    return traders.get(userName) as Trader
  }

  log(`Traders: trader's first bid, auto registering ${userName}`)
  let trader: Trader = { username: userName, password: 'todo' }
  traders.set(trader.username, trader)
  return trader
}

function verify (userName: string): boolean {
  if (!traders.has(userName)) {
    throw new Error(
      `Traders: invalid user: ${userName}, order not allowed`
    )
  }
  return true
}

export { getOrCreate, verify }
