import socketIO from 'socket.io';
import message from '../../io/message';

export default function (server, mPool, pPool) {
  const io = socketIO(server);
  message(io, mPool, pPool);
}

