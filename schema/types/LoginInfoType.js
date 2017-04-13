/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean} from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import ndf from '../nodeDefinitions';

const LoginInfoType = new GraphQLObjectType({
  name: 'LoginInfo',
  fields: () => ({
    id: globalIdField('LoginInfo'),
    user_id: {
      type: GraphQLString,
      resolve: user => user.return_id,
    },
    email: {
      type: GraphQLString,
    },
    display_name: {
      type: GraphQLString,
    },
    success: {
      type: GraphQLBoolean,
    },
    message: {
      type: GraphQLString,
    },
    token: {
      type: GraphQLString,
    },
  }),
  interfaces: () => [ndf.nodeInterface],
});

export default LoginInfoType;
