## sleep函数实现 ##

```javascript
// async await 方式实现
function sleep(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

async function sleepTest() {
  console.log(1111)
  await sleep(2000)
  console.log(2222)
}
sleepTest();

// 利用performance
function sleep(timer) {
    const start = performance.now()
    while (performance.now() - start < timer) {
    console.log(11)
    }
    console.log('done!')
}
sleep(1000);
```
