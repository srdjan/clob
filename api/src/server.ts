const uWS = require('uWebSockets.js')

import * as Market from './index'
import { Side, Ticker } from './model'
import { log } from './utils'

type Order = {
  msg: string
  ticker: Ticker
  side: Side
  limit: number
  quantity: number
}

uWS
  .App()
  .ws('/*', {
    message: (ws: any, message: ArrayBuffer, isBinary: boolean) => {
      const order = JSON.parse(Buffer.from(message).toString('utf8'))
      log(`message received: ${order.msg}`)

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
