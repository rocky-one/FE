## CSRF

* 什么是csrf攻击？
CSRF（Cross Site Request Forgery） 跨站请求伪造。
1. 登录受信任网站A，并在本地生成Cookie
2. 在不登出A的情况下，访问危险网站B

* 如何防范csrf攻击?
1. 验证http的Referer字段
2. 添加token验证。放入隐藏标签，下次请求再取出以后的一般是后端渲染的方案。对于单台服务器没问题，多台服务器存在共享问题，用户多时服务器会占用大量内存。
3. JWT(Json Web Token)，多服务器，jwt是存储在客户端的，服务器不存储，jwt里面有用户id，服务器拿到jwt验证后可以获得用户信息。