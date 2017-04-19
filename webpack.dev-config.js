const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');

const rules = require('./webpack/commonRules.js');

const config = {
  entry: {
    app: ['./src/app.js'],
    app1: ['./src/app1.js'],
    app2: ['./src/app2.js'],
    vendor: ['react', 'react-dom', 'react-router', 'react-relay', 'material-ui'],
  },
  target: 'web',
  output: {
    filename: '[name].js',
    publicPath: '//localhost:8080/assets/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new AssetsPlugin({
      path: path.resolve(__dirname, './build'),
      filename: 'assets.json',
      prettyPrint: true,
    }),
    new ExtractTextPlugin({
      filename: 'style.css',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor', // Specify the common bundle's name.
    }),
    new webpack.SourceMapDevToolPlugin(),
  ],
  module: {
    rules,
  },
  devServer: {
    contentBase: path.resolve(__dirname, './build/public/assets'), // match the output path
    publicPath: '//localhost:8080/assets/', // https://webpack.js.org/configuration/dev-server/#devserver-publicpath-
  },
};

module.exports = config;
