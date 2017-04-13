/* eslint-disable */
import { GraphQLSchema, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import ndf from '../nodeDefinitions';
import { registerType } from '../typeRegistry';

import Entry from '../models/Entry';

import ChannelType from './ChannelType';
import MemberType, { fabricator as memberFac } from './MemberType';

import member from '../../db/services/member';

const EntryType = new GraphQLObjectType({
  name: 'Entry',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: obj => obj._id,
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    entry_type: {
      type: GraphQLString,
    },
    created_by: {
      type: MemberType,
      resolve: (obj, args, {pPool}) => {
        return member.get_member_by_id(pPool, {
          id: obj.created_by,
        }).then(res => memberFac(res.rows[0]));
      },
    },
    channel: {
      type: ChannelType,
    },
    created_at: {
      type: GraphQLString,
    },
    last_edit: {
      type: GraphQLString,
    },
  }),
  interfaces: () => [ndf.nodeInterface],
});

export const fabricator = (cn) => {
  if (!cn || !cn.id) {
    return new Entry({
      id: 0,
    });
  }
  return new Entry(cn);
};

registerType(Entry, EntryType, (id, {mPool}) => {

});

export default EntryType;
