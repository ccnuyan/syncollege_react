import { pg } from '../../connector';
import builder from '../../lib/builder';

function Helpers() {
  // load up the schema file and run it
  const sql = builder.readSql();
  this.initDb = async () => {
    let pool = null;
    try {
      // drop all the user records
      // this will cascade to everything else
      // the only time this will fail is on very first run
      // otherwise the DB should always be there
      pool = await pg.connect();
      await pool.query('delete from membership.users');
      await pool.query(sql);
    // now load up whatever SQL we want to run
    } catch (err) {
      console.log(err); // eslint-disable-line no-console
    }
    // return a new Massive instance
    return pool;
  };
}

export default Helpers;
