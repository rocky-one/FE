## call,apply,bind区别 ##

首先call、apply、bind这几个方法都来自于 Function.prototpye。

```javascript
console.log(Function.prototpye.hasOwnProperty('call')) // 打印 true

```

对象、函数、数组都继承于Function.prototype，所以他们都可以用call、apply、bind这三个方法。

三个方法都可以用来改变this的指向。

不同点：
1. call,apply,bind的第一个参数都是要将某个方法或对象绑定为目标对象的this，第一个参数就是这个目标，如果第一个参数传null则this指向全局。

2. call,bind参数是单个传入，apply是放到数组中传递。

3. call,apply调用后会立即执行函数，bind调用后会返回一个函数，需要再次执行一下。