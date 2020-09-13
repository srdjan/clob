const uWS = require('uWebSockets.js')
import * as Market from './index'
import { log } from './utils'

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
          log(`Buy order for ${req.data.ticker}, limit: ${req.data.limit}`)
          let result = Market.post(
            req.data.user,
            req.data.ticker,
            req.data.side,
            req.data.limit,
            req.data.quantity
          )
          //todo: need better error handling
          //todo: get only Buy side (perf)
          result = Market.getTicker(req.data.ticker)
          ws.publish(`clob/${req.ticker}`, result)
          break
        }
        case 'sell': {
          log(`Buy order for ${req.data.ticker}, limit: ${req.data.limit}`)
          let result = Market.post(
            req.data.user,
            req.data.ticker,
            req.data.side,
            req.data.limit,
            req.data.quantity
          )
          //todo: need better error handling
          //todo: get only SELL side (perf)
          result = Market.getTicker(req.data.ticker)
          ws.publish(`clob/${req.ticker}`, result)
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
