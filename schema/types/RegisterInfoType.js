/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import ndf from '../nodeDefinitions';

const RegisterInfoType = new GraphQLObjectType({
  name: 'RegisterInfo',
  fields: () => ({
    id: globalIdField('RegisterInfo'),
    new_id: {
      type: GraphQLString,
      resolve: user => user.new_id,
    },
    validation_token: {
      type: GraphQLString,
    },
    authentication_token: {
      type: GraphQLString,
    },
    success: {
      type: GraphQLBoolean,
    },
    message: {
      type: GraphQLString,
    },
  }),
  interfaces: () => [ndf.nodeInterface],
});

export default RegisterInfoType;
