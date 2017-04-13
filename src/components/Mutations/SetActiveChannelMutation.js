import Relay from 'react-relay';

export default class extends Relay.Mutation {
  static fragments = {
    store: () => Relay.QL`
      fragment on Store {
        id
        activeChannel{
          id
          channelDetail{
            title
          }
        }
        activeTeam{
          id
          teamDetail{
            title
          }
        }
      }
    `,
  };

  getMutation = () => {
    return Relay.QL`mutation { setActiveChannel }`;
  }

  getFatQuery = () => {
    return Relay.QL`
      fragment on SetActiveChannelPayload {
        aChannel{
          channelDetail{
            id
            title
          }
          channelEntries
        }
        aTeam{
          teamDetail{
            id
            title
          }
          teamChannels
        }
      }
    `;
  }

  getConfigs = () => {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        aChannel: this.props.store.activeChannel.id,
        aTeam: this.props.store.activeTeam.id,
      },
    }];
  }
  getVariables = () => {
    return {
      team_id: this.props.input.team_id,
      channel_id: this.props.input.channel_id,
    };
  }

  getOptimisticResponse = () => {
    const ret = {
      store: {
        activeChannel: {
          channelDetail: {
            id: 0,
            title: '...',
            channelEntries: [],
          },
        },
        activeTeam: {
          teamDetail: {
            id: 0,
            title: this.props.store.activeTeam.teamDetail.title,
          },
        },
      },
    };
    return ret;
  }
}
