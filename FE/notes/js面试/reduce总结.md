## reduce总结 ##

#### 用reduce实现串行

```javascript
const p1 = () => new Promise(resolve => {
	setTimeout(() => {
		console.log(1)
		resolve(1)
	}, 1000)
})
const p2 = () => new Promise(resolve => {
	setTimeout(() => {
		console.log(2)
		resolve(2)
	}, 500)
})
// 注意reduce的第二个参数是一个promise
function promiseSequence(promiseList, data) {
	return promiseList.reduce((pre, cur) => pre.then(cur), Promise.resolve(data))
}
// 第二个参数也可以这么写
function promiseSequence2(promiseList, data) {
	return promiseList.reduce((pre, cur) => pre.then(cur), promiseList.shift()())
}
promiseSequence([p1, p2], { name: 'hh' })
```

#### 用reduce实现函数柯里化
将pipe(f, g, h)转换为 (...args) => h(g(f(...args)))

```javascript
const pipe = (...fns) => data => fns.reduce((preFn, curFn) => curFn(preFn), data)

const pipeFn = pipe(function (data) {
	console.log(data)
	return data;
}, function (data) {
	console.log(data)
})
pipeFn({name:"h"})
```

#### reduce实现原理
```javascript
// 实现reduce
Array.prototype.reduce = function (fn, value) {
	let arr = this
	// 没有初始值 获取数组第一项
	let values = typeof value === 'undefined' ? arr[0] : value
	// 没有初始值时 从第二项开始,第一项先拿出作为初始值
	const startIndex = typeof value === 'undefined' ? 1 : 0
	arr = arr.slice(startIndex)
	for (let i = 0; i < arr.length; i++) {
		// 依次把参数给回调fn
		values = fn(values, arr[i], i + startIndex, arr)
	}
	return values
}

Array.prototype.recude = function(fn, value) {
	let arr = this;
	let values = typeof value === 'undefined' ? arr[0] : value;
	let index =  typeof value === 'undefined' ? 1 : 0;
	for (let i = index; i < arr.length; i++) {
		values = fn(values, arr[i], i, arr)
	}

	return values;
}
```