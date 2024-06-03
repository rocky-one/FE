# 实现一个简单的webGl程序步骤
本篇文章主要讲述一下创建一个简单的webGl程序的步骤。
1. 创建webGl上下文
2. 创建着色器，顶点着色器和片元着色器
3. 创建缓存对象，把数据写入缓存，bufferData
4. 从缓存中读取数据, vertexAttribPointer
5. 运行着色程序进行绘制，drawArrays

### 1.创建webGl上下文
创建webGl上下文和创建canvas上下文是一样的，只是参数不同，看下面代码。
```javascript
const canvas = document.getElementById('canvas')
// 获取webgl上下文
const gl= canvas.getContext('webgl')
```

### 2.创建顶点着色器和片断着色器
着色器是使用[GLSL](https://learnopengl-cn.readthedocs.io/zh/latest/01%20Getting%20started/05%20Shaders/)语言编写，可以定义不同类型的变量属性具体可查阅相关资料。

顶点着色器：用来描述要绘制图形的顶点位置信息，比如我们要绘制一个三角形，只需要三个顶点即可，那么着色器就会执行三次计算出每个顶点对应的像素位置。

片断着色器：为每个像素设置颜色值，当顶点着色器计算完位置后，接下来绘制的时候片断着色器会询问每个像素的颜色完成每个点的颜色设置。

GLSL在js中可以写成字符串形式，看下面示例代码。
```javascript
// 顶点着色器
const vertexShaderSource = `
  attribute vec4 a_position;

  void main() {
    gl_Position = a_position;   
  }
`
// 片断着色器
const fragmentShaderSource = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(1, 0, 0.5, 1);
  }  
`
```
接下来开始创建着色器。
```javascript
// 创建顶点着色器
const vertexShader = gl.createShader(gl.VERTEX_SHADER)
gl.shaderSource(vertexShader, vertexShaderSource)
gl.compileShader(vertexShader)

// 创建片断着色器
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
gl.shaderSource(fragmentShader)
gl.compileShader(fragmentShader)
```

### 3.创建缓存对象
webGl是使用GPU进行绘制所以我们需要在GPU中创建一个缓存对象，然后给这个缓存对象赋值，webGl在绘制的时候就可以使用这个缓存对象了。
```javascript
// 创建buffer
const positionBuffer = gl.createBuffer()
// 第一个参数是缓存对象的类型名称（也是目标） 第二个参数是缓存对象的名称也就是上面的positionBuffer
// 第一个参数分为gl.ARRAY_BUFFER(VBO)顶点属性的buffer 和 gl.ELEMENT_ARRAY_BUFFER(IBO)元素索引的buffer两种类型
// 这里使用顶点缓存，
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
const position = [
  0, 0, 0,   1, 0, 0, 1,
  0, 0.5, 0, 0, 1, 0, 1,
  0.7, 0, 0, 0, 0, 1, 1
]
// bufferData是通过指定缓存目标类型(gl.ARRAY_BUFFER)来进行数据传递的
// 当bindBuffer之后想要操作缓存对象(positionBuffer)，就不能直接对positionBuffer进行操作了
// 而是直接操作目标target，gl.ARRAY_BUFFER这里表示的是顶点缓存对象目标
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW)
```

其中上面的缓存对象有一点需要注意，就是bindBuffer之后需要直接操作目标target，而不是操作createBuffer()返回的值positionBuffer。同一时间只能绑定一个类型的缓冲对象，当执行了bindBuffer之后缓存对象(positionBuffer)相当于已经绑定到当前context下了，所以这里通过缓存目标类型就知道我们是要操作哪个缓存对象。当往顶点缓冲区传入数据的时候就会自动进入到当前已经绑定的那个缓存对象中去。
要执行其他buffer，再次bindBuffer



### 4. 从缓存中读取数据
先需要激活属性。
```javascript
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
// 激活属性，不被激活的属性无法使用，激活后可以调用 vertexAttribPointer()等方法
gl.enableVertexAttribArray(positionAttributeLocation)
```
然后告诉webgl从缓存中读取数据
```javascript
const size = 3
const type = gl.FLOAT
const normalize = false
const stride = 3
const offset = 0
// 设置当前顶点缓存区对象的一些属性，包括赋值，告诉webgl从缓存中读取数据
// 第一个参数：要修改的顶点属性的索引
// size：每个顶点需要的单元数量 1-4，也就是从顶点中每次取几个值
// type：指定数组中每个元素的数据类型 gl.FLOAT gl.BYTE 等
// normalize：是否对数据做归一化到一定的范围处理
// stride：间隔 跨过的意思，以字节为单位。如果stride=0表示下一个顶点紧挨着当前顶点。
// 为了性能优化把颜色和坐标放到一个数组中[x,y,z, r,g,b,a,      x,y,z, r,g,b,a] 每一项占4个字节，stride = 4个字节 * 7项为一组 = 28，也就是每一个跨度占28个字节。
// offset：偏移量，从顶点缓存对象的某一个字节位置开始
gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, 7 * 4, offset)
```
