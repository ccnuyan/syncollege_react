/* eslint-disable */
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLNonNull, GraphQLInputField, GraphQLList, GraphQLBoolean } from 'graphql';
import { globalIdField, nodeDefinitions, fromGlobalId, mutationWithClientMutationId } from 'graphql-relay';
/* eslint-enable */

import ndf from '../nodeDefinitions';

import LoginInfoType from './LoginInfoType';
import RegisterInfoType from './RegisterInfoType';

import ActiveTeamType, { fabricator as atmFab } from './ActiveTeamType';
import ActiveChannelType, { fabricator as acnFab } from './ActiveChannelType';
import { fabricator as tmFab } from './TeamType';
import { fabricator as cnFab } from './ChannelType';

import dataService from '../dataService';
import team from '../../db/services/team';
import myTeams from './TeamConnection';
import LastVisitType from './LastVisitType';

const StoreType = new GraphQLObjectType({
  name: 'Store',
  fields: () => ({
    id: globalIdField('Store'),
    loginInfo: {
      type: LoginInfoType,
      resolve: (obj, args, { req }) => {
        if (req.user) {
          /*
            authenticated, return req.user
            notice req.user is the logininfo and it has an id field
          */
          return req.user;
        }
          // not authenticated, return anonymousLoginInfo
        return dataService.anonymousLoginInfo;
      },
    },
    registerInfo: {
      type: RegisterInfoType,
      resolve: () => {
        // always return anonymousRegisterInfo here
        return dataService.anonymousRegisterInfo;
      },
    },
    lastVisit: {
      type: LastVisitType,
      resolve: async (_1, _2, { req, pPool }) => {
        if (!req.user) {
          return {
            id: 'active',
          };
        }
        const at = await team.get_last_visit_team(pPool, {
          uid: req.user.id,
        }).then(res => tmFab(res.rows[0]));
        const ac = await team.get_last_visit_team_channel(pPool, {
          uid: req.user.id,
          tid: at.id,
        }).then(res => cnFab(res.rows[0]));
        return {
          id: 'active',
          team_id: at.id,
          team_title: at.title,
          channel_id: ac.id,
          channel_title: ac.title,
        };
      },
    },
    myTeams: myTeams.connection,
    activeTeam: {
      type: ActiveTeamType,
      resolve: () => {
        return atmFab();
      },
    },
    activeChannel: {
      type: ActiveChannelType,
      resolve: () => {
        return acnFab();
      },
    },
  }),
  interfaces: () => [ndf.nodeInterface],
});

export default StoreType;
