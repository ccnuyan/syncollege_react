/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLID } from 'graphql';
import { globalIdField, mutationWithClientMutationId, connectionDefinitions, connectionArgs, connectionFromPromisedArray, connectionFromArray } from 'graphql-relay';
/* eslint-enable */

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
    if (args.channel_id) {
      return connectionFromArray([], args);
    }
    return connectionFromPromisedArray(mPool.collection('entries').find({
      // created_by: req.user.id,
      channel_id: obj.channelDetail.id,
    }).toArray().then((res) => {
      return res;
    }), args);
  },
};

export default {
  definition,
  connection,
};
