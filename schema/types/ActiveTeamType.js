/* eslint-disable */
import { GraphQLSchema, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import ndf from '../nodeDefinitions';
import { registerType } from '../typeRegistry';

import ActiveTeam from '../models/ActiveTeam';
import TeamType from './TeamType';
import team from '../../db/services/team';

import teamChannels from './ChannelConnection';

const ActiveTeamType = new GraphQLObjectType({
  name: 'ActiveTeam',
  fields: () => ({
    id: globalIdField('ActiveTeam'),
    teamDetail: {
      type: TeamType,
    },
    teamChannels: teamChannels.connection,
  }),
  interfaces: () => [ndf.nodeInterface],
});

export const fabricator = (tm) => {
  if (!tm || !tm.id) {
    return new ActiveTeam({
      id: 0,
      teamDetail: {
        id: 0,
      },
    });
  }
  return new ActiveTeam({
    id: tm.id,
    teamDetail: tm,
  });
};

export const getActiveTeam = (pPool, id) => {
  if (!id) {
    return fabricator();
  }
  return team.get_team_by_id(pPool, {
    id,
  }).then((res) => {
    // todo the id is empty
    return fabricator(res.rows[0]);
  });
};

registerType(ActiveTeam, ActiveTeamType, (id, { pPool }) => {
  return getActiveTeam(pPool, id);
});

export default ActiveTeamType;
