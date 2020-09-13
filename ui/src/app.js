import React from 'react'
import OrderBook from './orderbook'
import {TradeForm} from './tradeform'

const App = () => {
  return (
    <div className='container'>
      <div className='item form'>
       <TradeForm/>
      </div>
      <div className='item'>
        <OrderBook />
      </div>
    </div>
  )
}

export default App
