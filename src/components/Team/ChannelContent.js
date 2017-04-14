import React, { Component, PropTypes } from 'react';  //eslint-disable-line
import Relay from 'react-relay';
import _ from 'lodash';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';

import withWidth, { SMALL, MEDIUM, LARGE } from 'material-ui/utils/withWidth'; // eslint-disable-line
import StylesProvider from '../Providers/StylesProvider';

import Message from './Message';

class ChannelContent extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    activeChannel: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    styles: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      entries: [],
    };
  }

  componentDidMount() {
    socket.on('send_message', (data) => {
      this.setState({
        entries: _.union(this.state.entries, [data]),
      });
    });
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
      entries: {
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
    socket.emit('send_message', body);
    this.messageText.input.value = '';
  }

  inputKeyPress = (event) => {
    if (event.charCode === 13) {
      this.sendMessage(event);
    }
  }

  render = () => {
    const entries = this.props.activeChannel.channelEntries.edges;
    const tempEntries = this.state.entries;
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
        <div style={ styles.entries }>
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
          {tempEntries.map((et) => {
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

ChannelContent = Relay.createContainer(StylesProvider(withWidth()(ChannelContent)), { //eslint-disable-line
  fragments: {
    activeChannel: () => Relay.QL`
      fragment on ActiveChannel {
        channelDetail{
          id
          title
        }
        channelEntries(first:20){
          edges {
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
