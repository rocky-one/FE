## redux和react-redux解决了什么问题 ##

### redux解决了什么问题
1. 数据存储共享.所有的数据都存到一个对象上.
2. 统一了数据处理的方式,让state的变化可预测.state是只读需要通过触发dispatch(action)来修改,保证了修改状态的一致性和可预测性,就是一个数据的修改从哪里来(触发)到哪里去(修改)最终都会反映到state整个树上.
3. 内部维护了一套发布订阅机制,通过订阅把回调储存起来,在外边调用发布方法时执行订阅的回调,回调中可以是render等任何操作.如此来解耦store与UI层,所以redux可以用在react也可以用在vue或者node中.

### redux实现原理分析
主要看一下redux的核心方法createStore,这个方法就是创建一个store树,然后返回一些可供外部调用的方法.
先看一下redux给外部提供的方法,然后实现一个简单版本的createStore方法.

```javascript
const store = createStore()
store.getState()
store.dispatch(action)
store.subscribe(listener)
store.replaceReducer(nextReducer)
```

简单实现

```javascript
// reducer是所有的reducer方法
function createStore(reducer){
    const store = {}
    store.listeners = []
    // 订阅, 这里的listener相当于一个回调 外部去调用这个subscribe把所有的回调储存起来
    // 等到dispatch的时候再来执行这些所有的回调,回调可以处理render等
    // react-redux里的回调就是用来setState让组件重新render的
    store.subscribe = (listener) => {
        store.listeners.push(listener)
    }

    store.dispatch = (action) => {
        // 执行所有的reducer方法, 根据action匹配更新state
        store.state = reducer(store.state, action)
        // 然后执行刚刚储存的listeners回调 
        // 注意这里是执行了所有的回调的逻辑,只要store中的任何值变化 所有的回调都会执行一遍
        // react-redux里的回调执行会导致setState让组件重新render,所以这里需要优化判断是否需要render
        store.listeners.forEach(listener => listener());
    }

    store.getState = () => {
        return store.state
    }

    return store
}
```

测试一下
```javascript
// reducer
function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT':
    return state + 1
  case 'DECREMENT':
    return state - 1
  default:
    return state
  }
}

let store = createStore(counter)

store.subscribe(() =>
  console.log(store.getState())
)

store.dispatch({ type: 'INCREMENT' })
// 1
store.dispatch({ type: 'INCREMENT' })
// 2
store.dispatch({ type: 'DECREMENT' })
// 1
```

### react-redux解决了什么问题

1. 将组件和redux的store连接,数据注入组件,使数据共享.redux对接的不一定是react可能是其他框架,react-redux用来把react和redux连接起来.
2. 注册监听者subscrible(listener),当store发生变化时更新UI视图.这里通过高阶组件去判断当前组件是否需要render.
