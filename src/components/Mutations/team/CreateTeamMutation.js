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
    return Relay.QL`mutation { createTeam }`;
  }

  getFatQuery = () => {
    return Relay.QL`
      fragment on CreateTeamPayload {
        teamEdge
        store
      }
    `;
  }
  getConfigs = () => {
    return [{
      type: 'RANGE_ADD',
      parentName: 'store',
      parentID: this.props.store.id,
      connectionName: 'myTeams',
      edgeName: 'teamEdge',
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
      teamEdge: {
        node: {
          title: `${this.props.input.title} creating ...`,
          owner_email: '',
        },
      },
    };
  }
}
