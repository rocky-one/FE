## webpack打包机制 ##

1. 初始化，读取配置参数，实例化compiler对象，调用webpack()方法返回的就是compiler实例，加载plugin插件。
2. 根据入口文件解析，调用loader处理各个模块文件，loader执行顺序是自右往左。
3. 调用parse函数生成AST语法树。解析出依赖关系(dependencies)一个递归过程。生成一个依赖关系图，也就是依赖关系对象。
4. 根据依赖关系生成chunk代码块，文件输出，把文件写入到系统，打包过程结束。

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
