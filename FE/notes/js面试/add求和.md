## add求和 ##
实现一个方法如下

```javascript
add(1); // 1
add(1)(2);  // 3
add(1)(2)(3); // 6
add(1)(2)(3)(4); // 10 
```
  
要实现add方法必须让add执行完后反应一个方法,这样才能继续调用

```javascript
function add(num){
	function sum(num2){
		num = num + num2
		return sum
	}
	return sum
}
console.log(add(1)(2))
// 输出
// ƒ sum(num2){
// 	num = num + num2
// 	return sum
// }
```
我们发现输出的是个函数并不是我们想要的一个number类型的数字,因为当我们打印add()时会自动调用toString()方法把sum方法转换成字符串打印出来了。所以如果我们修改sum的toString()方法让它返回一个数字是不是就对了?

```javascript
function add(num){
	function sum(num2){
		num = num + num2
		return sum
	}
	sum.toString = function(){
		return num
	}
	return sum
}
```