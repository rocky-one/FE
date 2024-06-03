## React16 架构可以分为三层：

Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler
Reconciler（协调器）—— 负责找出变化的组件
Renderer（渲染器）—— 负责将变化的组件渲染到页面上

#### Scheduler（调度器）
既然我们以浏览器是否有剩余时间作为任务中断的标准，那么我们需要一种机制，当浏览器有剩余时间时通知我们。

其实部分浏览器已经实现了这个 API，这就是requestIdleCallback。但是由于以下因素，React放弃使用：

浏览器兼容性
触发频率不稳定，受很多因素影响。比如当我们的浏览器切换 tab 后，之前 tab 注册的requestIdleCallback触发的频率会变得很低


#### Reconciler（协调器）
我们知道，在 React15 中Reconciler是递归处理虚拟 DOM 的。让我们看看React16 的 Reconciler。

我们可以看见，更新工作从递归变成了可以中断的循环过程。每次循环都会调用shouldYield判断当前是否有剩余时间。

Reconciler会做如下工作：
调用函数组件、或 class 组件的render方法，将返回的 JSX 转化为虚拟 DOM
将虚拟 DOM 和上次更新时的虚拟 DOM 对比
通过对比找出本次更新中变化的虚拟 DOM
通知Renderer将变化的虚拟 DOM 渲染到页面上


#### Renderer（渲染器）
Renderer根据Reconciler为虚拟 DOM 打的标记，同步执行对应的 DOM 操作。

浏览器环境渲染的Renderer —— ReactDOM。
ReactNative渲染器，渲染 App 原生组件。