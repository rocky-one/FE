## js-call-aplly实现原理 ##

例如我们经常这么用
```javascript
	// 1
	// arguments是一个类数组,所以它没有数组的方法比如slice push等
	// 所以可以借助于call来借用数组上的方法 运用到arguments上面
	const args = Array.prototype.slice.call(arguments)
	// 2
	function fn(){
		this.a +=1
	}
	const obj = {
		a: 1
	}
	fn.call(obj)
	console.log(obj.a) // 2

```

实现思考

1. 改变this指向,比如上例中改变了fn的this为obj
2. 执行.call前面的那个方法,并且传入参数

```javascript
	Function.prototype.call2 = function () {
        // 把.call前面的方法获取到 改变它的this
        // .call前面的方法就是this本身
        // 取出第一个参数一般是借用的那个对象
        const args = Array.prototype.slice.call(arguments)
		
        const obj = args.shift()
        obj._callFn = this
        obj._callFn(args)
        delete obj._callFn

    }
    // 测试一下
    function fn(num) {
        this.a += num
    }
    const obj = {
        a: 1
    }
    fn.call2(obj, 3)
    console.log(obj.a) // 13

```
- 问题
1. 输出13 我们想要的结果应该是4,参数传过来后会自动调用toString方法所以我们传的Number类型的参数3被转换成了字符串, 那如果传一个对象结果是什么,对象会被转换成 '[object Object]'

解决参数字符串问题, 可以使用es6解构,es3可以使用eval包装一层

```javascript
	Function.prototype.call2 = function () {
        const args = Array.prototype.slice.call(arguments)
        const obj = args.shift()
        obj._callFn = this
        obj._callFn(...args)
        delete obj._callFn

    }
    // 测试一下
    function fn(num) {
        this.a += num
    }
    const obj = {
        a: 1
    }
    fn.call2(obj, 3)
    console.log(obj.a) // 4

```

结果正确
apply的实现和call一致只是参数问题

```javascript
	Function.prototype.apply2 = function (context, argsArr) {
        context._callFn = this
        context._callFn(...argsArr)
        delete context._callFn
    }
    // 测试一下
    function fn(num) {
        this.a += num
    }
    const obj = {
        a: 1
    }
    fn.apply2(obj, [3])
    console.log(obj.a) // 4
```
