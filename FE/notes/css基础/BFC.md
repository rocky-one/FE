## BFC ##

#### BFC Block Formatting Contents, 即块级格式化上下文 ####

简单理解BFC是一个独立的容器和外部容器互不影响

#### 触发BFC的条件
- body根元素节点
- 浮动元素float
- 定位元素 absolute、fixed
- display为inline-block、table-cells、flex
- overflow: hidden、auto、scroll (除了bisible)

#### BFC常见问题
1. 在一个BFC容器里的元素之间的margin会发生重叠。解决方案把带有margin的元素分别放到各自的一个BFC容器中
2. 子元素设置了浮动后(脱离了文档流),父元素的高度不会被撑高问题。解决方案给父元素设置overflow:hidden让其成为一个BFC容器即可清除浮动
3. 解决两栏自适应问题,左侧盒子固定宽并且浮动,右侧overflow:hiddne,也就是BFC盒子不会与float的盒子重叠

