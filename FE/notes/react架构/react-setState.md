## react-setState ##

1. setState是一个类似异步操作的过程，多次setState时react会对setState进行合并最后统一处理。
2. setState可以接收一个方法作为参数，这样可以保证多次调用setState时在最后合并的时候不会被覆盖调。