## js性能优化总结 ##
#### DOM方面优化 
* 多次appendChild使用document.createDocumentFragment()
```javascript
for(let i = 0; i<10; i++){
	let ele = document.createElement('div')
	document.body.appendChild(ele)
}
// 替换为
let frag = document.createDocumentFragment()
for(let i = 0;i<10; i++){
	let ele = document.createElement('div')
	frg.appendChild(ele)
}
document.body.appendChild(frag)
```