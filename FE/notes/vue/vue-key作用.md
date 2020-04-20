## vue-key作用 ##

* 在做diff对比时用，主要是dom复用
例如不给key或者把索引当作key
```javascript
<div key="0">a</div>
<div key="1">b</div>
<div key="2">c</div>
// 此时key是索引，当我删除第一个节点时，结果会是下面这样
<div key="0">a</div>
<div key="1">b</div>
```
因为在做diff对比时发现0，1的可以是一样的，就复用节点，最后一个key不一样就把最后一个c节点删除了


* vue中data为什么是一个函数
因为data是在原型链中，当每创建一个相同的组件时数据会共享，如果data是一个对象那么每个组件的data就会相互影响，所以把data设置成一个函数并且返回一个对象。

```javascript
VueComponent.prototype.$options = {
  data: function() {
    
  }
}
```

