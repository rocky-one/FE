## js防抖和节流 ##

### 防抖 ###

例如防抖时间设定1秒, 当持续触发事件时，1秒内没有再触发事件，事件处理函数才会执行一次，如果1秒到来之前，又一次触发了事件，函数不执行，重新开始延时.
```javascript
function debounce(fn, delay) {
  let timer = null;
  return function() {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null
    }, delay)
  }
}
```
	


### 节流 ###
当持续触发事件时，保证一定时间段内只调用一次事件处理函数
```javascript
function throllte(fn, delay) {
  let run = false;
  return function() {
    if (!run) {
      run = true;
      setTimeout(() => {
        fn.apply(this, arguments);
        run = false;
      }, delay)
    }
  }
}
```

### setTimeot模拟setInterval
```javascript
const timerList = new Set()
function setInterval2(cb, ms) {
  const ref = {}
  function run() {
    return setTimeout(() => {
      const timer2 = run();
      ref.timer = timer2;
      cb.apply(null);
    },ms)
  }
  ref.timer = run()
  return ref;
}

function clearInterval2(ref) {
  clearTimeout(ref.timer)
}
window.setInterval2 = setInterval2;
window.clearInterval2 = clearInterval2;

let sum = 0
let ref = setInterval2(() => {
  sum++
  if(sum > 4){
    console.log(ref,'ref')
    clearInterval2(ref)
  }
}, 1000)
```