/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import channel from '../../../db/services/channel';
import ChannelType, { fabricator as chanFab } from '../../types/ChannelType';


export default mutationWithClientMutationId({
  name: 'UpdateChannel',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    team_id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    channel: {
      type: ChannelType,
      resolve: (res) => {
        return chanFab(res.rows[0]);
      },
    },
  },
  mutateAndGetPayload: ({ id, team_id, title }, { pPool, req }) => {
    return channel.update_channel_title(pPool, {
      uid: req.user.id,
      tid: team_id,
      id,
      title,
    });
  },
});
