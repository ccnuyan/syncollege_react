import React, { Component, PropTypes } from 'react'; //eslint-disable-line
import Relay from 'react-relay';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { orange500, blue500 } from 'material-ui/styles/colors';

import withWidth, { SMALL, MEDIUM, LARGE } from 'material-ui/utils/withWidth'; // eslint-disable-line

import m from '../Mutations';
import { setLocalToken } from '../../core/util';

const styles = {
  errorStyle: {
    color: orange500,
  },
  underlineStyle: {
    borderColor: orange500,
  },
  floatingLabelStyle: {
    color: orange500,
  },
  floatingLabelFocusStyle: {
    color: blue500,

  },
};

class Login extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  onSubmit = (event) => {
    event.preventDefault();
    const store = this.props.store;
    const loginInfo = this.props.store.loginInfo;

    Relay.Store.commitUpdate(new m.LocalLoginMutation({
      store,
      loginInfo,
      credential: {
        email: this.unInput.input.value,
        password: this.pwInput.input.value,
        mode: 'login',
      },
    }),
      {
        onFailure: () => {
        },
        onSuccess: (p) => {
          const info = p.localLogin.loginInfo;
          if (info.success) {
            setLocalToken(info.token);
          }
          Relay.Store.commitUpdate(new m.SetActiveChannelMutation({
            store: this.props.store,
            input: {},
          }));
        },
      },
    );
  }
  render() {
    const loginInfo = this.props.store.loginInfo;
    return (
      <div>
        <div>
          {loginInfo.message}
        </div>
        <div>
          <div>
            <TextField
              floatingLabelText="Email"
              label="E-mail"
              ref={ c => this.unInput = c }
              type="text"
              underlineStyle={ styles.underlineStyle }
            />
          </div>
          <div>
            <TextField
              floatingLabelText="Password"
              label="Password"
              ref={ c => this.pwInput = c }
              type="password"
              underlineStyle={ styles.underlineStyle }
            />
          </div>
        </div>
        <div>
          <RaisedButton
            label="OK"
            onTouchTap={ this.onSubmit }
            primary
          />
        </div>
      </div>
    );
  }
}

Login = Relay.createContainer(Login, { // eslint-disable-line
  fragments: {
    store: () => Relay.QL`
      fragment on Store{
        ${m.LocalLoginMutation.getFragment('store')}
        ${m.SetActiveChannelMutation.getFragment('store')}
        loginInfo{
          ${m.LocalLoginMutation.getFragment('loginInfo')}
          success
          message
          display_name
        }
      }
    `,
  },
});

export default Login;
