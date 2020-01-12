## this相关题目 ##


```javascript
var a = 123
const foo = () => a => {
    console.log(this.a)
}
const obj1= {
    a: 2
}
const obj2= {
    a: 3
}
// 普通函数和箭头函数的this总是指向词法作用域
// 词法作用域在定义时确定，并不会随着方法运行环境的不同而改变
// 但是普通函数的this可以通过call去显式的改变，箭头函数则不可以
// 所以这里打印结果是123，定义时就决定了foo的作用域，并且call不能改变箭头函数的词法作用域
var bar = foo.call(obj1)
bar.call(obj2)

```
把var 换成 const 打印结果是undefined
因为const let声明的变量不会被挂载到window全局对象中
```javascript
const a = 123
const foo = () => a => {
    console.log(this.a)
}
const obj1= {
    a: 2
}
const obj2= {
    a: 3
}
var bar = foo.call(obj1)
bar.call(obj2)

```
