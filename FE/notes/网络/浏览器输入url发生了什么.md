## 浏览器输入url发生了什么 ##

1. 浏览器输入url
2. DNS解析
3. 通过IP和服务器建立TCP链接
4. 服务器返回响应内容
5. 浏览器渲染页面
6. 断开链接

### 一.DNS解析
1. 从浏览器缓存中查找
2. 本地的hosts文件查找 
3. 找本地DNS解析器缓存查找
4. 本地DNS服务器查找
5. 根域名服务器查找，根域名服务器把请求转发到下一级逐层查找，直到返回结果

### 二.TCP链接
1. 三次握手进行TCP链接
    * 第一次握手：客户端发送一个SYN=1的报文，和一个序列号seq=x，此时客户端处于SYN_SYN_SEND状态。

        SYN=1，seq=x

    * 第二次握手：服务端收到报文后，返回SYN=1;ACK=1;同时确认号ack=x+1，上一次客户端的seq中的x，并且发送一个自己的seq=y。

        SYN=1，ACK=1，确认号ack=x+1，初始序号seq=y
    * 第三次握手：客户端收到SYN报文后，返回报文ACK=1，确认号ack=y+1，自己的序列号seq=x+1（初始是x 所有这里+1）

        ACK=1，确认号ack=y+1，序号seq=x+1



### 三.HTTP服务器响应
1. 缓存处理，分为强缓存和协商缓存
2. 强缓存：
    * cache-control。值的设置: cache-control: max-age=1000(多少秒后失效); no-cache(需要使用协商缓存); no-store(所有内容都不会缓存，强制缓存，对比缓存都不会触发)
3. 协商缓存：
    * ETag（优先级高于last-modified）。后端去做对比，如果相同说明资源未修改，返回304。
    * last-modified。服务器返回资源的最后修改时间。下一次请求是客户端把在这个最后修改时间放到if-modified-since(请求头)中去。以秒为单位，所以1秒内的修改无法捕捉到。
    etag能够解决last-modified的一些缺点，但是etag每次服务端生成都需要进行读写操作，而last-modified只需要读取操作，从这方面来看，etag的消耗是更大的。

nginx中配置强缓存,协商缓存需要在代码层实现
```
location ~ \.(gif|jpg|jpeg|png|bmp|ico)$ {
          root /var/www/img/;
          add_header Cache-Control no-cache;
    }
```

```
// node.js中配置协商缓存
ctx.set('Cache-Control', 'max-age=300');
ctx.set('Last-Modified', fileStat.mtime.toGMTString())
ctx.set(etag: '5c20abbd-e2e8')
```
### 四.浏览器渲染页面
1. 解析HTML文档，构建DOM Tree。
2. DOM Tree构建完成后会构建render tree，进入到布局阶段。
3. 绘制全部阶段，页面展示。

### 断开链接
1. TCP 四次挥手
    * 第一次挥手：客户端发送FIN终止的报文，FIN=1，seq=u。并且停止发送数据进入FIN_WAIT1状态
    * 第二次挥手：服务端收到FIN报文后，发送ACK=1的报文，确认号ack=u+1，序列号seq=v。客户端收到确认后进入FIN_WAIT2状态。
    * 第三次挥手：此时服务端数据处理完成，可以断开链接了。发送FIN=1，ACK=1，确认号ack=u+1，序列号seq=w，服务端进入LAST_ACK最后确认状态。
    * 第四次挥手：客户端接收到FIN后，发送ACK=1，确认号ack=w+1，seq=u+1，此时客户端进入等待时间，2MSL（最长报文寿命），在这个时间后客户端正式关闭。

    等待2MSL的意义？

        为了保证客户端发送的最后一个FIN服务器能够接收到，如果过了2MSL服务器还没有接收到客户端的响应，就会再次发送FIN，客户端再重新确认一次。