const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {test: /\.scss$/, exclude: /node_modules/, use: ['style-loader', 'css-loader', 'sass-loader']}
        ]
    },
    devServer: {
        contentBase: [
            './src',
            './node_modules/leaflet/dist'
        ],
        https: true,
        open: true,
        noInfo: false,
        inline: true,
        host: '0.0.0.0',
        port: 3000
    }
});
