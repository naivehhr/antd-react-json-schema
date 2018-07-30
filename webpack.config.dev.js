var webpack = require("webpack");
var path = require("path");
let HtmlWebpackPlugin = require('html-webpack-plugin');

const targetUrl = `http://10.20.69.244:8300`
// const targetUrl = `http://10.20.88.89:8080`
module.exports = {
  entry: {
    app: './src/index.js',
    // appuser: './src/index-user.js',
  },
  output: {
    path: path.resolve(__dirname, './dev'),
    publicPath: "/dev",
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/, loader: 'babel-loader', options: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?importLoaders=1!postcss-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!postcss-loader!sass-loader'
      },
      { test: /\.(png|jpg)$/, loaders: ['url-loader?limit=1000&name=img/[hash:8].[name].[ext]'] }
    ]
  },
  resolve: {
    modules: [path.join(__dirname, './src'), path.join(__dirname, './node_modules')],
    extensions: ['.web.js', '.js', '.json'],
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.dev.json'),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify("development")
    }),
  ],
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    inline: true,
    host: "0.0.0.0",
    port: "9998",
    proxy : [
      {
        context: ['**/enterprise-web-oapi/**'],
        target : targetUrl,
        logLevel : 'debug',
        secure :  false,
        changeOrigin: true,
        pathRewrite: function(path) {
          return path;
        }
      },
      {
        context: ['**/routerserver/**'],
        target : 'http://10.20.88.77:9527/',
        logLevel : 'debug',
        secure :  false,
        changeOrigin: true,
        pathRewrite: function(path) {
          return path.replace('/routerserver', '');
        }
      }
    ]
  },
};
