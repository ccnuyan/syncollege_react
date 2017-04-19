import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

/* eslint-disable import/first*/

import 'babel-polyfill';
import RelayBox from './components/App/RelayBox';
import relayConfig from './core/relayConfig';
import './style.scss';

/* eslint-disable import/first*/

relayConfig.refresh();
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941

ReactDOM.render(<RelayBox/>, document.getElementById('react'));
