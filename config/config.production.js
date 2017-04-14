export default {
  cdnScripts: {
    react: '//cdn.bootcss.com/react/15.5.4/react.js',
    'react-dom': 'https://cdn.bootcss.com/react/15.5.4/react-dom.js',
  },
  title: 'Syncollege',
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
  port: 3000,
};
