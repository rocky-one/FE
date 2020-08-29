## vue-key作用 ##

* 在做diff对比时用，主要是dom复用
例如不给key或者把索引当作key
```javascript
// 注意此demo只是示意，需要每个节点有自己的状态
<div key="0">a</div>
<div key="1">b</div>
<div key="2">c</div>
// 此时key是索引，当我删除第一个节点时，结果会是下面这样
<div key="0">a</div>
<div key="1">b</div>
```
因为在做diff对比时发现0，1的标签是一样的，就复用节点，最后一个key不一样就把最后一个c节点删除了


* vue中data为什么是一个函数
因为data是在原型链中，当每创建一个相同的组件时数据会共享，如果data是一个对象那么每个组件的data就会相互影响，所以把data设置成一个函数并且返回一个对象。

```javascript
VueComponent.prototype.$options = {
  data: function() {
    
  }
}
```

* vue-html会导致什么问题
1. xss攻击

```javascript
<input type="text" v-mode="value">
<div v-html="value"></div>

export default {
  data() {
    return {
      value: ""
    }
  }
}
```

* vue父子组件嵌套时渲染顺序
1. 父beforeCreate => 父created => 父beforeMount => 子beforeCreate => 子created => 子beforeMount => 子mounted => 父mounted
* 子组件更新
1. 父beforeUpdate => 子beforeUpdate => 子updated => 父updated 

* 插槽和作用域插槽

* 优化
1. 数据不要都放data，减少setter，getter的绑定，可以object.freeze冻结这样就劫持不了了。
2. 拆分代码，尽量细粒度，这样能精确定位到哪个组件是否要render
3. 异步加载组件
4. 虚拟滚动优化

