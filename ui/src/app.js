import React from 'react'
import OrderBook from './orderbook'
import { TradeForm } from './tradeform'

const App = () => {
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
        <OrderBook />
      </article>
      <aside className='aside aside-1'>
        <TradeForm />
      </aside>
      <footer className='footer'>CLOB©</footer>
    </div>
  )
}

export default App
