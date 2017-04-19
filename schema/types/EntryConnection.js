/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLID } from 'graphql';
import { globalIdField, mutationWithClientMutationId, connectionDefinitions, connectionArgs, connectionFromPromisedArray, connectionFromArray } from 'graphql-relay';
/* eslint-enable */

import connectionFromMongoCursor from '../mongo/connectionFromMongoCursor';

import EntryType from './EntryType';

const definition = connectionDefinitions({
  name: 'channelEntries',
  nodeType: EntryType,
});

const connection = {
  type: definition.connectionType,
  args: connectionArgs,
  resolve: (obj, args, { mPool, req }) => {
    if (!req.user) {
      return connectionFromArray([], args);
    }
    if (!obj.channelDetail.id) {
      return connectionFromArray([], args);
    }
    const entryCursor = mPool.collection('entries').find({
      channel_id: obj.channelDetail.id,
    });

    return connectionFromMongoCursor(entryCursor, args);
  },
};

export default {
  definition,
  connection,
};
