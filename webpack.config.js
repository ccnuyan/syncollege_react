const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');

const isDev = !process.argv.includes('-build');
// const isVerbose = process.argv.includes('--verbose');
// const isAnalyze = process.argv.includes('--analyze') || process.argv.includes('--analyse');

console.log('***************************************************');
console.log(`       webpacking in ${'DEBUG'} mode`);
console.log('***************************************************');

const devConfig = {
  name: 'client',
  target: 'web',
  entry: [
    'react-hot-loader/patch',
    // activate HMR for React

    'webpack-dev-server/client?http://localhost:8080',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    'react', // Include this to enforce order
    'react-dom', // Include this to enforce order
    'whatwg-fetch',
    'babel-polyfill', // this should be the last one to avoid unnessary error
    './src/client.js',
  ],

  output: {
    publicPath: 'http://localhost:8080/assets/',
    path: path.resolve(__dirname, './build/public/assets'),
    filename: '[name].js', // required
    chunkFilename: '[name].chunk.js',
  },

  // Don't attempt to continue if there are any errors.
  bail: false,
  cache: true,
  devtool: 'inline-source-map',

  devServer: {
    hot: true, // enable HMR on the server
    contentBase: path.resolve(__dirname, './build/public/assets'), // match the output path
    publicPath: 'http://localhost:8080/assets/', // https://webpack.js.org/configuration/dev-server/#devserver-publicpath-
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: path.join(__dirname, 'node_modules'),
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // CSS Loader https://github.com/webpack/css-loader
              importLoaders: 1,
              sourceMap: isDev,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: isDev
                ? '[name]-[local]-[hash:base64:5]'
                : '[hash:base64:5]',
              // CSS Nano http://cssnano.co/options/
              minimize: !isDev,
              discardComments: {
                removeAll: true,
              },
            },
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
          },
          {
            loader: 'postcss-loader',
            options: {
              config: './webpack/postcss.config.js',
            },
          },
        ],
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    // Define free variables
    // https://webpack.github.io/docs/list-of-plugins.html#defineplugin

    // new webpack.ProvidePlugin({
    //   '_': "lodash",
    //   React: "react",
    //   ReactDOM: "react-dom"
    // }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      'process.env.BROWSER': true,
      __DEV__: isDev,
    }),

    // Emit a file with assets paths
    // https://github.com/sporto/assets-webpack-plugin#options
    new AssetsPlugin({
      path: path.resolve(__dirname, './build'),
      filename: 'assets.json',
      prettyPrint: true,
    }),
    new webpack.HotModuleReplacementPlugin(), // enable HMR globally

    new webpack.NamedModulesPlugin(),
  // prints more readable module names in the browser console on HMR updates
  ],
};

module.exports = devConfig;
