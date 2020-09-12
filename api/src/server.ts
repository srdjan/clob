const uWS = require('uWebSockets.js')
const { StringDecoder } = require('string_decoder')
const decoder = new StringDecoder('utf8')
import * as Market from './index'
import { Side, Ticker } from './model'

type Order = {
  msg: string,
  ticker: Ticker,
  side: Side,
  limit: number,
  quantity: number
}

uWS.App().ws('/*', {
    message: (ws: any, message: string, isBinary: boolean) => {
      let order: Order = JSON.parse(decoder.write(Buffer.from(message)))
      switch (order.msg) {
        case 'sub': {  // Subscribe to the ticker's value stream 
          ws.subscribe(`clob/#`)
          break
        }
        case 'buy': {
          console.log(`Buy order for ${order.ticker}, limit: ${order.limit}, quntity: ${order.quantity}`)          
          let result = Market.bid('elen', 'TW', 'Buy', 1100, 10)
          ws.publish(`clob/${order.ticker}`, result)
          break
        }
        case 'sell': {
          console.log(`Sell order for ${order.ticker}, limit: ${order.limit}, quntity: ${order.quantity}`)
          let result = Market.bid('elen', 'TW', 'Sell', 1201, 20)
          ws.publish(`clob/${order.ticker}`, result)
          break
        }
      }
    }
  })
  .listen(9001, (listenSocket: any) => {
    if (listenSocket) {
      console.log('Listening to port 9001')
    }
  })
