# 安装docker

1. 先安装依赖包
sudo yum install -y yum-utils

2. 设置yum源
sudo yum-config-manager \
    --add-repo \
    https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

sudo sed -i 's/download.docker.com/mirrors.aliyun.com\/docker-ce/g' /etc/yum.repos.d/docker-ce.repo

# 官方源
# $ sudo yum-config-manager \
#     --add-repo \
#     https://download.docker.com/linux/centos/docker-ce.repo

3. 安装docker
sudo yum install docker-ce docker-ce-cli containerd.io

安装完成后：docker version ｜ docker info 查看版本信息

4. 启动
$ sudo systemctl enable docker
$ sudo systemctl start docker

5. 建立docker 用户组
sudo groupadd docker
sudo usermod -aG docker $USER

6. 镜像加速
修改 /etc/docker/daemon.json
{
    "registry-mirrors": [
        "https://1nj0zren.mirror.aliyuncs.com",
        "https://docker.mirrors.ustc.edu.cn",
        "http://f1361db2.m.daocloud.io",
        "https://dockerhub.azk8s.cn"
    ]
}
配置完成后重启：
sudo systemctl daemon-reload
sudo systemctl restart docker


# docker镜像制作

1. 创建一个node.js程序
2. 在node.js程序下创建Dockerfile文件
```
#设置基础镜像,如果本地没有该镜像，会从Docker.io服务器pull镜像
FROM node

#创建app目录,保存我们的代码
RUN mkdir -p /usr/src/node
#设置工作目录
WORKDIR /usr/src/node

#复制所有文件到 工作目录。
COPY . /usr/src/node

#编译运行node项目，使用npm安装程序的所有依赖,利用taobao的npm安装

WORKDIR /usr/src/node/website
RUN npm install --registry=https://registry.npm.taobao.org

#暴露container的端口
EXPOSE 8888

#运行命令
CMD ["npm", "start"]
```

3. 创建
docker image build -t koa-demo .
上面代码中，-t参数用来指定 image 文件的名字，后面还可以用冒号指定标签。如果不指定，默认的标签就是latest。最后的那个点表示 Dockerfile 文件所在的路径，上例是当前路径，所以是一个点。

4. 运行
docker container run -p 8000:3000 -it koa-demo