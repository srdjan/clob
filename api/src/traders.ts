import { Trader, Traders } from './model'
import { log } from './utils'

const traders: Traders = new Map<string, Trader>()

function getOrCreate (userName: string): Trader {
  if (traders.has(userName)) {
    return traders.get(userName) as Trader
  }

  log(`Traders.getOrCreate: auto registering ${userName}`)
  let trader: Trader = { username: userName, password: 'todo' }
  traders.set(trader.username, trader)
  return trader
}

function verify (userName: string): boolean {
  if (!traders.has(userName)) {
    throw new Error(
      `Traders.verify: invalid user: ${userName}, order not allowed`
    )
  }
  return true
}

export { getOrCreate, verify }
