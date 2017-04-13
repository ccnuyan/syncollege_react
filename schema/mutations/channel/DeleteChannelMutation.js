/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import channel from '../../../db/services/channel';
import team from '../../../db/services/team';

import teamChannels from '../../types/ChannelConnection';
import ActiveTeamType, { fabricator as atmFab } from '../../types/ActiveTeamType';
import ActiveChannelType, { fabricator as atcFab } from '../../types/ActiveChannelType';

export default mutationWithClientMutationId({
  name: 'DeleteChannel',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    team_id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    channelEdge: {
      type: teamChannels.definition.edgeType,
      resolve: (res) => {
        const ret = {
          node: res.rows[0],
          cursor: res.rows[0].id,
        };
        return ret;
      },
    },
    activeTeam: {
      type: ActiveTeamType,
      resolve: (res, args, {req, pPool}) => {
        if (!req.user) {
          return atmFab();
        }
        return team.get_team_by_id(pPool, {
          id: res.rows[0].team_id,
        }).then(pres => atmFab(pres.rows[0]));
      },
    },
    activeChannel: {
      type: ActiveChannelType,
      resolve: (res, args, {req, pPool}) => {
        if (!req.user) {
          return atcFab();
        }
        return team.get_last_visit_team_channel(pPool, {
          uid: req.user.id,
          tid: res.rows[0].team_id,
        }).then(pres => atcFab(pres.rows[0]));
      },
    },
  },
  mutateAndGetPayload: ({id, team_id}, {pPool, req}) => {
    return channel.delete_channel(pPool, {
      uid: req.user.id,
      tid: team_id,
      id,
    });
  },
});
