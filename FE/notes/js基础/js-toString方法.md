## js-toString方法 ##

### toStringf方法何时会被调用

```javascript
// 借用网络demo
var obj = {
  toString:function(){
      console.log('toString')
      return Object.prototype.toString.call(this)
  },
  valueOf:function(){
      console.log('valueOf')
      return Object.prototype.valueOf.call(this)
  }
}
console.log(obj);
console.log(+obj); // 被触发
console.log(obj=={});
console.log(obj==={})
console.log(obj=='test') // 被触发
```
上述代码中可看出当存在一些隐式转换时toString和valueOf方法就会被触发。


### 面试题

如何实现 a==1&&a==2&&a=3，输出true

### 方法1改写object.toString方法

```javascript
const a = {
    value: 1,
    toString: function(){
        return a.value++
    }
}
console.log(a==1&&a==2&&a==3) // true
```

### 方法2使用Object.defineProperty
```javascript
let value = 0
Object.defineProperty(window,'a',{
    get: function(){
        return ++value
    }
})
console.log(a==1&&a==2&&a==3) // true
```
