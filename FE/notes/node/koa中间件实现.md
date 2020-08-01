## koa中间件实现 ##


```javascript
// 递归实现compose
function compose(middleware) {
    return function (ctx, next) {
        let index = -1
        return dispatch(0)
        function dispatch(i) {
            if(i >= middleware.length) return Promise.resolve()
            const fn = middleware[i]
            // fn第二个参数其实就是下一个中间件方法，也就是next方法
            // 上一个中间件执行next方法就会继续递归下去，通过next实现异步流程的控制
            return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)))
        }
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
	