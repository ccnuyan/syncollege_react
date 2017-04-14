import React, { Component, PropTypes } from 'react'; //eslint-disable-line
import Relay from 'react-relay';
import validator from 'validator';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { orange500, blue500 } from 'material-ui/styles/colors';

import Paper from 'material-ui/Paper';

import m from '../Mutations';

const styles = {
  paper: {
    padding: '3em',
    alignSelf: 'center',
  },
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


class Register extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  onSubmit = (event) => {
    event.preventDefault();

    if (!this.validateRegisterInfo()) {
      return;
    }

    const store = this.props.store;
    const registerInfo = this.props.store.registerInfo;
    Relay.Store.commitUpdate(new m.LocalRegisterMutation({
      store,
      registerInfo,
      credential: {
        email: this.unInput.input.value,
        password: this.pw1Input.input.value,
      },
    }));
  }

  validateRegisterInfo = () => validator.isEmail(this.unInput.input.value);

  render() {
    const registerInfo = this.props.store.registerInfo;
    return (
      <Paper
        style={ styles.paper }
        zDepth={ 2 }
      >
        <div>
          <h1>Register</h1>
          <div style={ styles.errorStyle }>
            {registerInfo.message}
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
                ref={ c => this.pw1Input = c }
                type="password"
                underlineStyle={ styles.underlineStyle }
              />
            </div>
            <div>
              <TextField
                floatingLabelText="Password Again"
                label="Password"
                ref={ c => this.pw2Input = c }
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
      </Paper>);
  }
}

Register = Relay.createContainer(Register, { // eslint-disable-line
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        ${m.LocalLoginMutation.getFragment('store')}
        ${m.LocalRegisterMutation.getFragment('store')}
        loginInfo{
          ${m.LocalLoginMutation.getFragment('loginInfo')}
          success
        }
        registerInfo{
          ${m.LocalRegisterMutation.getFragment('registerInfo')}
          new_id
          validation_token
          authentication_token
          success
          message
        }
      }
    `,
  },
});

export default Register;
