const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');

// const isVerbose = process.argv.includes('--verbose');
// const isAnalyze = process.argv.includes('--analyze') || process.argv.includes('--analyse');

console.log('***************************************************');
console.log(`       webpacking in ${'RELEASE'} mode`);
console.log('***************************************************');

const buildConfig = {
  name: 'client',
  target: 'web',
  entry: [
    'react', // Include this to enforce order
    'react-dom', // Include this to enforce order
    'whatwg-fetch',
    'babel-polyfill', // this should be the last one to avoid unnessary error
    './src/client.js',
  ],

  output: {
    publicPath: '/assets/',
    path: path.resolve(__dirname, './build/public/assets'),
    filename: '[name].[hash:8].js', // required
    chunkFilename: '[name].[hash:8].chunk.js',
  },

  // Don't attempt to continue if there are any errors.
  bail: true,
  cache: false,
  devtool: false,

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
              sourceMap: false,
              // CSS Modules https://github.com/css-modules/css-modules
              modules: true,
              localIdentName: '[name]-[local]-[hash:base64:5]',
              // CSS Nano http://cssnano.co/options/
              minimize: true,
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'process.env.BROWSER': true,
      __DEV__: false,
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: false,
      },
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

module.exports = buildConfig;
