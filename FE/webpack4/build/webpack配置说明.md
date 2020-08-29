## webpack ##

#### publicPath ####

#### 1. output.publicPath: ####

 打包后html文件中引用的文件的路径

例如：putput.publicPaht: '/dist';

html中script引用文件结果: src = '/dist' + loader配置的文件的路径;
html中css引用文件结果: href='/dist' + loader配置的文件的路径;
css中图片路径结果: url = '/dist' + loader配置的文件的路径(images/*.png);

#### 1. devServer.publicPath: ####

打包的文件是放到内存中的

例如：devServer.publicPaht: '/dist';

结果: path = '/dist'; 通过 http://lcoalhost:8080/dist/index.html 访问到文件


## plugin ##

- HotModuleReplacementPlugin 热替换

- HtmlWebpackPlugin html模板处理

- progress-bar-webpack-plugin 显示打包时间

- happypack 多进程打包

- DllPlugin 打包第三方依赖

- DllReferencePlugin 配置中引入DllPlugin打包好的文件

- purify-css purifycss-webpack 去除无用css

- html-withimg-loader 处理html中引用图片打包问题

- file-loader 处理文件 css中的图片 js中的引入图片

- url-loader 处理文件 对图片大小限制 例如小于100k按照base64处理