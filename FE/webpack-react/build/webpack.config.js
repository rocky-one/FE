const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    entry:{
        index: '../src/index.js'
    },
    output:{
        filename:'[name].[hash:8].js',
        path: path.resolve('../dist'),
    },
    devServer:{
        contentBase: '../dist',
        port: 8088,
        compress: true, // 服务器压缩
        open: true,
        hot: true,
    },
    module:{},
    plugins:[
        new CleanWebpackPlugin([
            '../dist'
        ]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: '../src/index.html',
            title: '哈哈',
            hash: true,
            chunks:['index'],

        })
    ],
    mode: 'development',
    resolve:{},
}