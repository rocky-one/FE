## webpack按需加载遇到的坑 ##

1. 多级嵌套路由时，当前位于子路由刷新页面报 404错误

	查看此时如果页面中引用的js路径是相对哪里的路径

	例如 `<script src="bundle.js"></script>` 是相对当前路径的

	如果此时路由为 http://localhost:8086/page2/page2_1 然后刷新页面是相对于page2文件下去找bundle.js 那就404了

	这样就对了 `<script src="/bundle.js"></script>` 是相对当前根目录的

	答: 查看webpack的配置 output.publicPath, 更改为output.publicPath='/'