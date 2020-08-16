
##### React为了优化渲染性能内部自己实现了requestIdleCallback方法，本篇文章主要是介绍在DOM环境下requestIdleCallback的实现原理，非DOM环境下的思路是一样的只是用到的api不同。希望能帮助你更好的学习requestIdleCallback。
##### 首先简单看一个requestIdleCallback的简单用法:


```javascript

requestIdleCallback(myWork)
// 一个任务队列
let tasks = [
  function t1(){
    console.log('执行任务1')
  },
  function t2() {
    console.log('执行任务2')
  }
]
// deadline是requestIdleCallback返回的一个对象
function myWork(deadline) {
  console.log(`当前帧剩余时间: ${deadline.timeRemaining()}`)
  // 方法timeRemaining返回的是当前帧的剩余时间
  if(deadline.timeRemaining() > 0 && tasks.length) {
    // 可以在这里做一些事情了
    const task = tasks.shift()
    task()
  }
  // 如果还有任务没有被执行，那就放到下一帧调度中去继续执行，类似递归
  if(tasks.length) {
    requestIdleCallback(myWork)
  }
}
```

##### requestIdleCallback基本用法已经了解了，现在先来分析一下如何实requestIdleCallback。

##### 其中最关键是deadline中的<span style="color:red;">timeRemaining方法执行的时候会返回当前帧的剩余时间</span>，那我们怎么知道当前帧(16.6ms)执行完相关任务后还剩余多少时间那，思考一下这个剩余时间怎么计算。(当然这里也可能没有剩余时间)

##### 要计算出当前帧的剩余时间我们还需要再来回顾另外一个api就是requestAnimationFrame。

* <span style="color:#000;font-size: 14px">requestAnimationFrame回调是由系统决定何时调用，而且是在每次绘制之前调用(注意这里是绘制之前，后续实现requestIdleCallback的时候需要在这里计算一个当前帧的结束时间)。</span>
* <span style="color:#000;font-size: 14px">一般情况系统绘制频率是60Hz，那么回调就是1000/60=16.66ms被执行一次，这样保证每次16.66ms执行这个回调，就不会出现丢帧导致卡顿的问题。</span>

```javascript 
requestAnimationFrame(function(rafTime){
    console.log('rafTime', rafTime)
})
```

##### requestAnimationFrame接受一个回调并给回调返回一个参数。先看一下MDN上对这个回调的解释:
```javascript
callback
下一次重绘之前更新动画帧所调用的函数(即上面所说的回调函数)。
该回调函数会被传入DOMHighResTimeStamp参数，该参数与performance.now()的返回值相同，
它表示requestAnimationFrame() 开始去执行回调函数的时刻。
```


##### 这个解释好像不能很清楚理解我们写的回调中的参数rafTime到底是怎么算出来的，也就是DOMHighResTimeStamp或者performance.now()怎么算出来的，为了方便后续我们就统一使用performance.now()来讲解。

##### 看一下MDN是如何解释 [DOMHighResTimeStamp](http://example.com/ "With a Title")。

##### 为了容易理解performance.now()，我们可以简单粗暴的理解为从页面打开的时候performance.now()从0开始计时，一直到当前的时间。随着在当前页面停留的时间增长这个时间不断累加的一个值，其实就类似一个计时器。


##### 好了，现在requestAnimationFrame的用法和参数都说完了。下面具体看怎么实现requestIdleCallback，最主要的就是deadline.timeRemaining()当前帧剩余时间的计算，看下面两点描述。

<span style="color:#000;font-size: 14px;font-weight:bold;margin-left: 12px"><span style="color:#990000;">1. 当前帧结束时间：</span> 我们知道requestAnimationFrame的回调被执行的时机是当前帧开始绘制之前。也就是说rafTime是当前帧开始时候的时间，如果按照每一帧执行的时间是16.66ms。那么我们就能算出当前帧结束的时间， frameDeadline = rafTime + 16.66。</span>
  
<span style="color:#000;font-size: 14px;font-weight:bold;margin-left: 12px"><span style="color:#990000;">2. 当前帧剩余时间：</span>当前帧剩余时间 = 当前帧结束时间(frameDeadline) - 当前帧花费的时间。关键是我们怎么知道'当前帧花费的时间'，这个是怎么算的，这里就涉及到js事件循环的知识。react中是用MessageChannel实现的。</span>

##### 下面直接看代码的实现，其中的注释也说明了一些具体的实现思路:

```javascript
let frameDeadline // 当前帧的结束时间
let penddingCallback // requestIdleCallback的回调方法
let channel = new MessageChannel()

// 当执行此方法时，说明requestAnimationFrame的回调已经执行完毕，此时就能算出当前帧的剩余时间了，直接调用timeRemaining()即可。
// 因为MessageChannel是宏任务，需要等主线程任务执行完后才会执行。我们可以理解requestAnimationFrame的回调执行是在当前的主线程中，只有回调执行完毕onmessage这个方法才会执行。
// 这里可以根据setTimeout思考一下，setTimeout也是需要等主线程任务执行完毕后才会执行。
channel.port2.onmessage = function() {
  // 判断当前帧是否结束
  // timeRemaining()计算的是当前帧的剩余时间 如果大于0 说明当前帧还有剩余时间
  let timeRema = timeRemaining()
	if(timeRema > 0){
    	// 执行回调并把参数传给回调
		penddingCallback && penddingCallback({
      		// 当前帧是否完成
      		didTimeout: timeRema < 0,
      		// 计算剩余时间的方法
			timeRemaining
		})
	}
}
// 计算当前帧的剩余时间
function timeRemaining() {
    // 当前帧结束时间 - 当前时间
	// 如果结果 > 0 说明当前帧还有剩余时间
	return frameDeadline - performance.now()
}
window.requestIdleCallback = function(callback) {
	requestAnimationFrame(rafTime => {
      // 算出当前帧的结束时间 这里就先按照16.66ms一帧来计算
      frameDeadline = rafTime + 16.66
      // 存储回调
      penddingCallback = callback
      // 这里发送消息，MessageChannel是一个宏任务，也就是说上面onmessage方法会在当前帧执行完成后才执行
      // 这样就可以计算出当前帧的剩余时间了
      channel.port1.postMessage('haha') // 发送内容随便写了
	})
}
```

##### 至此requestIdleCallback简单的版本的已经实现，具体细节还需要优化，再来总结一下。

##### 1. 根据requestAnimationFrame得出当前帧开始的时间，然后计算出当前帧的结束时间，frameDeadline = rafTime + 16.66。
##### 2. 根据MessageChannel宏任务的特性，就可以算出当前帧执行了多少时间，当前帧执行了多少时间 = frameDeadline - performance.now()。

##### 本篇文章主要讲解了requestIdleCallback在DOM环境下的简单实现，主要是讲解其中的实现思想，希望能帮助你更好的理解requestIdleCallback，代码中还有很多可以修改的地方，如果有误还请指教。

