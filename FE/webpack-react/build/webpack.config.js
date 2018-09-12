const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');
const dev = process.env.NODE_ENV==='development';
const LessExtract = new ExtractTextWebpackPlugin({
    filename: 'style/less.css',
    disable: true, // 禁用 开发环境
})
const CssExtract = new ExtractTextWebpackPlugin({
    filename: 'style/css.css',
    disable: true, // 禁用 开发环境
})
const config = {
    entry: {
        clientEntry: path.resolve(__dirname, '../src/clientEntry.js'),
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/public'
    },
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
        LessExtract,
        CssExtract,
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin([
           '../dist/*.*'
        ],{
            root: path.join(__dirname, '../dist')
        }),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, '../src/*.html')),
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, '../src/index.html'),
            title: '哈哈',
            // hash: true,
            // chunks: ['index'],
            // inject: true
        }),
    ],
}
console.log(dev,'dev')
if(dev){
    config.devServer={
        contentBase: path.join(__dirname, '../dist'),
        port: 8089,
        compress: true, // 服务器压缩
        open: true,
        hot: true,
        overlay:{
            errors: true,
        },
        publicPath:'./public',
        historyApiFallback: {
            index: './public/index.html'
        }
    }
}
module.exports = config;