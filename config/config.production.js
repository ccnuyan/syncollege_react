export default {
  title: 'Syncollege',
  port: 3000,
  massive: {
    connectionString: 'postgres://postgres:admin@localhost:32768/syncollege',
  },
  mongo: {
    url: 'mongodb://localhost:27017/syncollege',
  },
  auth: {
    jwt: {
      secret: '12345678',
    },
    cookie: 'id_token',
  },
  pg: {
    user: 'postgres',
    database: 'syncollege',
    password: 'admin',
    host: 'localhost',
    port: 32768,
    max: 10,
    idleTimeoutMillis: 30000,
  },
  socket: {
    port: 4000,
  },
  cdnScripts: {
    lodash: '//cdn.bootcss.com/lodash.js/4.17.4/lodash.min.js',
    socketIo: '//cdn.bootcss.com/socket.io/1.7.3/socket.io.min.js',
    // react: '//cdn.bootcss.com/react/15.5.4/react-with-addons.js',
    // reactDom: '//cdn.bootcss.com/react/15.5.4/react-dom.js',
    // reactRouter: '//cdn.bootcss.com/react-router/3.0.0/ReactRouter.min.js',
    // reactRelay: '//cdn.bootcss.com/react-relay/0.10.0/relay.min.js',
  },
};
