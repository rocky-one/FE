## 异步串行 ##

npm包开发时本地如何调试

1. 如果是开发一个脚手架，需要把本地脚手架代码链接到全局的node_modules文件夹下面

```javascript
cd you-cli-dir
npm link
```

2. 如果开发的是一个nmp包，先把代码链接到全局node_modules文件夹下面。然后进入到测试项目执行link命令。

```javascript
cd you-js-lib-dir
npm link

cd you-project-dir (本地某个开发项目)
npm link you-js-lib (这里是包名称)

```

3. 开发完成后需要移除本地的js-lib软链接。

```javascript
cd you-js-lib-dir
npm unlink

cd you-project-dir (本地某个开发项目)
npm unlink you-js-lib (这里是包名称)
```

4. 这里重新安装线上npm时，可能报错，可尝试移除项目中的node_modules文件夹。