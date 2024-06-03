#### key作用
这就要扯到 虚拟 DOM 的 Diff 算法了，有了 key 属性后，就可以与组件建立了一种对应关系，react 根据 key 来决定是销毁重新创建组件还是更新组件。

key 相同，若组件属性有所变化，则 react 只更新组件对应的属性；没有变化则不更新。

key 值不同，则 react 先销毁该组件(有状态组件的 componentWillUnmount 会执行)，然后重新创建该组件（有状态组件的 constructor 和 componentWillUnmount 都会执行）

#### index 作为 key 的坑
先看段代码，

{this.state.data.map((item,index) => return <Item key="{idx}" v="{v}" />) }

<!-- 开始时：['a','b','c']=> -->
<ul>
  <li key="0">a <input type="text" /></li>
  <li key="1">b <input type="text" /></li>
  <li key="2">c <input type="text" /></li>
</ul>

<!-- 数组重排 -> ['c','b','a'] => -->
<ul>
  <li key="0">c <input type="text" /></li>
  <li key="1">b <input type="text" /></li>
  <li key="2">a <input type="text" /></li>
</ul>
上面实例中在数组重新排序后, key 对应的实例都没有销毁，而是重新更新。具体更新过程我们拿 key=0 的元素来说明， 数组重新排序后：

组件重新 render 得到新的虚拟 dom；

新老两个虚拟 dom 进行 diff，新老版的都有 key=0 的组件，react 认为同一个组件，则只可能更新组件；

然后比较其 children，发现 key 相同，只是内容的文本内容不同（由 a--->c)，而 input 组件并没有变化，这时触发组件的componentWillReceiveProps方法，从而更新其子组件文本内容;

因为组件的 children 中 input 组件没有变化，其又与父组件传入的 props 没有关联，所以 input 组件不会更新(即其 componentWillReceiveProps 方法不会被执行)，导致用户输入的值不会变化。

这就是 index 作为 key 存在的问题，所以不要使用 index 作为 key。

key 的值要保持唯一
在数组中生成的每项都要有 key 属性，并且 key 的值是一个永久且唯一的值，即稳定唯一。不能通过 Math.random() 来随机生成 key

