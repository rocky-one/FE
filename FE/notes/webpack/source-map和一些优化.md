## 多页面打包 ##

```javascript
module.exports =  {
    mode: 'development',
    entry: {
        index: './index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        // webpack将不再去解析这里的包，提高打包效率
        noParse: /jquery|lodash/,
        // 排除
        exclude: /node_modules/,
        // 包含
        include: /src/,
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'bable-loader',
                    options: {
                        presets: ['@bable/preset-env']
                    }
                }
            }
        ]
    },
    // 增加映射配置，会产生单独的map文件 报错的具体位置 比较全面
    devtool: 'source-map',

    // 不会产生单独map文件， 可以显示具体报错位置
    devtool: 'eval-source-map',

    // 不会产生单独map文件， 集成到打包的文件中  不会有列的提示
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html'
        }),
        // 忽略文件 减少打包后的体积 webpack自带的
        // 如果moment里引用里local, loacl是所有的语言包，我们不需要所有的 这里直接忽略
        // 然后手动去引用需要的语言包
        new webpack.IgnorePlugin(/\.\/local/, /moment/)
    ]
}
```