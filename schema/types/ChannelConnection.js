/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLID } from 'graphql';
import { globalIdField, mutationWithClientMutationId, connectionDefinitions, connectionArgs, connectionFromPromisedArray, connectionFromArray } from 'graphql-relay';
/* eslint-enable */

import ChannelType from './ChannelType';
import Channel from '../models/Channel';
import channel from '../../db/services/channel';

// return_id bigint,
// email varchar(255),
// display_name varchar(50),
// success boolean,
// message varchar(50)

const definition = connectionDefinitions({
  name: 'teamChannels',
  nodeType: ChannelType,
});

const connection = {
  type: definition.connectionType,
  args: connectionArgs,
  resolve: (obj, args, { pPool, req }) => {
    if (!req.user) {
      return connectionFromArray([], args);
    }
    if (obj.teamDetail.id === 0) {
      return connectionFromArray([], args);
    }
    return connectionFromPromisedArray(channel.get_team_channels(pPool, {
      uid: req.user.id,
      tid: obj.teamDetail.id,
    }).then((dbres) => {
      const uobj = dbres.rows.map(c => new Channel(c));
      return uobj;
    }), args);
  },
};

export default {
  definition,
  connection,
}
;
