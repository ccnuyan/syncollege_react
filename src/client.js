import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import 'babel-polyfill';

import RelayBox from './components/App/RelayBox';
import './client.scss';
import relayConfig from './core/relayConfig';

relayConfig.refresh();

injectTapEventPlugin();
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941

const rootNode = document.getElementById('react');

const render = () => {
  ReactDOM.render(<RelayBox/>, rootNode);
};

render();
