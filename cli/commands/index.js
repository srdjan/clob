import React from 'react';
import PropTypes from 'prop-types';
import {Text} from 'ink';

const Hello = ({name}) => <Text>Hello, {name}</Text>;

Hello.propTypes = {
	name: PropTypes.string.isRequired
};

export default Hello;
