## react和vue对比 ##

#### 相同点
1. 组件化，都是数据驱动组件render(响应式)
2. 都采用virtual-dom的方式来反应真实dom
3. 都采用单项数据流的设计
#### 不同点
1. vue是渐进式框架，比如我可以在一个html页面中直接引用vue.js，这是一种简单用法，再升一级我可以按照vue组件的方式去开发。react则有更强的规则，必须按照react的要求写组件。
2. vue采用object.definedProperty来做数据劫持，自动触发组件的render。react采用setState机制来触发组件render。
3. vue依赖收集采用依赖追踪能够精确的定位到需要重新渲染的组件，而react是从父组件一直到自组件都会重新渲染，需要手动在shouldComponentUpdate的生命周期里优化。
4. 状态管理的思想不同，vue中的state是可变的，react中的state是不可变的(redux)。


总结：对于框架的选型，首先看团队，如果团队更喜欢react那么写代码的时候也会有激情，反之是心里上对框架本身的不满就会导致更多的问题。对于react是否更适合大型项目而vue更适合小型项目并不是很赞同，只要是前端规范制度完善，不断总结沉淀哪个框架都能做出高质量的项目。