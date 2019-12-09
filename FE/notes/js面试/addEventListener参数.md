## addEventListener参数.md ##

```javascript
target.addEventListener(type, listener[, options]);
```
##### 第一个参数事件类型(click, mouseDown...)
##### 第二个参数事件回调
##### 第三个参数是一个布尔值表示是否在捕获阶段调用事件处理程序。随着时间的推移，很明显需要更多的选项。与其在方法之中添加更多参数（传递可选值将会变得异常复杂），倒不如把第三个参数改为一个包含了各种属性的对象，这些属性的值用来被配置删除事件侦听器的过程
第三个参数默认值是false,在冒泡阶段处理程序.
第三个参数是对象时
```javascript
options = {
  capture: false,// 冒泡阶段处理
  once: false, // listener函数只执行一次
  passive: true, // 为ture时,listener不会调用prenventDefault()
}
```