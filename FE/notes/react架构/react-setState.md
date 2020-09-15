## react-setState ##

首先了解一下事务的概念：

react中像生命周期，合成事件都是在一个事务流程下面。比如点击事件触发的时候，batchUpdate会被标记为true表示在一个事务流程中，此时就会把相关操作放到队列中去。

比如setState操作，等到事务close的时候再去批量更新state。


1. setState是一个类似异步操作的过程，多次setState时react会对setState进行合并最后统一处理。
2. setState可以接收一个方法作为参数，这样可以保证多次调用setState时在最后合并的时候不会被覆盖调。