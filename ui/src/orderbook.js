import React from 'react'

const OrderBook = ({orders}) => {
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
