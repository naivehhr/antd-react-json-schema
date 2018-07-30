var webpack = require("webpack");
var path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const directoryToSearch = path.resolve("dist");
const targetUrl = `http://10.20.69.244:8300`

module.exports = {
  entry: {
    app: './src/index.js',
    // appuser: './src/index-user.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: "/",
    filename: "[name]-[hash:8].js",
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
    extensions: ['.web.js', '.js', '.json']
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.json'),
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify("production")
    }),
    new HtmlWebpackPlugin({
      title: '供应链金融策略平台',
      filename: 'index.html',
      template: 'index-tlp.html',
      inject: true,
    }),
    new HtmlWebpackIncludeAssetsPlugin({ 
      assets: [{
        path: '', glob: '*.js'
      }], 
      append: false,
      files: ['index.html']
    })
  ],
}