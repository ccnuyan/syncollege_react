import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import Paper from 'material-ui/Paper';
import ChannelContent from './ChannelContent';
import Channels from './Channels';

import withWidth, { SMALL, MEDIUM, LARGE } from 'material-ui/utils/withWidth'; //eslint-disable-line

import StylesProvider from '../Providers/StylesProvider';

class TeamPage extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired,
    styles: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
  }

  getStyles = () => {
    const { width, styles } = this.props;
    return {
      constainer: {
        width: '100%',
        height: '100%',
        ...(width === SMALL ? styles.flexColumn : styles.flexRow),
      },
      channels: {
        flex: width === SMALL ? '0 0 auto' : '0 0 20em',
      },
    };
  }

  render = () => {
    const store = this.props.store;
    const activeChannel = store.activeChannel;
    const styles = this.getStyles();
    return (
      <div style={ styles.constainer }>
        <Paper style={ styles.channels }>
          <Channels store={ store }/>
        </Paper>
        <ChannelContent
              activeChannel={ activeChannel }
              store={ store }
        />
      </div>
    );
  }
}

TeamPage = Relay.createContainer(StylesProvider(withWidth()(TeamPage)), { //eslint-disable-line
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        ${Channels.getFragment('store')}
        ${ChannelContent.getFragment('store')}     
        loginInfo{
          success
          user_id
          email
        }
        activeTeam{
          id
          teamDetail{
            id
            title
          }
        }
        activeChannel{
          id
          channelDetail{
            id
            title              
          }
          ${ChannelContent.getFragment('activeChannel')}     
        }
      }
    `,
  },
});


export default TeamPage;
