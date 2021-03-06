import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import { withRouter } from 'react-router';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';

import withWidth, { SMALL, MEDIUM, LARGE } from 'material-ui/utils/withWidth'; //eslint-disable-line
import withIo from '../Providers/IoProvider';

import m from '../Mutations';
import ChannelEach from './ChannelEach';

class Channels extends Component {

  static propTypes = {
    io: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
  }

  state = {
    open: false,
  };

  componentDidMount() {
    const { router } = this.props;

    const team_id = router.location.query.team;
    const channel_id = router.location.query.channel;

    this.setActiveChannel(team_id, channel_id);
  }

  setActiveChannel = (team_id, channel_id) => {
    const store = this.props.store;
    const activeChannel = store.activeChannel;

    const oldChannelId = activeChannel.channelDetail.id;

    const { router } = this.props;
    router.push({
      query: {
        team: team_id,
        channel: channel_id,
      },
      pathname: 'team_channel',
    });

    Relay.Store.commitUpdate(new m.SetActiveChannelMutation({
      store: this.props.store,
      input: {
        team_id,
        channel_id,
      },
    }), {
      onSuccess: (ret) => {
        this.props.io.joinChannel({ oldChannelId, newChannelId: ret.setActiveChannel.store.activeChannel.channelDetail.id });
      },
    });
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
  render() {
    const store = this.props.store;
    const activeTeam = store.activeTeam;
    const activeChannel = store.activeChannel;
    const channels = activeTeam.teamChannels.edges;
    const { width } = this.props;

    if (width === SMALL) {
      return (
        <div>
          <RaisedButton
            fullWidth
            label={ `Current: ${activeChannel.channelDetail.title || '...'}` }
            onTouchTap={ this.handleTouchTap }
          />
          <Popover
            anchorEl={ this.state.anchorEl }
            anchorOrigin={ { horizontal: 'left', vertical: 'bottom' } }
            animation={ PopoverAnimationVertical }
            onRequestClose={ this.handleRequestClose }
            open={ this.state.open }
            targetOrigin={ { horizontal: 'left', vertical: 'top' } }
          >
            <Menu width={ '100%' }>
              {channels.map(c => (<MenuItem key={ c.node.id }>
                <ChannelEach
                  activeChannel={ activeChannel }
                  activeTeam={ activeTeam }
                  channel={ c.node }
                  setActiveChannel={ this.setActiveChannel }
                />
              </MenuItem>))}
            </Menu>
          </Popover>
        </div>);
    }
    return (
      <div>
        {channels.map(c => (
          <ChannelEach
            activeChannel={ activeChannel }
            activeTeam={ activeTeam }
            channel={ c.node }
            key={ c.node.id }
            setActiveChannel={ this.setActiveChannel }
          />
        ))}
      </div>);
  }
}

Channels = Relay.createContainer(withIo(withRouter(withWidth()(Channels))), { //eslint-disable-line
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        ${m.SetActiveChannelMutation.getFragment('store')}
        ${m.CreateChannelMutation.getFragment('store')}
        loginInfo{
          success
          user_id
        }
        activeTeam{
          teamChannels(first:10) {
            edges {
              node {
                id
                ${ChannelEach.getFragment('channel')}
              }
            }
          }
          ${ChannelEach.getFragment('activeTeam')}   
        }
        activeChannel{
          id
          channelDetail{
            id
            title              
          }
          ${ChannelEach.getFragment('activeChannel')}   
        }
      }
    `,
  },
});


export default Channels;
