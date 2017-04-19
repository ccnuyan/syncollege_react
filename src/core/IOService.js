import io from 'socket.io-client';

class IOService {

  constructor(url) {
    this.socket = io(url);

    this.socket.on('send_message', (data) => {
      this.messageReceived(data);
      this.logger(data);
    });
  }

  logger = (data) => {
    console.log(data);
  }

  joinChannel = ({ oldChannelId, newChannelId }) => {
    if (oldChannelId === newChannelId) {
      return;
    }
    if (oldChannelId && oldChannelId !== '0') {
      this.socket.emit('leave_channel', {
        channel: oldChannelId,
      });
    }
    this.socket.emit('join_channel', {
      channel: newChannelId,
    });
  }

  sendMessage = ({ content, entry_type, channel_id, created_by }) => {
    const body = {
      content,
      entry_type,
      channel_id,
      created_by,
    };
    this.socket.emit('send_message', body);
  }

  messageReceived = () => {
    console.log('messageReceived not linked yet');
  }
}

export default IOService;
