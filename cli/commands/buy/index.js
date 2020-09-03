import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'ink'

const Buy = ({ name, quantity, ticker }) => (
	<Text>
		'BUY' order placed, for {name}. {quantity} {ticker}
	</Text>
)

Buy.propTypes = {
	name: PropTypes.string.isRequired,
	ticker: PropTypes.string.isRequired,
	quantity: PropTypes.number.isRequired
}

export default Buy
