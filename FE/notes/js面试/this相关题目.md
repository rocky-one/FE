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
// 箭头函数的 this 永远指向其上下文的 this ，任何方法都改变不了其指向，如 call() , bind() , apply()
// 普通函数的this指向调用它的那个对象。
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
