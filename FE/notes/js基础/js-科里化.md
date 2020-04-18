## js-科里化 ##

### 什么是科里化？
科里化是把多个参数的函数转换成接受一个参数的函数，并且返回一个函数让这个函数处理剩下的参数。

### 使用场景

#### 1.延迟计算
```javascript
const add = (...args) => args.reduce((a, b) => a + b)

function currying(func) {
    const args = []
    return function result(...rest) {
        if (rest.length === 0) {
          return func(...args)
        } else {
            args.push(...rest)
            return result 
        }
    }
}

const sum = currying(add)
sum(1)(2)(3)(4) // 这里并没有真正的计算
let s = sum() // 这里才是计算
console.log(s)
```

#### 2.动态创建函数时，或者说提前计算，后续就不需要再次计算了

```javascript
const addEvent = (function(){
    if (window.addEventListener) {
        return function (type, el, fn, capture) {
            el.addEventListener(type, fn, capture);
        }
    }
    else if(window.attachEvent){
        return function (type, el, fn) {
            el.attachEvent('on' + type, fn);
        }
    }
})()
// 后面直接使用addEvent的时候就不需要在判断浏览器处理兼容性问题了
```

#### 3.参数复用

```javascript

function currying(fn) {
    const args = [].slice.call(arguments, 1);
    return function () {
       let args2 = args.concat([].slice.call(arguments))
       return fn.apply(null, args2)
    }
}

function doSoming(){
  // 这里可以拿到复用的参数 和 当前的argumens
  console.log([].slice.call(arguments))
}
const getParams = currying(doSoming,'我是复用的参数')

getParams('参数1','参数2')
getParams('参数11')
```