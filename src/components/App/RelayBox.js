import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';

import withStyles from '../Providers/StylesProvider';
import AppContainer from './AppContainer';

class RootRoute extends Relay.Route {
  static routeName = 'root route';
  static queries = {
    store: () => Relay.QL`query { store }`,
  }
}

class RelayBox extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
  }

  renderLoading = () => (<h1>Loading</h1>);

  renderError = (error, retry) => {
    return (
      <Paper zDepth={ 1 }>
        <div>
          {error.message}
          <button onTouchTap={ retry }>
            Retry?
              </button>
        </div>
      </Paper>
    );
  };


  render = () => {
    return (
      <MuiThemeProvider muiTheme={ this.props.theme }>
        <Relay.RootContainer
        Component={ AppContainer }
        renderError={ this.renderError }
        renderLoading={ this.renderLoading }
        route={ new RootRoute() }
        />
      </MuiThemeProvider>);
  }
}

export default withStyles(RelayBox);
