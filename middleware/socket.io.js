import socketIO from 'socket.io';
import epa from 'epa';

import message from '../io/message';

const config = epa.getEnvironment()._config; // eslint-disable-line

export default function (server, mPool, pPool) {
  const io = socketIO(server);
  message(io, mPool, pPool);
}

