const uWS = require('uWebSockets.js')
import { Market } from './index'
import { log } from './utils'

const market = new Market("stocks@clob")

uWS
  .App()
  .ws('/*', {
    message: (ws: any, request: ArrayBuffer, isBinary: boolean) => {
      const req = JSON.parse(Buffer.from(request).toString('utf8'))
      switch (req.msg) {
        case 'sub': {
          log(`Subscribe msg received: ${req.msg}`)
          ws.subscribe(`clob/#`) // Subscribe to all topics (tickers)
          break
        }
        case 'buy': {
          log(`Buy order for ${req.data.user} ${req.data.ticker}, limit: ${req.data.limit}`)
          market.post(
            req.data.user,
            req.data.ticker,
            req.data.side,
            req.data.limit,
            req.data.quantity
          )
          let marketState = market.getState(req.data.user, req.data.ticker)
          ws.publish(`clob/${req.ticker}`, JSON.stringify(marketState))
          break
        }
        case 'sell': {
          log(`Sell order for ${req.data.ticker}, limit: ${req.data.limit}`)
          market.post(
            req.data.user,
            req.data.ticker,
            req.data.side,
            req.data.limit,
            req.data.quantity
          )
          let marketState = market.getState(req.data.user, req.data.ticker)
          ws.publish(`clob/${req.ticker}`, JSON.stringify(marketState))
          break
        }
      }
    }
  })
  .listen(9001, (listenSocket: any) => {
    if (listenSocket) {
      log('Listening to port 9001')
    }
  })
