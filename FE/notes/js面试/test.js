// 并发数量
let time = 1
function fetch2(url) {
	if(time>3){
		time = 1
	}
	return new Promise(function(resolve) {
		setTimeout(() => {
			resolve(url)
		}, 200 * time++)
	})
}

function mutilFetch(urls, max) {
    let fetchSum = urls.length;
    let curUrls = urls.splice(0, max);
    let endFetchSum = 0;
    let fetchRes = [];
    return new Promise((resolve, reject) => {
        const loop = (resolve, reject) => {
            while (curUrls.length) {
                const url = curUrls.shift();
                fetch2(url).then(res => {
                    endFetchSum++;
                    fetchRes.push(res);

                    if (urls.length) {
                        curUrls.push(...urls.splice(0, 1));
                        loop(resolve, reject);
                    }
                    if (endFetchSum === fetchSum) {
                        resolve(fetchRes);
                    }
                });
            }
        }
        loop(resolve, reject);
    })
}

mutilFetch([11,22,33,44,55,66,77,88], 4).then(res => {
    console.log(res)
});


// 数组转树结构
const arrs = [{
        id: 2,
        name: '部门',
        parentId: 0
    },
    {
        id: 3,
        name: '部门C',
        parentId: 1
    },
    {
        id: 1,
        name: '部门A',
        parentId: 2
    },
    {
        id: 4,
        name: '部门D',
        parentId: 1
    },
    {
        id: 5,
        name: '部门E',
        parentId: 2
    },
    {
        id: 6,
        name: '部门F',
        parentId: 3
    },
    {
        id: 7,
        name: '部门G',
        parentId: 2
    },
    {
        id: 8,
        name: '部门H',
        parentId: 4
    }
]

function arrsToTree(arrs) {
    function loop(parentId) {
        let res = [];
        for(let i = 0; i < arrs.length; i++) {
            const item = arrs[i];
            if (item.parentId === parentId) {
                item.children = loop(item.id);
                res.push(item);
            }
        }
        return res;
    }
    return loop(0);
}
console.log(arrsToTree(arrs), 'tree');


/// 去除字符串中出现次数最少的字符，不改变原字符串的顺序。
// “ababac” —— “ababa”
// “aaabbbcceeff” —— “aaabbb”
function deleteStr(strs) {
    const strMap = new Map();
    const strArr = strs.split('');

    strArr.forEach(s => {
        if (strMap.has(s)) {
            strMap.set(s, strMap.get(s) + 1);
        } else {
            strMap.set(s, 1);
        }
    });

    const nums = [];
    strArr.forEach(s => {
        nums.push(strMap.get(s));
    });
    const min = Math.min(...nums);
    for(let key of strMap.keys()) {
        if (strMap.get(key) === min) {
            // strMap.delete(key);
            // strs = strs.replaceAll(key, '');
            strs = strs.replace(new RegExp(key, 'g'), '');
        }
    }
    return strs;
}
console.log(deleteStr('aaabbbcceeff'), '删除最少的字符');


// async await实现原理
// 主要的是实现generator函数自执行,递归调用next()即可。
function generatorToAsync(ge) {
    return function() {
        const gen = ge();
        return new Promise((resolve, reject) => {
            function go(arg) {
                const { value, done } = gen.next(arg);
                if (done) {
                    return resolve(value);
                } else {
                    return Promise.resolve(value).then(res => {
                        go(res);
                    });
                }
            }
            go();
        })
    }
}

let sum = 0;
function fn() {
    return new Promise(resolve => {
        setTimeout(() => {
            sum++;
            resolve(sum);
        }, 1000);
    });
}
function* gen() {
  const num1 = yield fn()
  console.log(num1)
  const num2 = yield fn()
  console.log(num2)
  const num3 = yield fn()
  console.log(num3)
  return num3
}

const genToAsync = generatorToAsync(gen)
const asyncRes = genToAsync()
asyncRes.then(res => {
    console.log(res, 'async await res');
});


// koa compose实现
function compose(middleware) {
    return function (ctx) {
        function dispatch(i) {
            if (i >= middleware.length) {
                return Promise.resolve();
            }
            const mid = middleware(i);
            return Promise.resolve(mid(ctx, dispatch.bind(null, i + 1)));
        }
    }
}

// 普通 compose实现
function compose2() {
    const args = [].slice.call(arguments)
    return function(data) {
        return args.reduce((preRes, cur) => {
            return cur(preRes)
        }, args.shift()(data))
    }
}

let name = '123';

let obj = {
	name: '456',
	print: function() {
		function a() {
            // 函数不满足前面的场景，被直接调用时，this 将指向全局对象。
			console.log(this);
		}
		a();
	}
}

obj.print();


// 深度复制
function cloneDeep(data) {
    if (!data) {
        return data;
    }
    const obj = Array.isArray(data) ? [] : {};
    for(let key in data) {
        if (data.hasOwnproperty(key)) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                obj[key] = cloneDeep(data[key])
            } else {
                obj[key] = data[key]
            }
        }
    }

    return obj;
}
// 给定任意二维数组，输出所有的排列组合项。
// // 比如 [['A','B'], ['a','b'], [1, 2]]，输出 ['Aa1','Aa2','Ab1','Ab2','Ba1','Ba2','Bb1','Bb2']

// function arrCom(arrs) {
//     const pre = arrs[0];
//     const res = [];
//     arrs.forEach(curArr => {
//         pre.forEach(s => {
//             let s2 = s;
//             for(let i = 1; i < arrs.length; i++) {
//                 const item = arrs[i];
//                 for (let j = 0; j < item.length; j++) {

//                 }
//             }
//         })
//     });
// }

// 实现add(1)(2)方法 不固定参数
function add(...args) {
    return args.reduce((a, b) => {
        return a + b
    }, 0);
}
function curryFn(add) {
    const args = []
    return function result(...rest) {
        if (rest.length === 0) {
            return add(...args)
        } else {
            args.push(...rest)
            return result
        }
    }
}
const addFn = curryFn(add)
const addSum = addFn(1)(2)(3)()
console.log(addSum,' addSum')


// new的实现 new Object也是如此实现
function newFn() {
    const obj = new Object();
    const args = [].slice.call(arguments);
    const fn = args.shift();

    obj.__proto__ = fn.prototype;
    const res = fn.apply(obj, args);

    return typeof res === 'object' ? res : obj;
}
// Object.create(obj) 的实现
function create(o) {
    function f() {}
    f.prototype = o;
    return new f();
}

// 30 - 50 随机数
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


// 发布订阅实现
function EventEmit() {
  this.events = {};
  this.on = function(name, cb) {
    if (this.events[name]) {
      this.events[name].push(cb);
    } else {
      this.events[name] = [cb];
    }
  };
  this.trigger = function(name, ...arg) {
    if (this.events[name]) {
      this.events[name].forEach(eventListener => {
        eventListener(...arg);
      });
    }
  };
  this.off = function(name) {
    if (this.events[name]) {
        delete this.events[name]
    }
  }
};
let event = new EventEmit();
event.trigger('success');
event.on('success', () => {
    console.log('通知管理员');
});



var oBtn = document.getElementById('btn');

oBtn.addEventListener('click',function(){
    console.log('btn处于事件捕获阶段');
}, true);
oBtn.addEventListener('click',function(){
    console.log('btn处于事件冒泡阶段');
}, false);

document.addEventListener('click',function(){
    console.log('document处于事件捕获阶段');
}, true);
document.addEventListener('click',function(){
    console.log('document处于事件冒泡阶段');
}, false);