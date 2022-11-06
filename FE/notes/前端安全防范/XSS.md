## XSS

* 什么是xss攻击？
xss为跨站脚本，分为储存型、反射型、基于DOM的xss
大概意思就是把代码注入到页面上去，比如评论框里留言是输入了js语言<script>alert('哈哈')</script>，这样的话如果页面没有对输入内容做过滤处理就会发生xss攻击。

* 如果防范xss攻击？
1. 转义字符，对尖角号、引号、斜杠、等进行转义
```javascript
str = str.replace(/&/g, '&amp;');
str = str.replace(/</g, '&lt;');
str = str.replace(/>/g, '&gt;');
str = str.replace(/"/g, '&quto;');
```

2. 对于富文本来说不能通过转义字符的方式解决，因为这样会把一些格式给过滤掉。富文本一般通过白名单的方式解决xss攻击的问题。就是明确哪些标签是没有危险的不做转义，反之就做转义。
```javascript
const xss = require('xss')
let html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>')
// 转义结果 => <h1>XSS Demo</h1>&lt;script&gt;alert("xss");&lt;/script&gt;
// 这里只把script标签做了转义其他标签不做转义
```

3. 设置Cookie只读,后端通过设置HttpOnly属性开启只读，无法通过 JavaScript 来读取这段 Cookie