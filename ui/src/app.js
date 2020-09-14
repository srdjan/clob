import React, { useState, useEffect, useRef } from 'react'
import OrderBook from './orderbook'
import { TradeForm } from './tradeform'

const App = () => {
  const ws = useRef(null)
  const [orderBook, setOrderBook] = useState({ buys: [], sells: [] })
  console.log(`orderBook: ${JSON.stringify(orderBook)}`)

  function onSubmit (data) {
    console.log(`Form data: ${JSON.stringify(data)}`)
    ws.current.send(JSON.stringify({ msg: 'buy', data: data }))
  }

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:9001')

    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ msg: 'sub' }))
    }
    ws.current.onmessage = event => {
      const response = JSON.parse(event.data)
      setOrderBook({
        buys: response.buys,
        sells: response.sells
      })
    }
    ws.current.onclose = () => ws.current.close()

    return () => ws.current.close()
  }, [])

  const { buys, sells } = orderBook

  return (
    <div className='wrapper'>
      <ul className='navigation'>C.L.O.B.</ul>
      <article className='main'>
        <OrderBook buys={buys} sells={sells} />
      </article>
      <aside className='aside aside-1'>
        <TradeForm onSubmit={onSubmit} />
      </aside>
    </div>
  )
}

export default App
