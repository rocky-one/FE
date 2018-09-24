## babel ##

1. babel-cli 命令行下编译
2. babel-core 代码的方式进行编译

#### 所需依赖: ####
1. @babel/core
2. @babel/preset-env
3. @babel/polyfill
4. @babel/preset-react

#### babel-core作用: ####
把最新的js语法 编译成浏览器都支持的语法,要注意的是babel只是编译最新的js的语法。例如class 箭头函数,对应新的api比如set、map这种是不做转译的。这个时候要用到 @babel/polyfill。
#### @babel/preset-env作用: ####
用来配置我们当前支持的环境或者说支持的语法的阶段,比如之前使用babel-preset-es2015, babel-preset-es2016, babel-preset-es2017 去转译,现在只用babel/preset-env就可以了, 

babel-runtime | babel-polyfill | babel-preset-env 可以相互替换。 babel-preset-env包括了语法的转译功能,基于你的实际浏览器及运行环境，自动的确定babel插件及polyfill

#### @babel/preset-react作用: ####
转译react 语法
