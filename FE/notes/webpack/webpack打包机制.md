## webpack打包机制 ##

1. 生成compiler对象，根据webpack配置先注册一些插件。
2. 根据入口文件解析，调用loader。loader执行顺序是自右往左。
3. parse阶段生成AST语法树。解析出依赖关系(dependencies)一个递归过程。生成一个依赖关系图，也就是依赖关系对象。
4. plugin阶段，compler类会在各个生命周期注册hooks，外面的plugin就可以去监听想要的生命周期，去做想做的事。
5. 生成chunk代码块，文件输出，打包过程结束。