const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');
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
        index: './src/index.js'
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve('./dist'),
    },
    devServer: {
        contentBase: './dist',
        port: 8088,
        compress: true, // 服务器压缩
        open: true,
        hot: true,
    },
    module: {},

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
            }
        ]
    },
    plugins: [
        LessExtract,
        CssExtract,
        // new ExtractTextWebpackPlugin({
        //     filename: 'css/index.css',
        //     disable: true,
        // }),
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin([
            './dist'
        ]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            title: '哈哈',
            hash: true,
            chunks: ['index'],
        }),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        })
    ],
}