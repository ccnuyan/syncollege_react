import Relay from 'react-relay';

export default class extends Relay.Mutation {
  static fragments = {
    team: () => Relay.QL`
      fragment on Team {
        id
        title
      }
    `,
  };

  getMutation = () => {
    return Relay.QL`mutation { updateTeam }`;
  }

  getFatQuery = () => {
    return Relay.QL`
      fragment on UpdateTeamPayload {
        team {
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
        team: this.props.team.id,
      }, // nodeType is Team in server, not a edgeType
    }];
  }
  getVariables = () => {
    return this.props.input;
  }

  getOptimisticResponse = () => {
    return {
      team: {
        id: this.props.input.id,
        title: `${this.props.input.title} updating ...`,
      },
    };
  }
}
