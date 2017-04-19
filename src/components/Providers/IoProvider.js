import { PropTypes } from 'prop-types';
import createProvider from 'react-provide-props';

import IOService from '../../core/IOService';

const io = new IOService('/');
export default createProvider('StylesProvider`', () => ({
  io,
}), {
  io: PropTypes.object.isRequired,
});
