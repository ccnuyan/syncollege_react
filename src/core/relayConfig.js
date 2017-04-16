import Relay from 'react-relay';
import { RelayNetworkLayer, retryMiddleware, urlMiddleware, authMiddleware } from 'react-relay-network-layer';

import { getLocalToken } from './util';

// https://github.com/nodkz/react-relay-network-layer

const refresh = () => {
  Relay.injectNetworkLayer(new RelayNetworkLayer([
    urlMiddleware({
      url: () => '/graphql',
    }),
    // loggerMiddleware(),
    // gqErrorsMiddleware(),
    // perfMiddleware(),
    retryMiddleware({
      fetchTimeout: 15000,

      retryDelays: attempt => (2 ** (attempt + 4)) * 100,
      // or simple array [3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600],

      forceRetry: (cb, delay) => {
        window.forceRelayRetry = cb;
        console.log(`call forceRelayRetry() for immediately retry! Or wait ${delay} ms.`); // eslint-disable-line no-console
      },
      statusCodes: [500, 503, 504],
    }),
    authMiddleware({
      token: () => getLocalToken(),

    // this promise will be called if server returns 401 status code
    // and made implicitly for Relay re-request with new token to GraphQL server
    // tokenRefreshPromise: (req) => {
    //   console.log('[client.js] resolve token refresh', req);
    //   return fetch('/jwt/refresh')
    //     .then(res => res.json())
    //     .then(json => {
    //       const token = json.token;
    //       localStorage.setItem('id_token', token);
    //       return token;
    //     })
    //     .catch(err => console.log('[client.js] ERROR can not refresh token', err));
    // },
    }),
  ]));
};

export default {
  refresh,
};
