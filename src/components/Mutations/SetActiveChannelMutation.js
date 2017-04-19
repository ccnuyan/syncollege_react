import Relay from 'react-relay';

export default class extends Relay.Mutation {
  static fragments = {
    store: () => Relay.QL`
      fragment on Store {
        id
        activeTeam{
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
        store{
          activeChannel{
            id
            channelDetail{
              id
              title
            }
            channelEntries
          }
          activeTeam{
            id
            teamDetail{
              id
              title
            }
            teamChannels
          }
        }
      }
    `;
  }

  getConfigs = () => {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        // activeTeam: `${this.props.store.activeTeam.id}`,
        store: `${this.props.store.id}`,
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
