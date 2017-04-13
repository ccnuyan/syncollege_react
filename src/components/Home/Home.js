import React, { Component, PropTypes } from 'react'; //eslint-disable-line
import Login from './Login';

import Relay from 'react-relay';

import Slogan from './Slogan';
import Teams from './Teams';

class Home extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  render() {
    const {store} = this.props;
    return (
      <Slogan>
          {this.props.store.loginInfo.success ?
           <Teams store={store}/> : <Login store={this.props.store}/>}
      </Slogan>);
  }
}

Home = Relay.createContainer(Home, { // eslint-disable-line
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        ${Teams.getFragment('store')}
        ${Login.getFragment('store')}
        loginInfo{
          success
        }
      }
    `,
  },
});

export default Home;
