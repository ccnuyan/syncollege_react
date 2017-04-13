/* eslint-disable */
import { GraphQLSchema, GraphQLID, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import ndf from '../nodeDefinitions';

const LastVisitType = new GraphQLObjectType({
  name: 'LastVisit',
  fields: () => ({
    id: globalIdField('LastVisit'),
    team_id: {
      type: GraphQLString,
    },
    channel_id: {
      type: GraphQLString,
    },
    team_title: {
      type: GraphQLString,
    },
    channel_title: {
      type: GraphQLString,
    },
  }),
  interfaces: () => [ndf.nodeInterface],
});

export default LastVisitType;
