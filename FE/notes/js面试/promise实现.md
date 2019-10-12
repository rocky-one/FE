## promise实现 ##

先熟悉一下原生promise使用,然后实现一个简单版本
```javascript
const p = new Promise(resolve=>{
  setTimeout(()=>{
    resolve(1)
  },100)
})
p.then(res=>{
  console.log(res)
})
```
#### 1.基础版 ####

```javascript
class CopyPromise {
  constructor(callback) {
    this.data = null
    this.status = 'PENDING'
    callback(this.resolve, this.reject)
  }
  resolve = (data) => {
    this.data = data
    this.status = 'FULFILLED'
  }
  reject = (err) => {
    this.data = err
    this.status = 'REJECTED'
  }
  then = (fulfillCb, rejectCb) => {
    if(this.status === 'FULFILLED'){
      fulfillCb(this.data)
    }else if(this.status === 'REJECTED'){
      rejectCb && rejectCb(this.data)
    }
  }
}

const p2 = new CopyPromise((resolve, reject) => {
  setTimeout(()=>{
    resolve(2)
  },1000)
})

p2.then(res => {
  console.log(res, 'res2')
})
```
