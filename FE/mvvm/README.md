## vue中mvvm简单版实现 ##

先看一下vue简单用法:

    const vw = new Vue({
	    el: "#app",
	    data: {
	        a: 1,
	        b: 2,
	    },
	    methods: {
	        init() {
				this.a=1111;
				this.b=2222;
	        }
	    },
		mounted: {
			this.init();
		}
	});
## 关键点分析: ##

1. 在init方法里直接访问的是this.a 而不是 this.data.a，这里是如何做到的？
 
	答: 数据代理,也就是把data这个对象里的属性映射到了this上面，这样我们在用的时候直接this.a就可以了。

2. 当我们修改a的值，this.a=1111的时候发生了什么，视图是如何做到自动刷新的？
	
	答: 这里的操作相对就多一些，也就是vue中对数据处理核心的地方，借助Object.defineproperty实现对一个对象的劫持，通俗的说其实就是当获取或者修改data的属性时能够自动触发一些方法来做一些事情(例如:通知 订阅)。

	(1) 初始化时需要对data这个对象做一些绑定，也就是用Object.defineproperty来对data的每个属性做一个监听的处理，绑定相应的事件。
	(2) 当修改data属性时，基于上一步的操作的基础我们就能知道对data的修改操作了，从而去自动改变视图。

下面开始实现简单版mvvm

#### 第一步创建vue类 ####

    class Vue {
	    constructor(options = {}) {
	        this.$options = options;
	        // 通过set get 只能访问带下划线的属性 否则报错
	        this._data = this.$options.data || {};
			// 遍历当前dada对象 实现数据代理
	        Object.keys(this._data).forEach(key => {
	            this.proxyData(key);
	        });
	    }
	    // 数据代理
	    proxyData(key) {
	        const self = this;
	        Object.defineProperty(self, key, {
	            enumerable: true,
	            get() {
	                return self._data[key]
	            },
	            set(newValue) {
	                self._data[key] = newValue
	            }
	        })
	    }
	}

可以看到数据代理也是通过Object.defineProperty方法实现的，把当前this=>self也就是Vue实例和Vue.data的属性key传递给defineProperty,当下一次获取值时this.a,会触发get,可以看到get中访问的就是this.data.a，只不过是通过defineProperty做了修改而已。

    输出一个a试试效果:
    
    const vm  = new Vue({
    	data: {
    		a: 1
    	}
    });
    console.log(vm.a); // 1
	现在可以通过实例直接获取a的值了，并不用vm.data.a。



#### 第二步创建Observe类 ####

Observe翻译为观察的意思，也就是对data的每一个属性进行观察(需递归)，当发生改变时通知订阅者。

先来屡一下思路,使用vue时当修改data中的值时视图会刷新，例如this.a=2赋值操作时。此时应该是发出通知的时候告诉订阅者this.a被修改了，然后订阅者负责刷新页面。

那问题来了？

this.a=2赋值的时候需要执行刷新视图的方法，那么负责刷新视图的方法在哪里？是不是模板解析Complite，没错就是模板解析。

也就是说在模板解析的时候需要把刷新视图或者说是模板解析的方法，放到一个地方存起来，等到this.a=2赋值的时候去执行它。

那么放到哪里存，是不是应该放到订阅的队列里面。此时还要创建一个类Dep发布订阅的类。

好了现在回到第二步，先创建Observe类。

	class Observe {
	    constructor(data) {
	        this.initObserve(data);
	    }
	    initObserve(data) {
	        this.observeObj(data);
	    }
	    observeObj(data) {
	        let dep = new Dep();
	        Object.keys(data).forEach(key => {
	            let value = data[key];
	            let child = null;
	            let that = this;
				// 如果子集是对象继续递归下去
	            if (isObject(value)) {
	                this.initObserve(value);
	            }
	            Object.defineProperty(data, key, {
	                enumerable: true,
	                get() {
						// 这里就是依赖收集
						// 就是那个组件依赖了data的那个字段
						// 当模板中<div>{{data.list}}</div> 取值是就会触发get
						// 然后添加到观察队列中，等到set的时候执行
	                    Dep.target && dep.addSub(Dep.target)
	                    return value;
	                },
	                set(newValue) {
	                    if (newValue === value) return;
	                    value = newValue;
	                    if (isObject(newValue)) {
	                        child = that.initObserve(value);
	                    }
	                    dep.notify();
	                }
	            });
	        })
	    }
	}


	
上面observeObj方法中对data的每一个属性都设置set，get去劫持属性的变化，首先看get里面 Dep.target && dep.addSub(Dep.target) 这一段是否很费解，这里其实是往订阅的队列里添加观察者，也就是之前说的刷新视图的方法。那么Dep是个啥？Dep.target又是个啥?先放一下下一步说到。

再接着看看set中 关键的是dep.notify()这个是执行之前放到队列里的方法,也就是刷新视图的方法。

#### 第三步创建Dep类 ####
直接看代码

	class Dep {
	    constructor(option) {
	        this.subs = [];
	    }
	    addSub(sub) {
	        this.subs.push(sub)
	    }
	    notify() {
	        this.subs.forEach(sub => {
	            sub.update()
	        })
	    }
	}

这个方法比较简单，addSub添加，notify执行。此时再看看第二步是否会清晰一些了。但是还有个问题就是上一步的Dep.target是什么？接着看第四步。


#### 第四步创建Watcher类 ####

	
	class Watcher {
	    constructor(vm, exp, fn) {
	        this.vm = vm;
	        this.exp = exp;
	        this.fn = fn;

			// 取出data中的值，例如 data.a
			// 这里有个技巧就是取值的时候会触发之前第二步中get方法
			// get中有 Dep.target && dep.addSub(Dep.target) 这段当时费解的代码
			// 其实就是把当前Watcher放到了dep的队列中，在Dep.notify()执行时去执行Watcher.update方法
			// Watcher.update中有个fn这个回调就是刷新视图的方法

	        Dep.target = this; // 之前纠结了很久的Dep.target其实就是Watcher实例，最终被放到dep队列中等待执行
	        let data = vm;
	        let list = exp.split('.');
	        list.forEach(k => {
	            if (data[k]) {
	                data = data[k]
	            }
	        });
	        Dep.target = null;
	    }
	    update() {
	        let data = this.vm;
	        let list = this.exp.split('.');
	        list.forEach(k => {
	            data = data[k]
	        });
	        this.fn(data);
	    }
	}


这个Watcher.update其实就是执行视图刷新的方法，模板解析的时候需要创建Watcher对象。看上面代码中的注释。这里需要好好理解一下。


#### 第五步创建Complite类 ####


	class Compile {
	    constructor(ele, vm) {
	        vm.$ele = document.querySelector(ele);
	        let fragment = document.createDocumentFragment();
	        let child = vm.$ele.firstChild;
	        const that = this;
	        while (child) {
	            fragment.appendChild(child);
	            child = vm.$ele.firstChild;
	        }
	        function replace(fragment) {
	            Array.from(fragment.childNodes).forEach((node) => {
	                let text = node.textContent;
	                let reg = /\{\{(.*)\}\}/;
	                //文本类型
	                if (node.nodeType === 3 && reg.test(text)) {
	                    let value = getBraceValue(vm, RegExp.$1);

						// 在这创建观察者，回调就是刷新视图方法
						// Watcher对象会被方法dep的队列中等到set的时候执行刷新

	                    new Watcher(vm, RegExp.$1, (v) => {
	                        node.textContent = text.replace(/\{\{(.*)\}\}/, v);
	                    });
	                    node.textContent = text.replace(/\{\{(.*)\}\}/, value);
	                }
	                
	                if (node.childNodes) {
	                    replace(node)
	                }
	            })
	        }
	        replace(fragment)
	        vm.$ele.appendChild(fragment);
	    }
	}


其中第二步到第五步之间相互联系，有些细节的逻辑需要好好思考一下。
特别是Watcher中会触发Observe类的get，然后会把Watcher实例添加到dep的队列中。之后set时执行nodify刷新视图。

### 补充 ###
Observe类中只是对对象类型的数据做了劫持，但是data中并不一定都是对象类型，如果是数组怎么办，数组没有set，get那如何做数据劫持？

vue中是把数组相关的方法从原型中拿出来，对每个方法进行Object.defineProperty处理，代码如下：

	observeArray(data) {
        let arrayPrototype = Object.create(Array.prototype);
        const dep = new Dep();
        arrList.forEach(key => {
            const original = arrayPrototype[key]
            Object.defineProperty(arrayPrototype, key, {
                value: function (newValue) {
                    Dep.target && dep.addSub(Dep.target);
                    let proto = original.apply(data, arguments);
                    dep.notify();
                    return proto;
                },
                enumerable: true,
                writable: true,
                configurable: true,
            })
        });
        data.__proto__ = arrayPrototype;
    }


至此，大体的mvvm的思路差不多了，当然这只是一些简单的实现。算是个人学习路上的笔记，如果有误还请多多指教。