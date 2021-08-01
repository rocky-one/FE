## lerna ##

优势
1. 减少重复性的操作，例如每个包的发布、版本升级等
2. 架构标准化，创建项目、代码提交检测、部署发布流程等

lerna常用命令
1. lerna init 初始化项目
2. lerna create packageName 创建项目
3. lerna add XXX 安装某个依赖到所有的packages中
4. lerna add XXX packages/core 安装到一个指定的packages中去
5. lerna clean 移除node_modules
6. lerna bootstrap 重新安装依赖
7. lerna exce -- XXX 在每一个项目中执行一个命令,也可以指定某个具体的包
8. lerna run 执行的是npm的命令

发布
1. lerna publish
 * 需要把npm group改为公开，group默认都是私有的，需改为共有的，在package中添加access:'public'。
 