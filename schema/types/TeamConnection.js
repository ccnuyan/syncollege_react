/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLID } from 'graphql';
import { globalIdField, mutationWithClientMutationId, connectionDefinitions, connectionArgs, connectionFromPromisedArray, connectionFromArray } from 'graphql-relay';
/* eslint-enable */

import TeamType from './TeamType';
import Team from '../models/Team';
import team from '../../db/services/team';

// return_id bigint,
// email varchar(255),
// display_name varchar(50),
// success boolean,
// message varchar(50)

const definition = connectionDefinitions({
  name: 'myTeams',
  nodeType: TeamType,
});

const connection = {
  type: definition.connectionType,
  args: connectionArgs,
  resolve: (_, args, { pPool, req }) => {
    if (!req.user) {
      return connectionFromArray([], args);
    }
    return connectionFromPromisedArray(team.get_created_teams(pPool, {
      uid: req.user.id,
    }).then((dbres) => {
      const uobj = dbres.rows.map(c => new Team(c));
      return uobj;
    }), args);
  },
};

export default {
  definition,
  connection,
};
