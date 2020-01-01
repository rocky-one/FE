## 同一个dom节点绑定多个事件考察proxy ##
思考:

div.onclick=fn1

div.onclick=fn2

这样最终点击div的时候执行的是fn2方法 后面的覆盖前面的这个大家都知道
现在想让点击div的时候fn1和fn2都执行 怎么做?


```javascript

	const btn = document.querySelector("#btn")
    const cliskList = []
    function runFn(fns=[]){
        return function(){
            fns.forEach(fn=>fn())
        }
    }
    const proxyBtn = new Proxy(btn, {
        get(target, key, receiver) {
            return Reflect.get(target, key)
        },
        set(target, key, value, receiver) {
            // 存到数组中
            cliskList.push(value)
            Reflect.set(target, key, runFn(cliskList))
        }
    })

    proxyBtn.onclick = function () {
        console.log(1)
    }
    proxyBtn.onclick = function () {
        console.log(2)
    }

```