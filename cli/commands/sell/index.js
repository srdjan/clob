import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'ink'

const Sell = ({ name, quantity, ticker }) => (
	<Text>
		'SELL' order placed, for {name}. {quantity} {ticker}
	</Text>
)

Sell.propTypes = {
	name: PropTypes.string.isRequired,
	ticker: PropTypes.string.isRequired,
	quantity: PropTypes.number.isRequired
}

export default Sell
