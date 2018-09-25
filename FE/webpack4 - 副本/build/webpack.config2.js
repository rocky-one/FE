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
        publicPath: '/dist',
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
        new webpack.HotModuleReplacementPlugin(),
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
    ],
    devServer: {
        port: 8088,
        hot: true,
        open: true,
        contentBase: path.join(__dirname, '../dist'),
        publicPath: '/dist',
        openPage: 'dist/index.html', // 指定打开那个页面
        // historyApiFallback: {
        //     index: '/dist/index.html'
        // }
    }
}

module.exports = config;