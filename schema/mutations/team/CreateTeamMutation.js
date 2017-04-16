/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import team from '../../../db/services/team';
import myTeams from '../../types/TeamConnection';
import StoreType from '../../types/StoreType';
import dataService from '../../dataService';

export default mutationWithClientMutationId({
  name: 'CreateTeam',
  inputFields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    teamEdge: {
      type: myTeams.definition.edgeType,
      resolve: (res) => {
        const ret = {
          node: res.rows[0],
          cursor: res.rows[0].id,
        };
        return ret;
      },
    },
    store: {
      type: StoreType,
      resolve: () => dataService.anonymousStore,
    },
  },
  mutateAndGetPayload: ({ title }, { pPool, req }) => {
    return team.create_team(pPool, {
      uid: req.user.id,
      title,
    });
  },
});
