## koa中间件实现 ##

洋葱模型：
请求从外到内一层层进入，响应从内到外一层层退出。和栈是一样到，先进后出
例如看下面示例代码
```javascript
const m1 = async (context, next) => {
  console.log('in-1');
  await next();
  console.log('out-1');
};
const m2 = async (context, next) => {
  console.log('in-2');
  await next();
  console.log('out-2');
};
const m3 = async (context, next) => {
  console.log('in-3');
  await next();
  console.log('out-3');
};
compose([m1, m2, m3])();

// 输出
// in-1
// in-2
// in-3
// out-3
// out-2
// out-1
```



```javascript
// 递归实现compose
function compose(middleware) {
    return function (ctx) {
        // 就是外部调用的next方法
        function dispatch(i) {
            if(i >= middleware.length) return Promise.resolve()
            const mid = middleware[i]
            // mid第二个参数其实就是下一个中间件方法，也就是next方法
            // 上一个中间件执行next方法就会继续递归下去，通过next实现异步流程的控制
            return Promise.resolve(mid(ctx, dispatch.bind(null, i + 1)))
        }
        return dispatch(0)
    }
}

class Koa {
    constructor() {
        this.middleware = []
    }
    use = (fn) => {
        this.middleware.push(fn)
    }
    run = () => {
       const fnMiddleware = compose(this.middleware)
       return fnMiddleware({ctx: 'ctx'}).then(res => {
           console.log(res, 'res')
       })
    }
}

const app = new Koa()

// 这里的next就是下一个中间件方法
// 当前异步流程执行完时，调用next开始执行下一个中间件，如此实现流程的控制
app.use(function(ctx, next) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([11])
            next()
        }, 1000)
    })
})

app.use(function(ctx, next) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([22])
            next()
        }, 1000)
    })
})

app.run()
```
	

redux中的中间件和koa很像，但是redux的compose方法不是通过递归实现，看下面实现代码
```javascript
export default function compose(...funcs) {
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

compose执行完返回结果 => m1(m2(m3(dispatch)))

这里克里化了arg参数 
compose(A, B, C)(arg) === A(B(C(arg)))

每一个中间件相当于对dispatch进行加强操作返回一个新的dispatch
例如thunk执行完后返回的是
```javascript
// next是克里化传过来的 这里只作为示意代码
function newDispatch(action){
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    return next(action);
}
```

下面是thunk简单源码
```javascript
function thunk({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
}
```