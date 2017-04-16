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
    return Relay.QL`mutation { deleteTeam }`;
  }

  getFatQuery = () => {
    return Relay.QL`
      fragment on DeleteTeamPayload {
        store
        teamEdge {
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
      parentName: 'store',
      parentID: this.props.store.id,
      connectionName: 'myTeams',
      // mark teamEdge.node.id as the to be deleted object's id
      deletedIDFieldName: `teamEdge {
        node {
          id
        }
      }`,
    }, {
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        teamEdge: this.props.team.id,
      }, // for display deleting
    }];
  }
  getVariables = () => {
    return this.props.input;
  }

  getOptimisticResponse = () => {
    console.log({ // eslint-disable-line no-console
      id: this.props.input.id,
      title: 'deleting ...',
    });
    return {
      teamEdge: {
        id: this.props.input.id,
        title: 'deleting ...',
      },
    };
  }
}
