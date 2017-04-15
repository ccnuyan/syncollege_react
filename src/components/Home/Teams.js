import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import _ from 'lodash';

import { withRouter } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import { List } from 'material-ui/List';
import m from '../Mutations';
import TeamEach from './TeamEach';

class Teams extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  }

  createTeam = (event) => {
    event.preventDefault();

    if (!_.trim(this.newTeamTitle.input.value)) {
      return;
    }

    Relay.Store.commitUpdate(new m.CreateTeamMutation({
      store: this.props.store,
      input: {
        title: this.newTeamTitle.input.value,
      },
    }));

    this.newTeamTitle.input.value = '';
  }

  render() {
    const { lastVisit } = this.props.store;
    const { router } = this.props;

    return (
      <div style={ { alignSelf: 'center' } }>
        <h3>Last visit:</h3>
        <div>
          <RaisedButton
            label={ `${lastVisit.team_title}->${lastVisit.channel_title}` }
            onTouchTap={ () => router.push(`/team_channel?channel=${lastVisit.channel_id}`) }
            primary
          />
        </div>
        <h3>Favorate Teams:</h3>
        <div>
          <List>
            {this.props.store.myTeams.edges.map(c => (
              <TeamEach
                key={ c.node.id }
                store={ this.props.store }
                team={ c.node }
              />))}
          </List>
        </div>
        <h3>Create New:</h3>
        <div>
          <TextField
            hintText="new team name"
            ref={ c => this.newTeamTitle = c }
            type='text'
          />
          <FloatingActionButton
            mini
            onTouchTap={ this.createTeam }
            zDepth={ 1 }
          >
            <ContentAdd />
          </FloatingActionButton>
        </div>
      </div>);
  }
}

Teams = Relay.createContainer(withRouter(Teams), { // eslint-disable-line
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        ${TeamEach.getFragment('store')}
        ${m.CreateTeamMutation.getFragment('store')}
        ${m.SetActiveChannelMutation.getFragment('store')}
        loginInfo{
          success
        }
        myTeams(first:100){
          edges {
            cursor
            node {
              id
              ${TeamEach.getFragment('team')}
            }
          }
        }
        lastVisit{
          team_id
          team_title
          channel_id
          channel_title
        }
      }
    `,
  },
});

export default Teams;
