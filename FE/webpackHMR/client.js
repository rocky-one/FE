const socket = require('socket.io-client')()
let currentHash
let hotCurrentHash // 上一次
class Emitter {
    constructor() {
        this.listeners = {}
    }
    on(type, listeners) {
        this.listeners[type] = listeners
    }
    emit(type) {
        this.listeners[type] && this.listeners[type]()
    }
}
const hotEmitter = new Emitter()

hotEmitter.on('webpackHotUpdate', () => {
    if (!hotCurrentHash || hotCurrentHash === currentHash) {
        return hotCurrentHash = currentHash
    }
    hotCheck()
})
function hotCheck() {
    hotDownloadMainfest().then(update => {
        let chunkIds = Object.keys(update.c)
        chunkIds.forEach(chunkId => {
            hotDownloadUpdateChunk(chunkId)
        })
    })
}
// 下载改变过的文件
function hotDownloadUpdateChunk(chunkId) {
    const script = document.createElement('script')
    script.charset = 'utf-8'
    script.src = `/${chunkId}.${hotCurrentHash}.hot-update.js`
    document.head.appendChild(script)
}
// 询问服务器 这一次相对于上一次 哪些模块发生了变化
function hotDownloadMainfest() {
    return new Promise((resolve) => {
        let request = new XMLHttpRequest()
        // hot-update.json 存放上一次编译到这一次编译
        let path = '/' + hotCurrentHash + '.hot-update.json'
        request.open('GET', path, true)
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                resolve(JSON.parse(request.responseText))
            }
        }
        request.send()
    })
}
function onConnect() {
    console.log('客户端连接成功')
}

function reloadApp(hot) {
    if (hot) {
        // webpack下的hot
        hotEmitter.emit('webpackHotUpdate', currentHash)
    } else {
        // 刷新页面
        window.location.reload()
    }
}
socket.on('hash', (hash) => {
    currentHash = hash
})
// 重新render
socket.on('ok', () => {
    reloadApp(true)
})
window.hotCreateModule = function (moduleId) {
    let hot = {
        _acceptedDependencies: {},
        accept: function (deps, callback) {
            for (let i = 0; i < deps.length; i++) {
                hot._acceptedDependencies[deps[i]] = callback
            }
        }
    }
    return hot
}
window.webpackHotUpdate=function(chunkId, moreModules) {
    for (let moduleId in moreModules) {
        let oldModule = __webpack_require__.c[moduleId]
        // parent是 哪些模块引用了这个模块
        // children 是这个模块引用了哪些模块
        // parent是 =['./src/index.js']
        let {
            parents, children
        } = oldModule
        // 更新为最新代码
        let module = __webpack_require__.c[moduleId] = {
            i: moduleId,
            l: false,
            exports: {},
            parents,
            children,
            hot: window.hotCreateModule(moduleId)
        }
        moreModules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
        module.l = true
        parents.forEach(parent=>{
            let parentModule = __webpack_require__.c[parent]
            parentModule && parentModule.hot && parentModule.hot._acceptedDependencies&& parentModule.hot._acceptedDependencies[moduleId]()
        })
        hotCurrentHash = currentHash
    }
}
socket.on('connect', onConnect)