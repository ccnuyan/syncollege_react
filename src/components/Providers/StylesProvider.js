import { PropTypes } from 'react';
import createProvider from 'react-provide-props';

import styles from '../styles/';

export default createProvider('StylesProvider`', () => ({
  ...styles,
}), {
  styles: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
});
