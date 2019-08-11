import '../client.js'
function render() {
    const list = require('./list').default
    const ele = document.getElementById('root')
    let html = ''
    for (let i = 0; i < list.length; i++) {
        html += list[i].name
    }
    ele.innerHTML = html
}
render()

if (module.hot) {
    module.hot.accept(['./list'], render)
}