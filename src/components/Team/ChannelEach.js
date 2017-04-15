import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import _ from 'lodash';

import { withRouter } from 'react-router';


import m from '../Mutations';
import Item from '../Controls/Item';

class ChannelEach extends Component {

  static propTypes = {
    setActiveChannel: PropTypes.func.isRequired,
    channel: PropTypes.object.isRequired,
    activeTeam: PropTypes.object.isRequired,
    activeChannel: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  }

  onEnter = () => {
    const { channel } = this.props;
    this.props.setActiveChannel(channel.team_id, channel.id);
  }

  onUpdate = (inputTitle) => {
    if (!_.trim(inputTitle)) {
      return;
    }
    Relay.Store.commitUpdate(new m.UpdateChannelMutation({
      activeTeam: this.props.activeTeam,
      channel: this.props.channel,
      input: {
        id: this.props.channel.id,
        team_id: this.props.activeTeam.teamDetail.id,
        title: inputTitle,
      },
    }));
  }

  onDelete = () => {
    Relay.Store.commitUpdate(new m.DeleteChannelMutation({
      activeTeam: this.props.activeTeam,
      activeChannel: this.props.activeTeam.activeChannel,
      channel: this.props.channel,
      input: {
        id: this.props.channel.id,
        team_id: this.props.activeTeam.teamDetail.id,
      },
    }),
      {
        onFailure: () => {
        },
        onSuccess: (p) => {
          const channel = p.deleteChannel.activeChannel;
          const team = p.deleteChannel.activeTeam;
          this.props.router.push(`/team/${team.teamDetail.id}/channel/${channel.channelDetail.id}`);
        },
      });
  }

  render = () => {
    const { channel, activeChannel } = this.props;
    return (
      <Item
          active={ channel.id === activeChannel.channelDetail.id }
          model={ channel }
          onDelete={ this.onDelete }
          onEnter={ this.onEnter }
          onUpdate={ this.onUpdate }
          titlePath={ 'title' }
      />
    );
  }
}


ChannelEach = Relay.createContainer(withRouter(ChannelEach), { //eslint-disable-line
  fragments: {
    channel: () => Relay.QL`
      fragment on Channel {
        id
        ${m.UpdateChannelMutation.getFragment('channel')}
        title
        team_id
        can_delete
      }
    `,
    activeTeam: () => Relay.QL`
      fragment on ActiveTeam{
        id
        teamDetail{
          id
        }
        ${m.DeleteChannelMutation.getFragment('activeTeam')}
      }
    `,
    activeChannel: () => Relay.QL`
      fragment on ActiveChannel{
        id
        channelDetail{
            id
          }
        ${m.DeleteChannelMutation.getFragment('activeChannel')}
      }
    `,
  },
});

export default ChannelEach;
