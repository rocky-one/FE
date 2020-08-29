## dllPlugin ##

### 打包第三方包配置
```javascript
module.exports =  {
    mode: 'development',
    entry: {
        react: ['react', 'react-dom']
    },
    output: {
        filename: 'dll_[name].js',
        path: path.resolve(__dirname, 'dist'),
        // 模块的变量名 其中会包括多个模块
        library: 'dll_[name]'
    },
    plugins: [
       new webpack.DllPlugin({
           name: 'dll_[name]',
           path: path.resolve(__dirname, 'dist', 'manifest.json')
       })
    ]
}
```

### 打包配置

```javascript
module.exports =  {
    mode: 'development',
    entry: {
        index: './index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
       new webpack.DllReferencePlugin({
           manifest: path.resolve(__dirname, 'dist', 'manifest.json')
       })
    ]
}
```