/* eslint-disable */
import { GraphQLSchema, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import ndf from '../nodeDefinitions';
import { registerType } from '../typeRegistry';

import ActiveChannel from '../models/ActiveChannel';
import ChannelType from './ChannelType';
import channel from '../../db/services/channel';

import channelEntries from './EntryConnection';

const ActiveChannelType = new GraphQLObjectType({
  name: 'ActiveChannel',
  fields: () => ({
    id: globalIdField('ActiveChannel'),
    channelDetail: {
      type: ChannelType,
    },
    channelEntries: channelEntries.connection,
  }),
  interfaces: () => [ndf.nodeInterface],
});

export const fabricator = (cn) => {
  if (!cn || !cn.id) {
    return new ActiveChannel({
      id: 0,
      channelDetail: {
        id: 0,
      },
    });
  }
  return new ActiveChannel({
    id: cn.id,
    channelDetail: cn,
  });
};

export const getActiveChannel = (pPool, id) => {
  if (!id) {
    return fabricator();
  }
  return channel.get_channel_by_id(pPool, {
    id,
  }).then((res) => {
    // todo the id is empty
    return fabricator(res.rows[0]);
  });
};

registerType(ActiveChannel, ActiveChannelType, (id, { pPool }) => {
  return getActiveChannel(pPool, id);
});

export default ActiveChannelType;
