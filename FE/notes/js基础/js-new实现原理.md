## js-new实现原理 ##

**先看一下正常一个被new时候的实例对象是什么样的**

	function Fn() {
		this.name='rocky'
	}
	Fn.prototype.getName = function() {
		return this.name
	}
	const FnInstance = new Fn()
	console.log(FnInstance)
	// 打印出的对象大概是这个样子,相关原型链知识可查阅其他资料
	//FnObj = {
	//    name: 'rocky',
	//    __proto__: {
	//        getName: f()
	//        constructor: f Fn()
	//        __proto__: Object
	//    }
	//}

**分析new做了什么:**

1. 返回一个对象
2. 修改对象的原型链指向,实例的__proto__会指向构造函数的prototype
3. 把构造函数里的this指向这个对象

下面开始实行一个方法

```javascript
	function NewFn() {

	    const obj = new Object()

	    // 取出第一个参数 第一个参数默认是构造函数 
	    const Fn = [].shift.call(arguments)

	    // 修改obj的原型链指向
	    obj.__proto__ = Fn.prototype

	    // 修改Fn构造函数的this指向obj
	    const res = Fn.apply(obj, arguments)

	    // 如果构造函数有返回值 返回构造函数的返回值 否则返回obj 
	    return typeof res === 'object' ? res : obj
	}
	
	function fn(name){
	    this.name = name
	}
	fn.prototype.getName = function() {
	    return this.name
	}
	NewFn(fn, 'rocky')


// 构造函数中有return的情况

	function Fo(){
		this.name="rocky";
		return {}
	}
	const fo1 = new Fo()
	console.log(fo1.name) // undefined

	function Fo(){
		this.name="rocky";
		return 1
	}
	const fo1 = new Fo()
	console.log(fo1.name) // rocky

// 当构造函数中return了一个对象时实例的this就执行这个对象，当return的不是对象时实例的this还是执行本来的实例。
```