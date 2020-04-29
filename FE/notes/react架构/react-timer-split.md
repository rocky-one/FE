## react-timer-split ##

```javascript
function sleep(timer) {
    const start = performance.now()
    while (performance.now() - start < 1000) {
    console.log(11)
    }
    console.log('done!')
}
```