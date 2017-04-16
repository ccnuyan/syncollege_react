import Relay from 'react-relay';

export default class extends Relay.Mutation {
  static fragments = {
    activeTeam: () => Relay.QL`
      fragment on ActiveTeam {
        id
      }
    `,
    activeChannel: () => Relay.QL`
      fragment on ActiveChannel {
        id
      }
    `,
  };

  getMutation = () => {
    return Relay.QL`mutation { deleteChannel }`;
  }

  getFatQuery = () => {
    return Relay.QL`
      fragment on DeleteChannelPayload {
        activeTeam
        activeChannel
        channelEdge {
          node {
            id title
          }
        }
      }
    `;
  }
  getConfigs = () => {
    return [{
      type: 'NODE_DELETE',
      // The field name in the response that represents the parent of the connection
      parentName: 'activeTeam',
      parentID: this.props.activeTeam.id,
      connectionName: 'teamChannels',
      // mark channelEdge.node.id as the to be deleted object's id
      deletedIDFieldName: `channelEdge {
        node {
          id
        }
      }`,
    }, {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        channelEdge: this.props.channel.id,
      }, // for display deleting
    }, {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        activeChannel: this.props.activeChannel.id,
      }, // use activeChannel field to replace object with id 'this.props.activeChannel.id' in store
    }];
  }
  getVariables = () => {
    return this.props.input;
  }

  getOptimisticResponse = () => {
    return {
      channelEdge: {
        id: this.props.input.id,
        title: 'deleting ...',
      },
    };
  }
}
