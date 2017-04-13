import Relay from 'react-relay';

export default class extends Relay.Mutation {
  static fragments = {
    store: () => Relay.QL`
      fragment on Store {
        id
      }
    `,
    loginInfo: () => Relay.QL`
      fragment on LoginInfo {
        id
        user_id
        email 
        display_name 
        success 
        message 
        token 
      }
    `,
  };

  getMutation = () => {
    return Relay.QL`mutation { localLogin }`;
  }

  getFatQuery = () => {
    return Relay.QL`
      fragment on LocalLoginPayload {
        store
        loginInfo {
          id
          user_id
          email 
          display_name 
          success 
          message 
          token 
        }
      }
    `;
  }

  getConfigs = () => {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        store: this.props.store.id,
        loginInfo: this.props.loginInfo.id,
      },
    }];
  }
  getVariables = () => {
    return {
      email: this.props.credential.email,
      password: this.props.credential.password,
      mode: this.props.credential.mode,
    };
  }

  getOptimisticResponse = () => {
    const ret = {
      loginInfo: {
        success: false,
        display_name: 'Logining',
      },
    };
    return ret;
  }
}

