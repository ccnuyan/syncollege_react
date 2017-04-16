/* eslint-disable */
import { GraphQLSchema, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import ndf from '../nodeDefinitions';
import { registerType } from '../typeRegistry';

import Team from '../models/Team';
import team from '../../db/services/team';

const TeamType = new GraphQLObjectType({
  name: 'Team',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: GraphQLString,
    },
    owner_email: {
      type: GraphQLString,
    },
    owner_nickname: {
      type: GraphQLString,
    },
    created_by: {
      type: GraphQLString,
      resolve: user => user.returnId,
    },
    created_at: {
      type: GraphQLString,
    },
  }),
  interfaces: () => [ndf.nodeInterface],
});

export const fabricator = (tm) => {
  if (!tm || !tm.id) {
    return new Team({
      id: 0,
    });
  }
  return new Team(tm);
};

registerType(Team, TeamType, (id, { pPool }) => {
  return team.get_team_by_id(pPool, {
    id,
  }).then(res => fabricator(res.rows[0]));
});

export default TeamType;
