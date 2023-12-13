## nextTick和Computed实现原理 ##

* nextTick本质是还是利用时间循环让代码异步执行。

```javascript
    if(Promise){

    }else if(MutationOberver){

    // setImmediate IE和高版本chorme
    }else if(setImmediate){

    }else {
        setTimeout
    }
```

* Computed和watch 都是通过Watcher实现的，Computed是有缓存的

```javascript
var vm = new Vue({
  data: { a: 1 },
  computed: {
    // 仅读取
    aDouble: function () {
      return this.a * 2
    },
    // 读取和设置
    aPlus: {
      get: function () {
        return this.a + 1
      },
      set: function (v) {
        this.a = v - 1
      }
    }
  }
})
```

computed New watcher的时候传的是lazy，不计算，等到在页面取值的时候才计算。
然后下一次计算是在依赖的值变化的时候再计算，比如上面代码this.a = 100，这个时候computed会重新计算。
那么怎么做到自动计算的，就是在页面取值的时候（触发getter）做依赖收集，等到set的时候触发刚刚收集的观察者。和数据劫持一样。
缓存是怎么实现的，根据依赖的data是否变化如果变化就把dirty变为true需要重新计算也就是重新执行上面aDouble方法。

this.dirty = lazy = true; 这个就是是否要计算的标记


