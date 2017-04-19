/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import channel from '../../db/services/channel';
import team from '../../db/services/team';

import { fabricator as acnFab } from '../types/ActiveChannelType';
import { fabricator as atmFab } from '../types/ActiveTeamType';

import StoreType from '../types/StoreType';


export default mutationWithClientMutationId({
  name: 'SetActiveChannel',
  inputFields: {
    team_id: {
      type: GraphQLString,
    },
    channel_id: {
      type: GraphQLString,
    },
  },
  outputFields: {
    store: {
      type: StoreType,
      resolve: (res) => {
        return res;
      },
    },
  },
  mutateAndGetPayload: async ({ team_id, channel_id }, { req, pPool }) => {
    if (!req.user) {
      return {
        activeTeam: atmFab(),
        activeChannel: acnFab(),
      };
    }

    let ac;
    let at;

    if (channel_id) {
      ac = await channel.get_channel_by_id(pPool, {
        id: channel_id,
      }).then(res => res.rows[0]);

      at = await team.get_team_by_id(pPool, {
        id: ac.team_id,
      }).then(res => atmFab(res.rows[0]));
    } else if (team_id) {
      ac = team.get_last_visit_team_channel(pPool, {
        uid: req.user.id,
        tid: team_id,
      }).then(res => res.rows[0]);

      at = await team.get_team_by_id(pPool, {
        id: team_id,
      }).then(res => atmFab(res.rows[0]));
    } else {
      at = await team.get_last_visit_team(pPool, {
        uid: req.user.id,
      }).then(res => atmFab(res.rows[0]));

      ac = await team.get_last_visit_team_channel(pPool, {
        uid: req.user.id,
        tid: at.id,
      }).then(res => res.rows[0]);
    }

    return {
      activeTeam: { id: at.id },
      activeChannel: { id: ac.id },
    };
  },
});
