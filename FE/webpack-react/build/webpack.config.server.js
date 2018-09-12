const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');
// rimraf 移除文件包
const LessExtract = new ExtractTextWebpackPlugin({
    filename: 'style/less.css',
    disable: true, // 禁用 开发环境
})
const CssExtract = new ExtractTextWebpackPlugin({
    filename: 'style/css.css',
    disable: true, // 禁用 开发环境
})
module.exports = {
    entry: {
        serverEntry: path.resolve(__dirname, '../src/serverEntry.js'),
    },
    output: {
        filename: '[name].js', //.[hash:8]
        path: path.resolve(__dirname, '../dist'),
        publicPath:'/public',
        libraryTarget: 'commonjs2', 
    },
    // devServer: {
    //     contentBase: path.join(__dirname, '../dist'),
    //     port: 8088,
    //     compress: true, // 服务器压缩
    //     open: true,
    //     hot: true,
    // },
    resolve: {
        extensions: ['.js', '.jsx', '.less'],
    },
    mode: 'development',
    resolve: {},
    module: {
        rules: [
            {
                test: /\.css$/,
                use: CssExtract.extract({
                    fallback: 'style-loader', // 开发环境
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'postcss-loader'
                        }
                    ]
                })
            },
            {
                test: /\.less$/,
                use: LessExtract.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'less-loader'
                        }
                    ]
                })
            },
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets:['@babel/preset-env','@babel/preset-react'],
                        } 
                    }
                ]
            }
        ]
    },
    plugins: [
       
    ],
}