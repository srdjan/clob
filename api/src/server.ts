const uWS = require('uWebSockets.js')
import * as Market from './index'
import { log } from './utils'

//spec: in-message format def:
//----------------------------
// type OrderReq = {
//   msg: string
//   ticker: Ticker
//   side: Side
//   limit: number
//   quantity: number
// }
//
// out-message format def:
//----------------------------
// type OrderResp = {
//   result: string
//   orderbook: {
//     bids: Array<{limit: number, quantity: number}>
//     asks: Array<{limit: number, quantity: number}>
//   }
// }

uWS
  .App()
  .ws('/*', {
    message: (ws: any, message: ArrayBuffer, isBinary: boolean) => {
      const order = JSON.parse(Buffer.from(message).toString('utf8'))
      switch (order.msg) {
        case 'sub': {
          log(`Subscribe msg received: ${order.msg}`)
          ws.subscribe(`clob/#`) // Subscribe to all topics (tickers)
          break
        }
        case 'buy': {
          log(
            `Buy order for ${order.ticker}, limit: ${order.limit}, quntity: ${order.quantity}`
          )

          let result = Market.bid('elen', 'TW', 'Buy', 1100, 10)
          
          ws.publish(`clob/${order.ticker}`, result)
          break
        }
        case 'sell': {
          log(
            `Sell order for ${order.ticker}, limit: ${order.limit}, quntity: ${order.quantity}`
          )

          let result = Market.bid('elen', 'TW', 'Sell', 1201, 20)
          ws.publish(`clob/${order.ticker}`, result)
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
