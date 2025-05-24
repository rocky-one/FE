## vue-router实现原理 ##

#### vue路由的三种模式
* hash URL中带有#标志。通过监听onhashchange事件，window.addEventListener('hashchange'）
* history HTML5的 History API实现，监听popstate事件，然后通过pushState和replaceState改变url时不会发送请求
* abstract 非浏览器环境,如node 原生APP端

