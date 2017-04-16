/* eslint-disable */
import { GraphQLSchema, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import ndf from '../nodeDefinitions';
import { registerType } from '../typeRegistry';

import Channel from '../models/Channel';
import channel from '../../db/services/channel';

const ChannelType = new GraphQLObjectType({
  name: 'Channel',
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
    team_id: {
      type: GraphQLString,
    },
    can_delete: {
      type: GraphQLBoolean,
    },
  }),
  interfaces: () => [ndf.nodeInterface],
});

export const fabricator = (cn) => {
  if (!cn || !cn.id) {
    return new Channel({
      id: 0,
    });
  }
  return new Channel(cn);
};

registerType(Channel, ChannelType, (id, { pPool }) => {
  return channel.get_channel_by_id(pPool, {
    id,
  }).then(res => fabricator(res.rows[0]));
});

export default ChannelType;
