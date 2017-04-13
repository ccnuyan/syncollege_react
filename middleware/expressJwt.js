import epa from 'epa';
import expressJwt from 'express-jwt';

const config = epa.getEnvironment()._config; // eslint-disable-line

export default expressJwt({
  secret: config.auth.jwt.secret,
  credentialsRequired: false,
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
});
