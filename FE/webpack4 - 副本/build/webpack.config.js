const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
    entry:{
        app: path.join(__dirname, '../src/App.jsx')
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.join(__dirname, '../dist'),
        publicPath: '/public'
    },
    mode: 'development',
    module: {
        rules:[
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'app',
            filename: 'index.html',
            template: path.join(__dirname,'../src/index.html')
        }),
        new CleanWebpackPlugin([
            '../dist/*.*'
        ],{
            root: path.join(__dirname, '../dist') //必须配置root 否则无效
        })
    ]
}

module.exports = config;