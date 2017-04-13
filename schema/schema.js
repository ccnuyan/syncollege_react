/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLList} from 'graphql';
/* eslint-enable */

import query from './types/QueryType';
import mutation from './mutations/MutationType';

const schema = new GraphQLSchema({
  query,
  mutation,
});

export default schema;
