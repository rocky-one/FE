## js函数参数按值按引用 ##

### 1参数为基本类型时参数在函数体内被复制一份

```javascript
let a = 1
function fn(n){
    n = 2
    console.log(n)
}
fn(a)
console.log(a)

```
分别输出2、1，两个变量之间不会影响。

### 2参数为引用类型时修改会影响原来的值

```javascript
let a = {
    name: 'rocky'
}
function fn(n){
    n.name = 'tom'
    console.log(n.name)
}
fn(a)
console.log(a.name)
```
分别输出tom、tom，当参数为引用类型时对参数的属性进行修改原对象会被修改因为对象是引用类型指向同一个地址。

### 3参数为引用类型，从函数内部直接修改了对象的引用地址，不会影响原对象

```javascript
let a = {
    name: 'rocky'
}
function fn(n){
    n = 1
    console.log(n)
}
fn(a)
console.log(a)
```

输出1，{name: 'rocky'}，参数为引用类型时直接修改对象的引用地址，相当于在函数内创建了一个新的引用不会影响原来的对象，对象的操作不会相互影响。