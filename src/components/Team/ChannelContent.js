import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import _ from 'lodash';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import withWidth, { SMALL, MEDIUM, LARGE } from 'material-ui/utils/withWidth'; // eslint-disable-line
import withStyles from '../Providers/StylesProvider';
import withIo from '../Providers/IoProvider';

import Message from './Message';

class ChannelContent extends Component {
  static propTypes = {
    io: PropTypes.object.isRequired,
    relay: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    activeChannel: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    styles: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  }

  state = {
    justPrevious: false,
    justNext: true,
    entriesPerPage: 7,
  }

  componentDidUpdate = () => {
    this.messageScroller.scrollTop = this.messageScroller.scrollHeight;
  }


  getStyles = () => {
    const { width, styles, theme } = this.props;
    return {
      container: {
        ...styles.flexColumn,
        ...styles.flexBetweenStretch,
        flex: width === SMALL
          ? '1 1 auto'
          : '1 1 100%',
      },
      subHeader: {
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        fontWeight: 'bold',
      },
      messageScroller: {
        flex: '1 1 100%',
        overflowY: 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
      input: {
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
      textField: {
        flex: '1 1 auto',
        margin: '0 1em',
      },
      send: {
        flex: '0 0',
        marginRight: '1em',
      },
      underlineStyle: {
        borderColor: theme.palette.accent1Color,
      },
      anchor: {
        ...styles.flexRow,
        ...styles.flexBetweenStretch,
      },
    };
  }

  sendMessage = (event) => {
    event.preventDefault();
    if (!_.trim(this.messageText.input.value)) {
      return;
    }
    const activeChannel = this.props.activeChannel;
    const body = {
      content: this.messageText.input.value,
      entry_type: 'message',
      channel_id: activeChannel.channelDetail.id,
      created_by: this.props.store.loginInfo.user_id,
    };
    this.props.io.sendMessage(body);
    this.messageText.input.value = '';
  }

  inputKeyPress = (event) => {
    if (event.charCode === 13) {
      this.sendMessage(event);
    }
  }

  prevPage = () => {
    this.props.relay.setVariables({
      last: this.state.entriesPerPage,
      before: this.props.activeChannel.channelEntries.pageInfo.startCursor,
      after: null,
      first: null,
    },
      () => {
        this.setState({
          justPrevious: true,
          justNext: false,
        });
      },
    );
  }

  nextPage = () => {
    this.props.relay.setVariables({
      first: this.state.entriesPerPage,
      after: this.props.activeChannel.channelEntries.pageInfo.endCursor,
      before: null,
      last: null,
    },
      () => {
        this.setState({
          justPrevious: false,
          justNext: true,
        });
      },
    );
  }

  render = () => {
    const entries = this.props.activeChannel.channelEntries.edges;
    const { width, activeChannel } = this.props;
    const styles = this.getStyles();
    return (
      <Paper
        style={ styles.container }
        zDepth={ 1 }
      >
        {width === SMALL
          ? ''
          : <Subheader style={ styles.subHeader }>
            {`$Current Channel: ${activeChannel.channelDetail.title}`}
          </Subheader>}
        <Divider />
        <div style={ styles.anchor }>
          {this.props.activeChannel.channelEntries.pageInfo.hasPreviousPage || this.state.justNext ?
            <RaisedButton onClick={ this.prevPage } >{'<'}</RaisedButton> : <div></div>}
          {this.props.activeChannel.channelEntries.pageInfo.hasNextPage || this.state.justPrevious ?
            <RaisedButton onClick={ this.nextPage } >{'>'}</RaisedButton> : <div></div>}
        </div>
        <div ref={ c => this.messageScroller = c } style={ styles.messageScroller }>
          {entries.map((edge) => {
            const et = edge.node;
            if (et.entry_type === 'message') {
              return (
                <Message
                  entry={ et }
                  key={ et.id }
                  self={ this.props.store.loginInfo.user_id === et.created_by.id }
                />);
            }
            if (et.entry_type === 'post') {
              return (
                <Message
                  entry={ et }
                  key={ et.id }
                  self={ this.props.store.loginInfo.user_id === et.created_by.id }
                />);
            }
            return '';
          })}
        </div>
        <Divider />
        <div style={ styles.input }>
          <TextField
            hintText="input message"
            onKeyPress={ this.inputKeyPress }
            ref={ c => this.messageText = c }
            style={ styles.textField }
            type="text"
            underlineStyle={ styles.underlineStyle }
          />
          <RaisedButton
            label={ 'Send' }
            onTouchTap={ this.sendMessage }
            primary
            style={ styles.send }
          />
        </div>
      </Paper>
    );
  }
}

ChannelContent = Relay.createContainer(withIo(withStyles(withWidth()(ChannelContent))), { //eslint-disable-line
  initialVariables: {
    before: null,
    after: null,
    last: 7,
    first: null,
  },
  fragments: {
    activeChannel: () => Relay.QL`
      fragment on ActiveChannel {
        channelDetail{
          id
          title
        }
        channelEntries(last:$last, before:$before, first:$first, after:$after){
          pageInfo{
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
          edges {
            cursor
            node {
              id
              title
              content
              entry_type
              created_by{
                id
                email
              }
              created_at
            }
          }
        }   
      }
    `,
    store: () => Relay.QL`
      fragment on Store {
        loginInfo{
          success
          user_id
          email
        }  
      }
    `,
  },
});

export default ChannelContent;
