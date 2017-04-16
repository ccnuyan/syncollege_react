/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import authentication from '../../db/services/authentication';
import dataService from '../dataService';

import StoreType from '../types/StoreType';
import LoginInfoType from '../types/LoginInfoType';

export default mutationWithClientMutationId({
  name: 'LocalLogin',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
    mode: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    store: {
      type: StoreType,
      resolve: () => dataService.anonymousStore,
    },
    loginInfo: {
      type: LoginInfoType,
    },
  },
  mutateAndGetPayload: async ({ email, password, mode }, { req, pPool }) => {
    if (mode === 'logout') {
      return {
        loginInfo: dataService.anonymousLoginInfo,
      };
    }

    const authRet = await authentication.authentiacate(pPool, {
      email,
      password,
    }).then(res => res.rows[0]);

    let user = {};

    if (authRet.success) {
      user = authRet;
      user.id = authRet.return_id;
      user.token = await pPool.query('select provider_token from logins where logins.user_id=$1 and logins.provider_key=$2', [authRet.return_id, 'token'])
        .then(res => res.rows[0].provider_token);
      req.user = user; // eslint-disable-line
    }
    return {
      loginInfo: user,
    };
  },
});
