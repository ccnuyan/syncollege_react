// import massivePostgres from 'massive';
import epa from 'epa';
import postgres from 'pg';

const config = epa.getEnvironment()._config; // eslint-disable-line
// export const massive = massivePostgres.loadSync(config.massive);
export const pg = new postgres.Pool(config.pg);
export default {
  pg,
};
