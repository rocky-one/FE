### canvas在高清屏下会模糊的原因
高清屏下devicePixelRatio可能等于2或3，和CSS中我们写的1px像素比不一致。
我们平时在css中写的1px像素，在高清屏下，实际渲染的是2px或3px的像素，导致模糊。

概念：
物理像素：设备上真实的像素点
逻辑像素：开发中写的px单位，1px可能等于2px或3px的物理像素

canvas标签的行内属性width、height，设置的是物理像素，也就对应屏幕中真是的像素分辨率
canvas标签的style属性width、height，设置的是逻辑像素，也就是开发中写的px单位

假设代码如下，最终竖线的结果就会模糊
```
<canvas id="myCanvas" width="1000" height="1000" style="width:1000px; height:1000px; border:1px solid #000000;" ></canvas>

<script>
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  // 画一条竖线
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.moveTo(100, 100); // 起始点
  ctx.lineTo(100, 400); // 结束点
  ctx.stroke();
</script>

```
画了1px宽度的竖线，1px是逻辑像素，假设devicePixelRatio = 2
那么相当于被拉伸到2px，拉伸到2px后，相当于1px后面的点没有颜色值，这个时候浏览器会通过计算的方式把颜色值补齐(双线性插值)

线性插值：例如我们要绘制一个点 [0, 0]，颜色为'red'

拉伸后需要绘制 4 个物理像素为：
```
[ 0, 0 ], [ 1, 0 ]
[ 0, 1 ], [ 1, 1 ]

- **水平插值**：混合 `(0,0)` 的红色和 `(1,0)` 的白色。
- **垂直插值**：混合 `(0,0)` 的红色和 `(0,1)` 的白色。
- **最终颜色**：红色与白色的混合色（如粉色 `#FF7F7F`），颜色混合后导致了模糊

最终 4 个物理像素的颜色可能为：
```
[ #FF7F7F, #FF7F7F ]
[ #FF7F7F, #FF7F7F ]

```
