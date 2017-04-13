import { GraphQLObjectType } from 'graphql';

import LocalLoginMutation from './LocalLoginMutation';
import LocalRegisterMutation from './LocalRegisterMutation';

import CreateTeamMutation from './team/CreateTeamMutation';
import DeleteTeamMutation from './team/DeleteTeamMutation';
import UpdateTeamMutation from './team/UpdateTeamMutation';

import CreateChannelMutation from './channel/CreateChannelMutation';
import DeleteChannelMutation from './channel/DeleteChannelMutation';
import UpdateChannelMutation from './channel/UpdateChannelMutation';

import SetActiveChannelMutation from './SetActiveChannelMutation';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    localLogin: LocalLoginMutation,
    localRegister: LocalRegisterMutation,

    createTeam: CreateTeamMutation,
    deleteTeam: DeleteTeamMutation,
    updateTeam: UpdateTeamMutation,

    createChannel: CreateChannelMutation,
    deleteChannel: DeleteChannelMutation,
    updateChannel: UpdateChannelMutation,

    setActiveChannel: SetActiveChannelMutation,
  }),
});

export default MutationType;
