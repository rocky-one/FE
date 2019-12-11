## 监听DOM变化MutationObserver ##

#### Dom3中监听DOM变化


```javascript
dom.addEventListener("DOMSubtreeModified", function(){
  console.log('子元素被修改');
}, false);
```
mutations常用事件列表:
1. DOMAttrModified
2. DOMAttributeNameChanged
3. DOMNodeInserted
4. DOMNodeRemoved
5. DOMSubtreeModified

#### mutations兼容性
IE9不支持

#### mutations event性能
1. Mutation Events 同步执行,每次都会从事件队列中取出执行，然后在事件队列中移除。如果此操作执行频繁浏览器会变慢。
2. Mutation Events本身是事件，所以捕获是采用的是事件冒泡的形式，如果冒泡捕获期间又触发了其他的MutationEvents的话，很有可能就会导致阻塞Javascript线程，甚至导致浏览器崩溃。

### 新的替代方案MutationObserver
1. 等待所有脚本任务完成后，才会运行，即采用异步方式
2. 把DOM变动记录封装成一个数组进行处理，而不是一条条地个别处理DOM变动。
3. 即可以观察发生在DOM节点的所有变动，也可以观察某一类变动

Firefox(14+)、Chrome(26+)、Opera(15+)、IE(11+)和Safari(6.1+)支持这个API。

#### 使用

```javascript

const mutationsCallback = (mutations) => {
	console.log(mutations, 'mutations')
}

const observer = new MutationObserver(mutationsCallback)

observer.observe(document.getElementById("domChange"), {
	attributes: true, // 属性变化
	childList: true, // 子节点变化
	subtree: true,  // 所有子孙级节点变化
	characterData: true, // 节点内容或者文本节点
	//...
})

setTimeout(() => {
	const domChange = document.getElementById("domChange");
	domChange.style.border = '1px solid red'
}, 1000)

```