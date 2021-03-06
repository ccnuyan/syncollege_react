import { PropTypes } from 'prop-types';
import createProvider from 'react-provide-props';

import styles from '../../core/styles';

export default createProvider('StylesProvider`', () => ({
  ...styles,
}), {
  styles: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
});
