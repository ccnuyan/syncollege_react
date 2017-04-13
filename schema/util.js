import epa from 'epa';
import jwt from 'jsonwebtoken';

const config = epa.getEnvironment()._config;

// server
const setCookie = (req, res) => {
  const expiresIn = 60 * 60 * 24 * 180; // 180 days
  const token = jwt.sign(req.user, config.auth.jwt.secret, {
    expiresIn,
  });
  res.cookie(config.auth.cookie, token, {
    maxAge: 1000 * expiresIn,
    httpOnly: true,
  });
};

const clearCookie = (req, res) => {
  res.clearCookie(config.auth.cookie);
};

const getToken = (user) => {
  const expiresIn = 60 * 60 * 24 * 180; // 180 days
  const token = jwt.sign(user, config.auth.jwt.secret, {
    expiresIn,
  });
  return token;
};

export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  setCookie,
  clearCookie,
  getToken,
};
