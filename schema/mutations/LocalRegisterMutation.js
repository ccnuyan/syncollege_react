/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import StoreType from '../types/StoreType';
import RegisterInfoType from '../types/RegisterInfoType';

import authentication from '../../db/services/authentication';
import dataService from '../dataService';

export default mutationWithClientMutationId({
  name: 'LocalRegister',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    store: {
      type: StoreType,
      resolve: () => dataService.anonymousStore,
    },
    registerInfo: {
      type: RegisterInfoType,
    },
  },
  mutateAndGetPayload: ({ email, password }, { pPool }) => {
    return authentication.register(pPool, {
      email,
      password,
    })
      .then((dbres) => {
        const registerInfo = dbres.rows[0];
        return {
          registerInfo,
        };
      });
  },
});
