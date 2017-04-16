/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import channel from '../../../db/services/channel';
import teamChannels from '../../types/ChannelConnection';
import StoreType from '../../types/StoreType';
import dataService from '../../dataService';

export default mutationWithClientMutationId({
  name: 'CreateChannel',
  inputFields: {
    title: {
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
    store: {
      type: StoreType,
      resolve: () => dataService.anonymousStore,
    },
  },
  mutateAndGetPayload: ({ title }, { pPool, req }) => {
    return channel.create_channel(pPool, {
      uid: req.user.id,
      title,
    });
  },
});
