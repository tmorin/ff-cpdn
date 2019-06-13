const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const pkg = require('./package.json');

module.exports = {
    entry: {
        'tab-cleaner': './src/tab-cleaner.js',
        'popup': './src/popup.jsx',
        'options': './src/options.jsx'
    },
    output: {
        path: path.resolve(__dirname, 'public/'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {test: /\.jsx?$/, exclude: /node_modules/, loader: ['babel-loader']},
            {test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=1000'},
            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=1000&mimetype=application/font-woff'},
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=1000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=1000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=1000'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=1000&mimetype=image/svg+xml'},
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {from: 'src', force: true, ignore: ['*.js', '*.jsx', '*.scss', '*.ejs']},
        ]),
        new HtmlWebpackPlugin({
            filename: 'options.html',
            template: 'src/options.ejs',
            pkg: pkg,
            chunks: ['options'],
            hash: true
        }),
        new HtmlWebpackPlugin({
            filename: 'popup.html',
            template: 'src/popup.ejs',
            pkg: pkg,
            chunks: ['popup'],
            hash: true
        })
    ]
};
