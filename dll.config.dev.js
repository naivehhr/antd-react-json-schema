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
    './src/Lib/go.js'
]

module.exports = {
    output: {
        path: path.resolve(__dirname, './dev'),
        filename: '[name].js',
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
            path: 'manifest.dev.json',
            name: '[name]',
            context: __dirname,
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