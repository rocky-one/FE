## H5和native通信 ##

#### H5调用native方法
 1. 注入API,通过WebView提供的接口，向javascript的window对象注入方法。
 2. 拦截HTML5的请求，WebView可以拦截所有的HTML5的请求，通过过滤实现来实现调用native方法。


#### native调用H5方法
1. native端都会提供接口例如webView.evaluateJavascript("javascript:run")，前提是js的window上要挂载此方法=>window.JSBridge={}。



```javascript
// 通过回调实现双向通信
(function () {
    let id = 0,
        callbacks = {};

    window.JSBridge = {
        // h5内部调用invoke，然后调用postMessage 和 Native通信
        invoke: function(bridgeName, callback, data) {
            let thisId = id++; // 获取唯一 id
            callbacks[thisId] = callback; // 存储 Callback
            // 调用 Native
            nativeBridge.postMessage({
                bridgeName: bridgeName,
                data: data || {},
                callbackId: thisId // 传到 Native 端
            });
        },
        // native调用receiveMessage，然后再调用刚刚的回调,这个回调是H5的回调
        // 上面调用h5调用invoke时传的,这样实现了双向通信
        receiveMessage: function(msg) {
            let bridgeName = msg.bridgeName,
                data = msg.data || {},
                callbackId = msg.callbackId; // Native 将 callbackId 原封不动传回
            if (callbackId) {
                if (callbacks[callbackId]) { // 找到相应句柄
                    callbacks[callbackId](msg.data); // 执行调用
                }
            } else if (bridgeName) {

            }
        }
    };
})();
```