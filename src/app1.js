import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

/* eslint-disable import/first*/
import 'babel-polyfill';
/* eslint-disable import/first*/

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941

ReactDOM.render(<div>App1 Page</div>, document.getElementById('react'));
