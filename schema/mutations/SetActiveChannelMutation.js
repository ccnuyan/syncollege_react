/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import channel from '../../db/services/channel';
import team from '../../db/services/team';

import ActiveChannelType, { fabricator as acnFab } from '../types/ActiveChannelType';
import ActiveTeamType, { fabricator as atmFab } from '../types/ActiveTeamType';


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
    aTeam: {
      type: ActiveTeamType,
      resolve: (res) => {
        return res.activeTeam;
      },
    },
    aChannel: {
      type: ActiveChannelType,
      resolve: (res) => {
        return res.activeChannel;
      },
    },
  },
  mutateAndGetPayload: async ({team_id, channel_id}, {req, pPool}) => {
    if (!req.user) {
      return {
        activeTeam: atmFab(),
        activeChannel: acnFab(),
      };
    }

    if (channel_id) {
      const ac = await channel.get_channel_by_id(pPool, {
        id: channel_id,
      }).then(res => acnFab(res.rows[0]));

      const at = await team.get_team_by_id(pPool, {
        id: ac.channelDetail.team_id,
      }).then(res => atmFab(res.rows[0]));

      return {
        activeTeam: at,
        activeChannel: ac,
      };
    } else if (team_id) {
      const ac = team.get_last_visit_team_channel(pPool, {
        uid: req.user.id,
        tid: team_id,
      }).then(res => acnFab(res.rows[0]));

      const at = await team.get_team_by_id(pPool, {
        id: team_id,
      }).then(res => atmFab(res.rows[0]));

      return {
        activeTeam: at,
        activeChannel: ac,
      };
    }
    const at = await team.get_last_visit_team(pPool, {
      uid: req.user.id,
    }).then(res => atmFab(res.rows[0]));

    const ac = await team.get_last_visit_team_channel(pPool, {
      uid: req.user.id,
      tid: at.teamDetail.id,
    }).then(res => acnFab(res.rows[0]));

    return {
      activeTeam: at,
      activeChannel: ac,
    };
  },
});
