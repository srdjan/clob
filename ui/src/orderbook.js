import React, { useState, useEffect } from 'react'
import { TradeForm } from './tradeform'

/*  spec: in-message format def:
  ----------------------------
  type OrderReq = {
    msg: string
    ticker: Ticker
    side: Side
    limit: number
    quantity: number
  }
  
  out-message format def:
  ----------------------------
  type OrderResp = {
    result: string 
    orderbook: {
      bids: Array<{limit: number, quantity: number}>
      asks: Array<{limit: number, quantity: number}>
    }
  }
*/

const OrderBook = () => {
  const [orderBook, setOrderBook] = useState({orders: [[100, 102],[99, 103],[98, 104]]})
  console.log(`orderBook: ${JSON.stringify(orderBook)}`)

  const ticker = 'TW'

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9001')
    ws.onopen = () => {
      ws.send(JSON.stringify({msg: 'sub'}))
    }
    ws.onmessage = event => {
      const response = JSON.parse(event.data)
       setOrderBook(response.data)
    }
    ws.onclose = () => ws.close()

    return () => ws.close()
  }, [ticker])

  const { orders } = orderBook
 
  const head = title => (
    <thead>
      <tr>
        <th className={title} colSpan='2'>{title}</th>
      </tr>
    </thead>
  )

  const rows = arr => arr && arr.map((item, index) => (
      <tr key={index}>
        <td> {item[1]} </td>
        <td> {item[0]} </td>
      </tr>
    )
  )

  return ( 
    <div className='container'>
      <table className='item'>
        {head('Buy ..................................................... Sell')}
        <tbody>{rows(orders)}</tbody>
      </table>
    </div>
  )
}

export default OrderBook
