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
        serverEntry: path.resolve(__dirname, '../src/serverEntry.js'),
    },
    mode: 'development',
    output: {
        filename: 'serverEntry.js', 
        path: path.resolve(__dirname, '../dist'),
        publicPath:'',
        libraryTarget: 'commonjs2', 
    },
    module: {
        rules: [
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