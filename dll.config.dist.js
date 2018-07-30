const webpack = require('webpack');
const path = require("path");

const vendors = [
  'babel-polyfill',
  'react',
  'react-dom',
  'react-router',
  'antd',
  'cookie.js',
  'superagent',
  'md5',
  'antd/dist/antd.min.css',
  './src/Lib/go.js'
]

module.exports = {
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name]-[hash:8].js',
    library: '[name]',
  },
  entry: {
    "lib": vendors,
  },
  module: {
    rules: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
    ]
  },
  plugins: [
    new webpack.DllPlugin({
      path: 'manifest.json',
      name: '[name]',
      context: __dirname,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify("production")
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      }
    })
  ]
}