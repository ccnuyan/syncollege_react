import React, { Component, PropTypes } from 'react'; //eslint-disable-line
import ioclient from 'socket.io-client';
import Relay from 'react-relay';
import useRelay from 'react-router-relay';
import { browserHistory, Router, Route, applyRouterMiddleware, IndexRoute } from 'react-router';

import App from './App';
import Home from '../Home/Home';
import TeamPage from '../Team/TeamPage';
import Register from '../Home/Register';
import Help from '../Common/Help';

class AppContainerComponent extends Component {
  componentWillMount = () => {
    window.socket = ioclient('/');
  }

  render = () => {
    const storeQueries = {
      store: () => Relay.QL`query {    
        store
      }`,
    };
    return (
      <Router
        environment={ Relay.Store }
        history={ browserHistory }
        render={ applyRouterMiddleware(useRelay) }
      >
        <Route
          component={ App }
          path="/"
          queries={ storeQueries }
        >
          <IndexRoute
            component={ Home }
            queries={ storeQueries }
          />
          <Route
            component={ Home }
            path="home"
            queries={ storeQueries }
          />
          <Route
            component={ Register }
            path="register"
            queries={ storeQueries }
          />
          <Route
            component={ Help }
            path="help"
          />
          <Route
            component={ TeamPage }
            name="team_channel"
            path="/team_channel"
            queries={ storeQueries }
          />
          <Route
            component={ Home }
            path="*"
            queries={ storeQueries }
          />
        </Route>
      </Router>);
  }

  /* render() {
    return (
      <Router
        history={browserHistory}
        render={applyRouterMiddleware(useRelay)}
        environment={Relay.Store}>
        <Route path="/" component={App} queries={storeQueries}>
          <Route path="help" component={ Help } />
        </Route>
      </Router>
    );
  } */
}

const AppContainer = Relay.createContainer(AppContainerComponent, {
  initialVariables: {
    channel_id: '0',
  },
  fragments: {
    store: () => Relay
      .QL`
      fragment on Store {
        ${App.getFragment('store')}
        ${Home.getFragment('store')}
        ${Register.getFragment('store')}
        ${TeamPage.getFragment('store')}
      }`,
  },
  // fragments: {
  //   store: () => Relay
  //     .QL `
  //     fragment on Store {
  //       ${App.getFragment('store')}
  //     }`
  // }
});

export default AppContainer;
