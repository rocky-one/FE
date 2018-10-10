const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');

module.exports = {
    target: 'node',
    entry: {
        serverEntry: path.resolve(__dirname, '../src/serverEntry.jsx'),
    },
    mode: 'development',
    output: {
        filename: 'serverEntry.js',
        path: path.resolve(__dirname, '../dist'),
        publicPath:'http://localhost:8089/public',
        libraryTarget: 'commonjs2',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.less'],
    },
    externals: Object.keys(require('../package.json').dependencies),
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|jsx)$/,
                exclude:[
                    path.resolve(__dirname,'../node_modules')
                ],
                use: [
                    {
                        loader: 'eslint-loader',

                    }
                ]
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
