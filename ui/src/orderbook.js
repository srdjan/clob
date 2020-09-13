import React from 'react'

const OrderBook = ({ buys, sells }) => {
  const rows = arr =>
    arr &&
    arr.map((item, index) => (
      <tr key={index}>
        <td> ${item} </td>
      </tr>
    ))

  return (
    <table width='100%'>
      <tr>
        <td valign='top'>
          <table>
            <thead className='Buy'>
              <tr>
                <th>Buy</th>
              </tr>
            </thead>
            <tbody>{rows(buys)}</tbody>
          </table>
        </td>
        <td valign='top'>
          <table>
            <thead className='Buy'>
              <tr>
                <th>Sell</th>
              </tr>
            </thead>
            <tbody>{rows(sells)}</tbody>
          </table>
        </td>
      </tr>
    </table>
  )
}

export default OrderBook
