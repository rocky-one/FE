## webpack ##

#### publicPath ####

#### 1. output.publicPath: ####

 打包后html文件中引用的文件的路径

例如：putput.publicPaht: '/dist';

结果: src = '/dist' + loader配置的文件的路径;

#### 1. devServer.publicPath: ####

打包的文件是放到内存中的

例如：devServer.publicPaht: '/dist';

结果: path = '/dist'; 通过 http://lcoalhost:8080/dist/index.html 访问到文件

