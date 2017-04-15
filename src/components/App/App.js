import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import { withRouter } from 'react-router';

import withWidth, { SMALL, MEDIUM, LARGE } from 'material-ui/utils/withWidth'; //eslint-disable-line

import Header from '../Common/Header';
import StylesProvider from '../Providers/StylesProvider';

class App extends Component {
  static propTypes = {
    styles: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
  }

  getStyles = () => {
    const { styles } = this.props;
    return {
      app: {
        width: '100%',
        height: '100%',
        ...styles.flexColumn,
        ...styles.flexBetweenStretch,
      },
      header: {
        flex: '0 0',
      },
      content: {
        ...styles.flexColumn,
        ...styles.deadCenter,
        flexBasis: '100%',
      },
    };
  }

  render() {
    const styles = this.getStyles();
    return (
      <div style={ styles.app }>
        <Header
              store={ this.props.store }
              style={ styles.header }
        />
        <div style={ styles.content }>
          {this.props.children}
        </div>
      </div>);
  }
}

App = Relay.createContainer(StylesProvider(withRouter(withWidth()(App))), { //eslint-disable-line
  fragments: {
    store: () => Relay.QL`
      fragment on Store{
        ${Header.getFragment('store')}
      }
    `,
  },
});

export default App;
