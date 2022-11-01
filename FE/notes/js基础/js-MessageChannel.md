## MessageChannel使用及简单实现 ##

### 使用
```javascript
const channel = new MessageChannel2();
channel.port1.onmessage = function(data){
  console.log(data) // hello
};
const port2 = channel.port2;
port2.postMessage('hello');
```

### 简单实现
```javascript
class MessageChannel {
  constructor() {
    this.port1 = {
      onmessage: (data) => {},
      postMessage: (data) => {
          setTimeout(() => {
            this.port2.onmessage(data)
          }, 0)
      }
    }
    this.port2 = {
      onmessage: (data) => {},
      postMessage: (data) => {
          setTimeout(() => {
            this.port1.onmessage(data)
          }, 0)
      }
    }
  }
}
```