## promise实现原理 ##

### 说明 ###

本篇文章主要是根据promise-polyfill源码分析promise的实现原理，希望通过通俗的方式把promise的实现梳理清楚，文章内容比较长希望有幸看到此文章的你能够静下心来仔细分析，如果代码有误之处还请指正。promise-polyfill地址：https://github.com/taylorhakes/promise-polyfill/blob/master/src/index.js

### 第一步基础版 ###

先来规定一下状态码： 
* 0 = 'PENDING'     
* 1 = 'FULFILLED'  
* 2 = 'REJECTED'  
* 3 = promise 状态是3的时候说明resolve(promise)传的是个promise对象,后面会详细探讨


```javascript
// 这里说明一下为什么resolve和reject方法单独放到了外面，而不是放到了CopyPromise里面
//1. 原生的promise的实例上没有resolve这个方法，为了和promis保持
//2. 原生的pormise有个静态属性Promise.resolve， 为了不产生一些歧义
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
    // 初始的状态是PENDING,当resolve执行后把状态改为1=FULFILLED
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
//添加一个setTimeout
  setTimeout(() => {
    self._value = newValue
    self._deferreds.forEach(deferred => {
      deferred.onFulfilled(newValue)
    })
  })
}
function reject(self, newValue) {
//添加一个setTimeout
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
ok,更改代码让then返回一个promise实例

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
        onFulfilled: onFulfilled || null,
        onRejected: onRejected || null,
        promise: p // 这个是新增的
      })
    }
    return p
  }
}
// 答案是在resolve方法里调用resolve
function resolve(self, newValue) {
  setTimeout(() => {
    self._value = newValue
    self._deferreds.forEach(deferred => {
      let res = deferred.onFulfilled(newValue)
      // 看上面then方法里_deferreds队列里新加了一个promise对象，这个对象是then要返回的对象，这里我们要拿到这个promise
      // 直接把这个promise实例传给resolve，就相当于链式调用时手动调用了resolve方法，那么当resolve执行时第二个then的回调就会执行了
      // 这样形成一个递归调用，是实现链式调用的关键所在
      // 参数deferred.promise: then里面new的那个promise实例
      // 参数res: then回调方法里return的值传
      // 思考一下，调用resolve相当于执行了下一个then收集的队列(deferred.promise._deferreds)里的方法。
      resolve(deferred.promise, res)
    })
  })
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
到此链式调用的原理我们已经知道了，但是我们去看promise-polyfill的源码和我们所实现的链式调用有点不同，promise-polyfill是把逻辑单独放到了handle方法里处理了，既然我们是根据promise-polyfill来解析promise的原理那我们也把代码改造一下。


```javascript
// 单独抽离handle方法
// 参数说明self是当前promise,deferred是队列里的某一项{onFulfilled,onRejected,promise}
// 之前我们的链式调用只处理了成功状态的情况，下面我们一起把失败的逻辑也加进来
function handle(self, deferred) {
  //1. 把then里面收集回调的逻辑拿过来，这里只有状态是0的情况才能往队列里添加，其他情况就要执行成功或者失败的回调了
  if (self.status === 0) {
    self._deferreds.push(deferred)
    return
  }

  // 根据当前状态执行不同的回调
  let cb = self.status === 1 ? deferred.onFulfilled : deferred.onRejected
  // 注意这里cb有可能为null，例如：p.then().then()，如果then里面没有传回调那就是null，null是在then方法里我们给赋的一个值
  // 如果没有传回调那么我们就调用resolve或者reject，这样才能链式一个一个执行then
  if(cb === null){
    (self.status === 1 ? resolve : reject)(deferred.promise, self._value)
    // 注意这里要return，因为代码再往下执行是then里传了回调的情况
    return
  }
  // 如果then里传了回调
  let res = cb(self._value)
  // 再次执行resolve 保证链式调用
  resolve(deferred.promise, res)
}
// 改造CopyPromise
class CopyPromise {
  constructor(fn) {
    this._value = null
    this._deferreds = []
    this.status = 0
    fn((newValue) => resolve(this, newValue), (newValue) => reject(this, newValue))
  }
  then = (onFulfilled, onRejected) => {
    const p = new CopyPromise(() => { })
    // 把原来逻辑替换成handle处理
    handle(this,{
      onFulfilled: onFulfilled || null,
      onRejected: onRejected || null,
      promise: p
    })
    return p
  }
}
// 改造resolve方法
// 因为处理的逻辑我们都放到了handle里了，所以这里的resolve里面应该调用handle
function resolve(self, newValue) {
  setTimeout(() => {
    self.status = 1
    self._value = newValue
    self._deferreds.forEach(deferred => {
      // 之前这里只是执行了deferred.onFulfilled  也就是成功回调，因为then接收两个回调一个成功一个失败，现在用handle替换这里
      // let res = deferred.onFulfilled(newValue)
      // resolve(deferred.promise, res)
      handle(self, deferred)
    })
    // 清空队列
    self._deferreds = []
  })
}
// 改造reject 方法
function reject(self, newValue) {
  setTimeout(() => {
    self.status = 2
    self._value = newValue
    self._deferreds.forEach(deferred => {
      handle(self, deferred)
    })
    // 清空队列
    self._deferreds = []
  }, 0)
}
```
下面再测试一下链式调用

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
链式调用没有问题，不过还存在一个问题没有解决，看下面代码

```javascript
const p = new CopyPromise((resolve, reject) => {
  setTimeout(() => {
    // 我们在resolve里new了一个promise，传给了resolve
    resolve(new CopyPromise((resolve,reject) =>{
      resolve(123)
    }))
  }, 1000)
})
// 此时我们打印出来的值并不是123，而是一个promise实例，也就是说此时实例上的_value值变成了一个promise对象
p.then((res) => {
  console.log(res, '1')
  return res
}).then(res => {
  console.log(res, '2')
})
```
所以说当给resolve传了一个promise对象时我们应该怎么办?  
首先我们给status增加一个状态 status=3的情况，说明resolve传过来了一个promise实例
改造代码 
```javascript

function resolve(self, newValue) {
  setTimeout(() => {
    // 增加一个判断，如果传过来的值是一个promise实例把状态改为3
    if (newValue instanceof CopyPromise) {
      self.status = 3
    } else {
      self.status = 1
    }
    self._value = newValue
    self._deferreds.forEach(deferred => {
      handle(self, deferred)
    })
    self._deferreds = []
  })
}

function handle(self, deferred) {
  // 如果状态是3，我们把当前self这个promise实例更改为 resolve传过来的那个promise实例
  // 然后通过最后一个resolve拿到真实的值123
  // 这里为什么要用while循环，因为resolve里可以嵌套多层的promise，例如下面注释的代码resolve里嵌套了两层
  /**
 * new CopyPromise((resolve, reject) => {
	setTimeout(() => {
		resolve(new CopyPromise((resolve, reject) => {
			resolve(new CopyPromise((resolve, reject) => {
				resolve(123)
			}))
		}))
	}, 1000)
    })
 */
  // 所以要用while 直到最后一层的resolve(123)，这里的值才是我们需要的
  while (self.status === 3) {
    self = self._value;
  }

  if (self.status === 0) {
    self._deferreds.push(deferred)
    return
  }
  let cb = self.status === 1 ? deferred.onFulfilled : deferred.onRejected
  if(cb === null){
    (self.status === 1 ? resolve : reject)(deferred.promise, self._value)
		return
  }
  let res = cb(self._value)
  resolve(deferred.promise, res)
}
```
ok，到此promise的链式调用的原理已经梳理完毕，有些地方需要好好思考一下，如果你看到这里对链式调用还有疑问可以返回去再看几遍，有些关键的知识点需要琢磨一下为什么这样，或者你可以再去查阅一些其他资料，每个人的表达不一样，或者有更符合你逻辑思维的文章，建议先把then的链式调用掌握了之后再继续往下阅读。


### 第三步完善promise其他方法 ###

#### catch方法 ####

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
    handle(this,{
      onFulfilled: onFulfilled || null,
      onRejected: onRejected || null,
      promise: p
    })
    return p
  }
  // catch方法相当于调用reject方法
  // catch里调用了then把第一个成功的回调传为null, 第二个处理错误的回调onRejected
  catch = (onRejected) => {
    return this.then(null, onRejected)
  }
}
```

测试一下catch
```javascript
const p = new CopyPromise((resolve, reject) => {
  setTimeout(() => {
    reject('出错了')
  }, 1000)

})
p.then((res) => {
  console.log(res)
  return res
}).catch(err => {
  // 打印出错误 
  console.log(err)
})
```

#### Promise.all方法 ####

```javascript
class CopyPromise {
  constructor(fn) {
    this._value = null
    this._deferreds = []
    this.status = 0
    fn((newValue) => resolve(this, newValue), (newValue) => reject(this, newValue))
  }
  // ... 省略其他代码


  static all = (arr) => {
    const result = new Array(arr.length);
    // 首先最外层要返回一个promise实例，以便于链式调用
    return new CopyPromise((resolve, reject) => {
      // 首先需要循环传过来的数组，这里相当于是并发执行的
      for (let i = 0; i < arr.length; i++) {
        res(i, arr[i])
      }
      // 还剩几个promise没有完成,用来标记是否结束 只有所有的promise都结束了才能执行resolve
      let remaining = arr.length
      // 处理每一个promise的方法
      function res(index, val) {
        // 传过来的是个promise实例时走此判断
        if (val && typeof val === 'object') {
          let then = val.then
          if (typeof then === 'function') {
            // 为什么要在这里调用then？
            // 因为传过来的promise里有可能又嵌套了promise，这里和上面我们写链式调用那里状态是3的时候循环取值是相同的原理
            // const promise1 = new CopyPromise(resolve => {
            // 	resolve(new CopyPromise(resolve => {
            // 		resolve('promse1')
            // 	}))
            // })
            // 那就需要继续执行嵌套的promise等待它的结束, 也就是递归的效果
            // then((val) => {
            //   res(index, val)
            // },
            // reject)
            then.call(
              val,
              function (val) {
                res(index, val)
              },
              reject
            )
            // 这里需要return 因为此时的val是一个promise对象并不是我们想要的值,代码不能继续往下执行了
            return
          }
        }
        // 走到这里说明resolve()返回了值, 并且这个值不再是promise对象了
        // 此时把val放到对应的索引位置上就可以了
        result[index] = val
        // 同时注意这里要做减法操作,当remaining=0是说明所有的promise都执行完毕
        if (--remaining === 0) {
          resolve(result);
        }
      }
    })
  }
}
```

测试一下promise.all

```javascript
const p1 = new CopyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 200)
})
const p2 = new CopyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(2)
  }, 300)
})
const p3 = new CopyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(3)
  }, 400)
})
// 结果[1, 2, 3] 
CopyPromise.all([p1,p2,p3]).then(res=>{
  console.log(res)
})
```

#### promise.resolve 和 promie.reject方法 ####

这两个方法相对简单主要是调用了我们写好的resolve，reject方法

```javascript
class CopyPromise {
  constructor(fn) {
    this._value = null
    this._deferreds = []
    this.status = 0
    fn((newValue) => resolve(this, newValue), (newValue) => reject(this, newValue))
  }
  // ... 省略其他代码

  static resolve = (value) => {
    return new CopyPromise(function (resolve, reject) {
      resolve(value)
    })
  }
  static reject = (value) => {
    return new CopyPromise(function (resolve, reject) {
      reject(value)
    })
  }
}
```

#### promise.race方法 ####

```javascript
class CopyPromise {
  constructor(fn) {
    this._value = null
    this._deferreds = []
    this.status = 0
    fn((newValue) => resolve(this, newValue), (newValue) => reject(this, newValue))
  }
  // ... 省略其他代码

  // 竞争
  // 哪个快 就把哪个的结果返回
  static race = (arr) => {
    // 这是外层promise 便于链式调用
    return new CopyPromise(resolve => {
      for (var i = 0, len = arr.length; i < len; i++) {
        // 依次调用CopyPromise.resolve, 当然也可以手动new CopyPromise，，防止arr[i]不是promise对象
        // 然后关键的是怎么让先执行完的那个promise，执行完后，后面的promise就不会再执行了
        // 例如： [promsie1, promise2, promise3]， 数组里有三项，如果现在promise2先执行完了
        // 此时代码会走到then，看一下then传的参数，是我们外层那个promise的resolve，
        // 当这个resolve执行完后外层的实例上的状态会被改为1=成功(或者2=失败)，同时外层promise里_deferreds被清空整个过程结束
        // 注意一点这个外部的_deferreds是在我们实际调用race的时候，例如CopyPromise.race([p1,p2]).then((res)=>{})，这里的then会收集回调到_deferreds队列里。
        // 那么当[promsie1, promise2, promise3], promise3又执行完成时此时依然走then传的resolve，
        // 此时外层那个promise实例的状态是成功的，_deferreds已经被清空了，所以看我们的resolve源码forEach循环不会再走，handle不会再执行
        CopyPromise.resolve(arr[i]).then(resolve);
      }
    })
  }
}
```
测试一下prmise.race
```javascript
const p1 = new CopyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1)
    }, 200)
})
const p2 = new CopyPromise((resolve, reject) => {
    setTimeout(() => {
	resolve(2)
    }, 300)
})
const p3 = new CopyPromise((resolve, reject) => {
    setTimeout(() => {
	resolve(3)
    }, 100)
})
CopyPromise.race([p1, p2, p3]).then(res => {
    // 打印出3 正确
    console.log(res)
})
```

#### promise.finally方法 ####

```javascript
class CopyPromise {
  constructor(fn) {
    this._value = null
    this._deferreds = []
    this.status = 0
    fn((newValue) => resolve(this, newValue), (newValue) => reject(this, newValue))
  }
  // ... 省略其他代码

  // 首先无论状态如何finally都会执行, 且finally的回调没有参数
  // 有点类似在最后又调了一个then方法,只不过用finally包了一层
  // this.then回调里的value是当前的value, value没有传到fn()里,也就是finally的回调没有参数
  // CP.resolve(fn())的目的就是执行finally回调, 然后又调了then 这个then的目的是把原来的vulue再返回出去
  // 例如：这样调用，再finally后面又调用了then 这样保证then里能拿到值
  // p1.then(res=>{
	// 	console.log(res)
	// }).finally(()=>{
	// 	console.log('finally')
	// }).then(res=>{
	// 	console.log(res)
  // })
  // 但是原生的promise如果这么调用最后那个then里打印出来的是undefined，也就是说我们可以改成return CP.resolve(fn())就完事了
  // 这里我们和 promise-polyfill 保持一致
  finally = (callback) => {
    // 为什么要用constructor，resolve是静态方法，我们知道静态方法不能通过this.resolve获取
    // 一般都是 构造函数名.方法名 的方式获取
    const constructor = this.constructor
    return this.then(
      (value) => {
        return constructor.resolve(callback()).then(() => value)
      }, (value) => {
        return constructor.resolve(callback()).then(() => constructor.reject(value))
      }
    )
  }
}
```

测试一下promise.finally

```javascript
const p1 = new CopyPromise(function (resolve, reject) {
    setTimeout(resolve, 500, 123);
});
p1.then(res => {
    console.log(res)
    return res
})
p1.then(res => {
    console.log(res)
    return res
}).finally(() => {
    console.log('finally')
})
```

至此promise基本的实现原理已经讲完，当然还有很多可以优化的点，其他细节方面大家可以参考https://github.com/taylorhakes/promise-polyfill/blob/master/src/index.js，本篇文章主要根据promise-polyfill源码把promise实现原理讲清楚希望能帮助你更好的理解promise。