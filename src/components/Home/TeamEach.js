import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import { withRouter } from 'react-router';

import Item from '../Controls/Item';
import m from '../Mutations';

class TeamEach extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    team: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    active: PropTypes.bool,
  }

  onUpdate = (inputTitle) => {
    Relay.Store.commitUpdate(new m.UpdateTeamMutation({
      team: this.props.team,
      input: {
        id: this.props.team.id,
        title: inputTitle,
      },
    }));
  }

  onEnter = () => {
    this.props.router.push(`/team_channel?team=${this.props.team.id}`);
  }

  onDelete = () => {
    Relay.Store.commitUpdate(new m.DeleteTeamMutation({
      store: this.props.store,
      team: this.props.team,
      input: {
        id: this.props.team.id,
      },
    }));
  }

  render() {
    const { team } = this.props;
    return (
      <Item
          model={ team }
          onDelete={ this.onDelete }
          onEnter={ this.onEnter }
          onUpdate={ this.onUpdate }
          titlePath={ 'title' }
      />);
  }
}

TeamEach = Relay.createContainer(withRouter(TeamEach), { //eslint-disable-line
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id
        title
        created_at 
        created_by 
        owner_email
        ${m.UpdateTeamMutation.getFragment('team')}
      }
    `,
    store: () => Relay.QL`
      fragment on Store{
        ${m.DeleteTeamMutation.getFragment('store')}
        ${m.SetActiveChannelMutation.getFragment('store')}
        activeTeam{
          id
          teamDetail{
            id
          }
        }
      }
    `,
  },
});

export default TeamEach;
