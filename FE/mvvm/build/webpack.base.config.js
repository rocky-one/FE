
var webpack = require('webpack');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var path = require('path');
var { vendor } = require('./constBase.js');
var setConfig = function (dll, processEnv, entryName) {
    var config = {
        entry: {
            mvvm: path.resolve(__dirname, '../src/index.js'),
        },
        mode: processEnv,
        output: {
            path: path.resolve(__dirname, '../dist'),
            publicPath: '',
            filename: 'js/[name].[hash:8].js',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.less'],
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    use: {
                        loader: 'babel-loader?cacheDirectory',
                        options: {
                            presets: ['@babel/preset-env', "@babel/preset-react"],
                        }
                    }
                },
            ]
        },

        plugins: [
            
        ],

    };
    return config;
}

module.exports = setConfig;
