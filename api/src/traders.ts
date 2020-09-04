import {Money} from './utils'

type Trader = {
  username: string
  balance: Money
}

const traders = new Map<string, Trader>()

const getTrader = (userName: string): Trader => {
  if (traders.has(userName)) {
    console.log('Trader not registered')
    return traders.get(userName) as Trader
  } 
  
  let trader: Trader = { username: userName, balance: 0 }
  traders.set(trader.username, trader)
  return trader
}

export {Trader, getTrader}
