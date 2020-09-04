type Trader = {
  username: string
  password?: string
}

const traders = new Map<string, Trader>()

const getTrader = (userName: string): Trader => {
  if (traders.has(userName)) {
    console.log('Trader not registered')
    return traders.get(userName) as Trader
  } 
  
  let trader: Trader = { username: userName, password: 'todo' }
  traders.set(trader.username, trader)
  return trader
}

export {Trader, getTrader}
