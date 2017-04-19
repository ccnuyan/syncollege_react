// /* eslint-disable */
// import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
// import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
// /* eslint-enable */

// import channel from '../../db/services/channel';
// import teamChannels from '../types/ChannelConnection';
// import EntryType from '../types/EntryType';

// export default mutationWithClientMutationId({
//   name: 'NewEntry',
//   inputFields: {
//     id: {
//       type: new GraphQLNonNull(GraphQLString),
//     },
//   },
//   outputFields: {
//     channelEdge: {
//       type: teamChannels.definition.edgeType,
//       resolve: (res) => {
//         const ret = {
//           node: res.rows[0],
//           cursor: res.rows[0].id,
//         };
//         return ret;
//       },
//     },
//     entry: {
//       type: EntryType,
//       resolve: () => dataService.anonymousStore,
//     },
//   },
//   mutateAndGetPayload: ({ id }, { pPool, req }) => {
//     return channel.create_channel(pPool, {
//       uid: req.user.id,
//     });
//   },
// });
