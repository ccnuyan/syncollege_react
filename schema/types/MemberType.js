/* eslint-disable */
import { GraphQLSchema, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import ndf from '../nodeDefinitions';
// import { registerType } from '../typeRegistry';

import Member from '../models/Member';

const MemberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    content: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    display_name: {
      type: GraphQLString,
    },
    user_for: {
      type: GraphQLString,
    },
  }),
  interfaces: () => [ndf.nodeInterface],
});

export const fabricator = (cn) => {
  if (!cn || !cn.id) {
    return new Member({
      id: 0,
    });
  }
  return new Member(cn);
};

// registerType(Member, MemberType, (id, { mPool }) => {
//   // const entries = await mPool.
// });

export default MemberType;
