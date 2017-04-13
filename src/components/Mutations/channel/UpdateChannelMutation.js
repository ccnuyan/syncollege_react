import Relay from 'react-relay';

export default class extends Relay.Mutation {
  static fragments = {
    channel: () => Relay.QL`
      fragment on Channel {
        id
        title
      }
    `,
  };

  getMutation = () => {
    return Relay.QL`mutation { updateChannel }`;
  }

  getFatQuery = () => {
    return Relay.QL`
      fragment on UpdateChannelPayload {
        channel {
          id
          title
          created_at
          owner_email
          owner_nickname
        }
      }
    `;
  }

  getConfigs = () => {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        channel: this.props.channel.id,
      }, // nodeType is Channel in server, not a edgeType
    }];
  }
  getVariables = () => {
    return this.props.input;
  }

  getOptimisticResponse = () => {
    return {
      channel: {
        id: this.props.input.id,
        title: `${this.props.input.title} updating ...`,
      },
    };
  }
}
