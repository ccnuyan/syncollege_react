const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

const rules = require('./webpack/commonRules');

const config = {
  entry: {
    app: ['./src/app.js'],
    app1: ['./src/app1.js'],
    app2: ['./src/app2.js'],
    vendor: ['react', 'react-dom', 'react-router', 'react-relay', 'material-ui'],
  },
  target: 'web',
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, './build/assets/'),
    publicPath: '/assets/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new AssetsPlugin({
      path: path.resolve(__dirname, './build'),
      filename: 'assets.json',
      prettyPrint: true,
    }),
    new ExtractTextPlugin({
      filename: 'style.[hash].css',
    }),
    new UglifyJSPlugin({
      // beautify: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor', // Specify the common bundle's name.
    }),
  ],
  module: {
    rules,
  },
  externals: {
    // when setting react as a external lib, webpack won't build react into the bundle.
    // but as InjectTapEventPlugin require some react sub files, webpack don't know these files are external.
    // As a result it build these files into the bundle.
    // so when InjectTapEventPlugin run and register tap event to react.
    // It register into a standalone react env and tap event can't fire
    // so always pack react with your app together, unless their is a solution of this issue.

    'lodash': '_', // eslint-disable-line
    'socket.io-client': 'io', // eslint-disable-line

    // 'react': 'React', // eslint-disable-line
    // 'react-dom': 'ReactDOM', // eslint-disable-line
    // 'react-router': 'ReactRouter', // eslint-disable-line
    // 'react-relay': 'Relay', // eslint-disable-line

    // 'react-addons-transition-group': 'React.addons.TransitionGroup',
    // 'react-addons-pure-render-mixin': 'React.addons.PureRenderMixin',
    // 'react-addons-create-fragment': 'React.addons.createFragment',
    // 'react-addons-update': 'React.addons.update',
  },
};

module.exports = config;
