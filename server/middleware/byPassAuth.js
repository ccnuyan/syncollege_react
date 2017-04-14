export default (pPool) => {
  return async (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.length < 8) {
      next();
    } else {
      const bearerToken = req.headers.authorization.substring(7);
      try {
        await pPool.query('select * from membership.authenticate_by_token($1)', [bearerToken])
          .then((pres) => {
            const ret = pres.rows[0];
            if (ret.success) {
              req.user = ret; // eslint-disable-line
              req.user.id = ret.return_id; // eslint-disable-line
            }
            return req.user;
          });
      } finally {
        next();
      }
    }
  };
};
