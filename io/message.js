/* API
// sending to sender-client only
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.in('game').emit('message', 'cool game');

// sending to sender client, only if they are in 'game' room(channel)
socket.to('game').emit('message', 'enjoy the game');

// sending to all clients in namespace 'myNamespace', include sender
io.of('myNamespace').emit('message', 'gg');

// sending to individual socketid
socket.broadcast.to(socketid).emit('message', 'for your eyes only')
*/

import { Timestamp } from 'mongodb';
import member from '../db/services/member';

export default (io, mPool, pPool) => {
  io.sockets.on('connection', (socket) => {
    socket.on('join_channel', (event) => {
      console.log({ // eslint-disable-line
        join_channel: event,
        join_at: Date.now(),
      });

      socket.join(event.channel);

      io.in(event.channel).emit('message', {
        event: 'join_channel',
        user: event.user,
      });

      socket.emit('join_channel_callback', {
        success: true,
        channel: event.channel,
      });
    });

    socket.on('leave_channel', (event) => {
      console.log({ // eslint-disable-line
        leave_channel: event,
        leave_at: Date.now(),
      });
      socket.leave(event.channel);
    });

    socket.on('send_message', async (event) => {
      event.created_at = new Timestamp(); //eslint-disable-line
      const message = (await mPool.collection('entries').insert(event)).ops[0];
      message.created_by = (await member.get_member_by_id(pPool, {
        id: message.created_by,
      })).rows[0];
      const entry = {
        id: message._id, //eslint-disable-line
        title: message.title,
        content: message.content,
        created_by: message.created_by,
        created_at: message.created_at,
        entry_type: message.entry_type,
      };
      io.in(event.channel_id).emit('send_message', entry);
    });
  });
};
