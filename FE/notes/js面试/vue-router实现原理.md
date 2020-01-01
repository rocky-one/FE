## vue-router实现原理 ##

#### vue路由的三种模式
* hash URL中带有#标志
* history HTML5的 History API实现,其中pushState和replaceState改变url时不会发送请求
* abstract 非浏览器环境,如node 原生APP端

第一步:
监听hashchange和popstate事件。hashchange是URL中#后面的部分改变时就会触发hashchange事件。

```javascript

```
