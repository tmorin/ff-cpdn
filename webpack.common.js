const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const pkg = require('./package.json');

module.exports = {
    entry: {
        'tab-cleaner': './src/tab-cleaner.ts',
        'popup': './src/popup.tsx',
        'options': './src/options.tsx'
    },
    output: {
        path: path.resolve(__dirname, 'public/'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {test: /\.tsx?$/, exclude: /node_modules/, loader: ['ts-loader']},
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
            {from: 'src', force: true, ignore: ['*.js', '*.jsx', '*.ts', '*.tsx', '*.scss', '*.ejs']},
        ]),
        new HtmlWebpackPlugin({
            filename: 'options.tsx.html',
            template: 'src/options.ejs',
            pkg: pkg,
            chunks: ['options.tsx'],
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
