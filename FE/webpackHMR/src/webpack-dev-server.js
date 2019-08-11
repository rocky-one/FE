const path = require('path')
const express = require('express')
const mime = require('mime')
const webpack = require('webpack')
const config = require('./webpack.config')
const MemoryFileStystem = require('memory-fs')
const compiler = webpack(config)

class Server {
    constructor(compiler){
        this.compiler = compiler
        let sockets = []
        let lastHash
        // 编译完成回调
        compiler.hooks.done.tap('webpack-dev-derver', stats=>{
            // 缓存哈希
            lastHash = stats.hash
            sockets.forEach(socket=>{
                // 发送最新的hash值
                socket.emit('hash', stats.hash)
                socket.emit('ok')
            })
        })
        // 创建一个express app
        const app = new express()
        compiler.watch({},err=>{
            console.log('编译完成')
        })
        // 文件输出到内存中
        const fileSystem = new MemoryFileStystem()
        compiler.outputFileSystem = fileSystem
        function middleware(req, res, next) {
            let filename = path.join(config.output.path, req.url.slice(1))
            let stat = fileSystem.statSync(filename)
            if(stat.isFile()){
                let content = fileSystem.readFileSync(filename)
                let contentType = mime.getType(filename)
                res.setHeader('Content-Type', contentType)
                res.statusCode = res.statusCode || 200
                res.send(content)
            }else{
                return res.sendState(404)
            }
        }
        app.use(middleware)
        this.server = require('http').createServer(app)
        // 启动一个socket服务
        const io = require('socket.io')(this.server)
        io.on('connection',(socket) => {
            sockets.push(socket)
        })
    }
    listen(port){
        this.server.listen(port,()=>{
            console.log(`服务启动成功,端口${port}`)
        })
    }
}

const server = new Server(compiler)

server.listen(8088)