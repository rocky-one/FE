# 阴影

### 绘制阴影常用的方法是：阴影映射
1. 阴影贴图：以光源的透视图来渲染场景，就是把整个场景绘制到深度纹理中，把深度值的结果储存到纹理中，这些储存的深度值叫做深度贴图或者阴影贴图。其实就是离屏绘制。
2. 然后再把整个场景绘制到真正的canvas画布中去，