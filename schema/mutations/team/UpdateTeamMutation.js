/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import team from '../../../db/services/team';
import StoreType from '../../types/StoreType';
import dataService from '../../dataService';
import TeamType from '../../types/TeamType';

export default mutationWithClientMutationId({
  name: 'UpdateTeam',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    team: {
      type: TeamType,
      resolve: (res) => {
        return res.rows[0];
      },
    },
    store: {
      type: StoreType,
      resolve: () => dataService.anonymousStore,
    },
  },
  mutateAndGetPayload: ({id, title}, {pPool, req}) => {
    return team.update_team_title(pPool, {
      uid: req.user.id,
      id,
      title,
    });
  },
});
