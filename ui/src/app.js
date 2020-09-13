import React, { useState, useEffect, useRef } from 'react'
import OrderBook from './orderbook'
import { TradeForm } from './tradeform'

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

const App = () => {
  const ws = useRef(null)
  const [orderBook, setOrderBook] = useState({ orders: [[98, 104], [92, 200]] })
  console.log(`orderBook: ${JSON.stringify(orderBook)}`)

  function onSubmit (data) {
    console.log(`data: ${JSON.stringify(data)}`)
    ws.current.send(JSON.stringify({ msg: 'buy', data: data }))
  }

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:9001')

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ msg: 'sub' }))
    }
    ws.current.onmessage = event => {
      const response = JSON.parse(event.data)
      setOrderBook(response.data)
    }
    ws.current.onclose = () => ws.close()

    return () => ws.current.close()
  }, [])

  const { orders } = orderBook

  return (
    <div className='wrapper'>
      <header className='header'>
        <ul className='navigation'>
          <li>
            <a href='#'>Home</a>
          </li>
          <li>
            <a href='#'>About</a>
          </li>
          <li>
            <a href='#'>Products</a>
          </li>
          <li>
            <a href='#'>Contact</a>
          </li>
        </ul>
      </header>
      <article className='main'>
        <OrderBook orders={orders}/>
      </article>
      <aside className='aside aside-1'>
        <TradeForm onSubmit={onSubmit}/>
      </aside>
      <footer className='footer'>CLOB©</footer>
    </div>
  )
}

export default App
