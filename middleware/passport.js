import passport from 'passport';

import { Strategy as BearerStrategy } from 'passport-http-bearer';

const init = (pool) => {
  passport.use(new BearerStrategy(
    (token, done) => {
      pool.query('select * from authenticate_by_token($1)', [token])
        .then((res) => {
          if (res.rows[0].success) {
            done(null, res.rows[0]);
          } else {
            done('not authenticated');
          }
        })
        .catch(err => done(err));
    },
  ));
  console.log('BearerStrategy strategy initialized');
  return passport;
};

export default init;
