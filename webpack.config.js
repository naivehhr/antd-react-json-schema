var webpack = require("webpack");
var path = require("path");
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app : './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: "/dist",
    filename: "[name].js"
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader',options: {
        presets:  ['es2015', 'react','stage-0']}
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader?sourceMap' },
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
      manifest: require('./manifest.json'),
    }),
    new HtmlWebpackPlugin({
      template: './temp.html'
    })
  ],
  devServer: {
    // contentBase: "./dist",
    historyApiFallback: true,
    inline: true,
    proxy : {
      '/api/*' : {
        target : "http://baidu.com",
        logLevel : 'debug',
        secure :  false,
        changeOrigin: true
      }
    }
  },
};
