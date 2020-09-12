import React, { useState, useEffect } from 'react'

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

const OrderBook = () => {
  const [orders, setOrders] = useState([])
  const ticker = 'TW'

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:9001')
    ws.onopen = () => {
      ws.send(JSON.stringify({msg: 'sub'}))
    }
    ws.onmessage = event => {
      const response = JSON.parse(event.data)
      setOrders(response.data)
    }
    ws.onclose = () => ws.close()

    return () => ws.close()
  }, [ticker])

  const { bids, asks } = orders
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
    <div className='order-container'>
      <table>
        {head('Bids')}
        <tbody>{rows(bids)}</tbody>
      </table>

      <table>
        {head('Asks')}
        <tbody>{rows(asks)}</tbody>
      </table>
    </div>
  )
}

export default OrderBook
