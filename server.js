import express from 'express';
import http from 'http';
import epa from 'epa';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';

import { pg } from './db/connector';
import generateGraphqlSchema from './server/generateGraphqlSchema';
import graphql from './middleware/graphql';

import byPassAuth from './middleware/byPassAuth';
import renderer from './middleware/renderer';
import io from './middleware/socket.io';
import cors from './middleware/cors';

import initdb from './db/init';

/* rotate the console. */
const lines = process.stdout.getWindowSize()[1];
for (let i = 0; i < lines; i += 1) {
  console.log('\r\n');
}
/* rotate the console. */

console.log(`Runnig in ${epa.getEnvironment().get('NODE_ENV')} mode...`);

const config = epa.getEnvironment()._config;

const app = express();
const server = http.createServer(app);

(async () => {
  try {
    const pPool = await pg.connect();
    const mPool = await MongoClient.connect(config.mongo.url);

    initdb(pPool, mPool);

    app.use(express.static('./build/public'));
    app.use(express.static('./public'));

    app.use(cors('*'));

    app.use(bodyParser.json());

    app.use('/graphql', byPassAuth(pPool));
    app.use('/graphql', graphql({
      mPool,
      pPool,
    }));

    app.get('/*', renderer);

    io(server, mPool, pPool);

    await generateGraphqlSchema();

    const PORT = process.env.PORT || config.port || 3000;
    server.listen(PORT, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log(`server is listening on port ${PORT}`);
      console.log('************');
      return 0;
    });
  } catch (err) {
    console.log(err);
  }
})();
