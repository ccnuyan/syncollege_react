import Relay from 'react-relay';

export default class extends Relay.Mutation {
  static fragments = {
    store: () => Relay.QL`
      fragment on Store {
        id
      }
    `,
  };

  getMutation = () => {
    return Relay.QL`mutation { createChannel }`;
  }

  getFatQuery = () => {
    return Relay.QL`
      fragment on CreateChannelPayload {
        channelEdge
        store
      }
    `;
  }
  getConfigs = () => {
    return [{
      type: 'RANGE_ADD',
      parentName: 'activeTeam',
      parentID: this.props.activeTeam.id,
      connectionName: 'teamChannels',
      edgeName: 'channelEdge',
      rangeBehaviors: {
        '': 'prepend',
      },
    }];
  }
  getVariables = () => {
    return this.props.input;
  }

  getOptimisticResponse = () => {
    return {
      channelEdge: {
        node: {
          title: `${this.props.input.title} creating ...`,
          owner_email: '',
        },
      },
    };
  }
}
