## CSRF

* 什么是csrf攻击？
CSRF（Cross Site Request Forgery） 跨站请求伪造。

1. 目标站点一定要有 CSRF 漏洞；
2. 用户要登录过目标站点，并且在浏览器上保持有该站点的登录状态；
3. 需要用户在当前站点下打开一个第三方站点，可以是黑客的站点，也可以是一些论坛。


* 如何防范csrf攻击?
1. 验证http的Referer字段
2. Token认证，登陆后服务端返回一个token，下次请求都带上次token以便后端校验，注意此token黑客是无法获取到的。