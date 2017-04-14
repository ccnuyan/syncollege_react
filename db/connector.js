// import massivePostgres from 'massive';

import config from '../config';
import postgres from 'pg';

// export const massive = massivePostgres.loadSync(config.massive);
export const pg = new postgres.Pool(config.pg);
export default {
  pg,
};
