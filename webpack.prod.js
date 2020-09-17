const {merge} = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    module: {
        rules: [
            {test: /\.scss$/, exclude: /node_modules/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']}
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new OptimizeCssAssetsPlugin()
    ]
});
