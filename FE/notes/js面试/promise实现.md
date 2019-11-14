## promise实现 ##


### 第一步基础版 ###

先来规定一下状态码 0='PENDING', 1='FULFILLED', 2='REJECTED', 3 = promise
resolve方法执行的时候说明已结束并且后面then的回调应该开始执行了

```javascript

function resolve(self, newValue) {
  // 更改为成功的状态
  self.status = 1
  self._value = newValue
  self._deferreds.forEach(deferred => {
    deferred.onFulfilled(newValue)
  })
}
// reject同理
function reject(self, newValue) {
  // 更改为失败的状态
  self.status = 2
  self._value = newValue
  self._deferreds.forEach(deferred => {
    deferred.onRejected(newValue)
  })
}
  
class CopyPromise {
  constructor(fn) {
    this._value = null
    // 存放then回调的队列, 包括成功和失败的回调
    this._deferreds = []
    // 初始的状态是PENDING,当resolve执行后把状态改为2=FULFILLED
    this.status = 0
    // new的时候传过来的fn
    // 把resolve和reject传回给fn
    // 这里把resolve和reject包一层function是为了把this传到resolve方法里
    fn(
      (newValue) => resolve(this, newValue),
      (newValue) => reject(this, newValue)
    )
  }
  then = (onFulfilled, onRejected) => {
    // 调用then的时候先把onFulfilled, onRejected回调储存起来
    // 等到外部执行resolve的时候再去遍历这个队列,并且执行
    this._deferreds.push({
      onFulfilled,
      onRejected
    })
  }
}  
```
测试一下, ok执行下面的代码, 貌似是好的
```javascript
	const p = new CopyPromise(resolve=>{
		setTimeout(()=>{
			resolve(123)
		},500)
	})

	p.then(res=>{
		console.log(res,'res')
	})

```
但是其实有个问题,下面我们来修改一下代码再看效果

```javascript
const p = new CopyPromise(resolve=>{
  // 把之前这里的setTimeout删除了
	resolve(123)
})

p.then(res=>{
	console.log(res,'res')
})
```
上述代码的结果是then的回调没有执行。这是什么情况把setTimeout去了代码就不执行了?  
思考一下为什么?  
#### 先来分析一下代码的执行过程


1. new CopyPromise传的回调是同步执行的,也就是new的时候就执行,那么resolve是不是也跟着执行了
对的是这样的 但是此时then还没执行, 我们知道then主要是收集回调等待resolve调用的时候再去执行收集的那些回调方法, 
这么一来resolve先执行了,等到then收集完了回调, resolve就不会再执行了, 所以导致这里的回调没执行。

2. 怎么解决, 其实只要保证then先于 resolve执行就可以了,这也是Promise规范中规定 onFulfilled, onRejected 要在调用then的事件循环之后执行, 使用一个新的堆栈异步执行。那么依靠事件循环了处理就可以解决这个问题了,通俗一点就是把resolve放到事件循环中(例如setTimeout),让then有机会先执行去收集回调。

改造一下代码

```javascript
function resolve(self, newValue) {
  setTimeout(() => {
    self._value = newValue
    self._deferreds.forEach(deferred => {
      deferred.onFulfilled(newValue)
    })
  })
}
function reject(self, newValue) {
  setTimeout(() => {
    self._value = newValue
    self._deferreds.forEach(deferred => {
      deferred.onRejected(newValue)
    })
  })
}
```
ok!这样代码就能正常执行了



### 第二步then链式调用 ###


首先思考一下怎么实现这样的调用 promise.then(), 这个很容易想到只要promsie实例上有then方法就可以这样调用
那么promise.then().then(), 是不是说明promise.then()执行完后then()方法又返回了一个promise实例,这样就能链式调用了,
好先让then返回一个promise实例

```javascript
class CopyPromise {
  constructor(fn) {
    this._value = null
    this._deferreds = []
    this.status = 0
    fn((newValue) => resolve(this, newValue), (newValue) => reject(this, newValue))
  }
  // 让then返回一个promise实例以便于链式调用
  then = (onFulfilled, onRejected) => {
    const p = new CopyPromise(() => { })
    this._deferreds.push({
      onFulfilled,
      onRejected
    })
    return p
  }
}
```

测试一下链式调用

```javascript
const p = new CopyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(123)
  }, 1000)
})
p.then((res) => {
  console.log(res)
  return res
}).then(res => {
  console.log(res)
})
```
我们发现第二个then的回调没有执行,为什么?说好的链式调用那?

正常情况当调resolve的时候会执行then方法的回调,  
第一个then没问题,因为我们在new CopyPromise回调里执行了resolve,    
可是第二个then之前并没有调用resolve所以then回调就没有机会执行了, 思考一下这里怎么解决这个问题?


这里如果是链式调用需要我们在promise内部手动去调用resolve,那么在哪里调用这个resolve?


```javascript

class CopyPromise {
  constructor(fn) {
    this._value = null
    this._deferreds = []
    this.status = 0
    fn((newValue) => resolve(this, newValue), (newValue) => reject(this, newValue))
  }
  then = (onFulfilled, onRejected) => {
    const p = new CopyPromise(() => { })
    // 首先只有状态是0的时候需要往队列里添加回调
    if (this.status === 0) {
      // 这里把新的promise实例也存了起来,为链式调用准备
      this._deferreds.push({
        onFulfilled,
        onRejected,
        promise: p
      })
    }
    return p
  }
}
function resolve(self, newValue) {
  setTimeout(() => {
    self._value = newValue
    self._deferreds.forEach(deferred => {
      let res = deferred.onFulfilled(newValue)
      // 这里拿到then里面new的那个promise实例
      // 再调用resolve，这样形成一个递归调用，就能实现链式调用了
      // 参数deferred.promise: then里面new的那个promise实例
      // 参数res: then回调方法里return的值传
      // 思考一下，调用resolve相当于执行了下一个then收集的队列里的方法，如此链式调用就生效了。
      resolve(deferred.promise, res)
    })
  })
}

// 单独抽离handle方法,来处理then方法传的回调
// 参数说明self是当前promise,deferred是队列里的某一项{onFulfilled,onRejected,promise}
function handle(self, deferred) {
  // 根据当前状态执行不同的回调
  let cb = self.status === 1 ? deferred.onFulfilled : deferred.onRejected
  let res = cb(self._value)
  
  resolve(deferred.promise, res)

}
```
下面测试一下链式调用
```javascript
const p = new CopyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(123)
  }, 1000)

})
p.then((res) => {
  console.log(res, '1')
  return res
}).then(res => {
  console.log(res, '2')
})
```


### 第三部完善状态和错误处理 ###

先来设定一下状态码 0='PENDING', 1='FULFILLED', 2='REJECTED', 3 = promise