const uWS = require('uWebSockets.js')
import * as Market from './index'
import { log } from './utils'

/*  spec: in-message format def:
  ----------------------------
  type Request = {
    msg: string
    data: {
      ticker: Ticker
      side: Side
      limit: number
      quantity: number
    }
  }
  
  out-message format def:
  ----------------------------
  type Response = {
    data: Array<{limit: number, quantity: number}>
  }
*/


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
          let result = Market.bid(
            req.data.user,
            req.data.ticker,
            req.data.side,
            req.data.limit,
            req.data.quantity
          )
          ws.publish(`clob/${req.ticker}`, result)
          break
        }
        case 'sell': {
          log(`Buy order for ${req.data.ticker}, limit: ${req.data.limit}`)
          let result = Market.bid(
            req.data.user,
            req.data.ticker,
            req.data.side,
            req.data.limit,
            req.data.quantity
          )
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
