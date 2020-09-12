const uWS = require('uWebSockets.js')
const { StringDecoder } = require('string_decoder')
const decoder = new StringDecoder('utf8')
import * as Market from './index'

uWS.App().ws('/*', {
    message: (ws: any, message: string, isBinary: boolean) => {
      let bid = JSON.parse(decoder.write(Buffer.from(message)))
      switch (bid.side) {
        case 'sub': {  // Subscribe to the ticker's value stream 
          ws.subscribe(`clob/${bid.ticker}`)
          break
        }
        case 'buy': {
          console.log(`Buy order for ${bid.ticker}, limit: ${bid.limit}, quntity: ${bid.quantity}`)          
          let result = Market.bid('elen', 'TW', 'Buy', 1100, 10)
          ws.publish(`clob/${bid.ticker}`, result)
          break
        }
        case 'sell': {
          console.log(`Sell order for ${bid.ticker}, limit: ${bid.limit}, quntity: ${bid.quantity}`)
          let result = Market.bid('elen', 'TW', 'Sell', 1201, 20)
          ws.publish(`clob/${bid.ticker}`, result)
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
