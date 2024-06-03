## webpack打包机制 ##

1. 初始化，读取配置参数，实例化compiler对象，调用webpack()方法返回的就是compiler实例，加载plugin插件。
2. 根据入口文件解析，调用loader处理各个模块文件，loader执行顺序是自右往左。
3. 调用parse函数生成AST语法树。解析出依赖关系(dependencies)一个递归过程。生成一个依赖关系图，也就是依赖关系对象。
4. 根据依赖关系生成chunk代码块，文件输出，把文件写入到系统，打包过程结束。


#### hash变化问题
1. <p><code>Hash</code>：和整个项目的构建相关，只要项目文件有修改，整个项目构建的 hash 值就会更改</p>
2. <p><code>Chunkhash</code>：和 Webpack 打包的 chunk 有关，不同的 entry 会生出不同的 chunkhash</p>
3. <p><code>Contenthash</code>：根据文件内容来定义 hash，文件内容不变，则 contenthash 不变</p>

#### 预获取/预加载模块

Webpack v4.6.0+ 增加了对预获取和预加载的支持。

声明 import 时使用下列内置指令可以让 webpack 输出“Resource Hint”告知浏览器：

预获取（prefetch）：将来某些导航下可能需要的资源
预加载（preload）：当前导航下可能需要资源
试想一下下面的场景：现在有一个 HomePage 组件，该组件内部渲染了一个 LoginButton 组件，点击后按钮后可以按需加载 LoginModal 组件。

LoginButton.js

//...
import(/* webpackPrefetch: true */ './path/to/LoginModal.js');

#### async defer
可以使用html-webpack-plugin、script-ext-html-webpack-plugin插件来进行配置
对 <script> 标签添加 async，defer,module 属性，或者内联这些属性
plugins: [
  new HtmlWebpackPlugin(),
  new ScriptExtHtmlWebpackPlugin({
    defaultAttribute: 'async'
  })
] 

#### 懒加载
import(/* webpackChunkName: "print" */ './print').then(module => {
    const print = module.default;
    print();
  });


#### 打包优化
optimization: {
      splitChunks: {
        minSize: 0,
        cacheGroups: {
          // 抽取公用方法
          common: {
            name: 'common',
            chunks: 'all',
            minChunks: 2,
            priority: 10,
          },
          // 抽取第三方模块的公共库 
          vendor: {
            name: "vendor",
            chunks: "all",
            test: /[\\/]node_modules[\\/](react|react-dom|axios|react-router-dom)[\\/]/,
            minChunks: 1,
            priority: 20,
          }
        },
      },
    },

#### plugin
其中plugin阶段，compiler会在各个生命周期注册hooks，外面的plugin就可以去监听想要的生命周期，去做想做的事。

```
class Plugin {
  constructor(options) {
    validate(schema, options, { name: PluginName }) // 参数校验
    this.options = options
  }
  apply(compiler) {
    // afterCompile
    // compile
    // afterEmit
    // emit
    compiler.hooks.emit.tap(PluginName, (compilation) => {
      // 遍历参数，处理每组规则
      this.options.forEach((option) => {
        const { targetChunk, rules } = option
        const { namedChunks } = compilation
        // 遍历注入规则,进行文本替换/创建
        rules.forEach((rule) => {
          const { regex, injectChunk } = rule
          // 通过namedChunks.get可获取到输出的asset名
          const injectChunkFilename = namedChunks.get(injectChunk).files[0]
          const filename = namedChunks.get(targetChunk).files[0]
          // 对目标chunk的输出文本进行字符串替换
          const content = compilation.assets[filename]
            .source()
            .replace(regex, injectChunkFilename)
          // 最终改变目标chunk的输出对象
          compilation.assets[filename] = {
            source: () => content,
            size: () => content.length
          }
        })
      })
    })
  }
}
```

#### Loader和Plugin的区别

Loader：用于对模块源码的转换，loader描述了webpack如何处理非javascript模块，并且在build中引入这些依赖。loader可以将文件从不同的语言（如TypeScript）转换为JavaScript。
Plugin：目的在于解决loader无法实现的其他事，从打包优化和压缩，到重新定义环境变量，功能强大到可以用来处理各种各样的任务。

简而言之，loader可以理解成webpack的横向广度，有了loader，webpack才可以打包处理各种的扩展语言。而plugin可以理解为webpack的纵向深度，在生命周期内注入不同的插件来扩展更多的能力。

