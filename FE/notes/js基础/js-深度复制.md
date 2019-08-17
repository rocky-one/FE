## js-深度复制 ##

首先能想到的就是用递归来实现拷贝
```javascript
function cloneDeep(source) {
    const obj = {}
    for(let key in source){
        if(source.hasOwnProperty(key)){
            if(typeof source[key] === 'object'){
                obj[key] = cloneDeep(source[key])
            }else{
                obj[key] = source[key]
            }
        }
    }
    return obj
}

// 测试一下
const obj1 = {
    a: 1,
    b: {
        b1: 2
    },
    c: null,
    d: undefined,
}
const obj2= cloneDeep(obj1)
obj.a=100
console.log(obj,obj2)
// 打印结果
// obj1 = {
//     a: 100,
//     b: {
//         b1: 2
//     },
//     c: null,
//     d: undefined,
// }
// obj2 = {
//     a: 1,
//     b: {
//         b1: 2
//     },
//     c: {},
//     d: undefined,
// }

```

- 问题
1. obj2.c = {} 变成了一个对象,这里是因为判断错误 typeof null === 'object' 返回true,所以obj2.c={}
2. 数组情况为考虑
3. 传进的值是null或者undefined的情况

下面修改对象的判断和数组的情况
```javascript
function cloneDeep(source) {
    if(!source) return source
    const obj =  Array.isArray(source) ? [] : {};
    for(let key in source){
        if(source.hasOwnProperty(key)){
            if(typeof source[key] === 'object' && source[key] !== null){
                obj[key] = cloneDeep(source[key])
            }else{
                obj[key] = source[key]
            }
        }
    }
    return obj
}

// 测试一下
const obj1 = {
    a: 1,
    b: {
        b1: 2
    },
    c: null,
    d: undefined,
}
const obj2= cloneDeep(obj1)
console.log(obj,obj2)
// 打印结果 正确
// obj1 = {
//     a: 100,
//     b: {
//         b1: 2
//     },
//     c: null,
//     d: undefined,
// }
// obj2 = {
//     a: 1,
//     b: {
//         b1: 2
//     },
//     c: null,
//     d: undefined,
// }

```
- 问题
1. 循环引用

什么是循环引用?

```javascript
    const obj1 = {
        a: 1
    }
    obj1.b = obj1
    // obj1的属性又引用了obj1,如此深度复制的时候就会走进死循环,导致爆栈
```

解决循环引用问题,使用WeakMap,把每个对象放到哈希表中,当已经有某个对象时直接返回这个对象即可,代码:
```javascript
    function cloneDeep(source, hashData = new WeakMap()) {
        if (!source) return source
        if (hashData.has(source)) return hashData.get(source)

        const obj = Array.isArray(source) ? [] : {};
        hashData.set(source, obj)
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === 'object' && source[key] !== null) {
                    obj[key] = cloneDeep(source[key],hashData)
                } else {
                    obj[key] = source[key]
                }
            }
        }
        return obj
    }
```

// 测试
```javascript
const obj1 = {
        a: 1
    }
obj1.b = obj1
console.log(cloneDeep(obj1))

```

- 问题
1. 引用丢失

什么是引用丢失?
```javascript
    const obj1 = {
        a: 1
    }
    const obj2 = {
        a: obj1,
        b: obj1,
    }
    // obj2.a和obj.b都引用的同一个值,如果是深度复制那么这两个引用就会被改为两个不同的地址的值,因此原本的引用也就丢失了
    
```

解决引用丢失问题,上面哈希表不能解决这个问题,所以我们把已有的对象存到数组中,这样就能保证是同一个引用了

```javascript
function cloneDeep(source, storageData) {
        if (!source) return source
        if (!storageData) storageData = []
        const obj = Array.isArray(source) ? [] : {};

        let hasData = false
        for (let i = 0; i < storageData.length; i++) {
            if (storageData[i].source === source) {
                hasData = storageData[i];
            }
        }
        if (hasData) return hasData.obj;
        storageData.push({
            source: source,
            obj: obj
        });
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                if (typeof source[key] === 'object' && source[key] !== null) {
                    obj[key] = cloneDeep(source[key], storageData)
                } else {
                    obj[key] = source[key]
                }
            }
        }
        return obj
    }

```
```javascript
    // 测试一下
    const obj1 = {
        a: 1
    }
    const obj2 = {
        a: obj1,
        b: obj1,
    }
    const obj3 = cloneDeep(obj2)
    console.log(obj3.a === obj3.a) // true
```