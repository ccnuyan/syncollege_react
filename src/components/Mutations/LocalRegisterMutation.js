import Relay from 'react-relay';

export default class extends Relay.Mutation {

  static fragments = {
    store: () => Relay.QL`
      fragment on Store {
        id
      }
    `,
    registerInfo: () => Relay.QL`
      fragment on RegisterInfo {
        id
      }
    `,
  };

  getMutation = () => {
    return Relay.QL`mutation { localRegister }`;
  }

  getFatQuery = () => {
    return Relay.QL`
      fragment on LocalRegisterPayload {
        store        
        registerInfo {
          id
          success
          message
          new_id
          validation_token
          authentication_token
        }
      }
    `;
  }

  getConfigs = () => {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        store: this.props.store.id,
        registerInfo: this.props.registerInfo.id,
      },
    }];
  }
  getVariables = () => {
    return {
      email: this.props.credential.email,
      password: this.props.credential.password,
    };
  }

  getOptimisticResponse = () => {
    const store = {
      authStore: {
        registerInfo: {
          success: false,
          message: 'Registering',
        },
      },
    };
    return store;
  }
}
