const axios = require('axios');
const path = require('path');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const ReactDomServer = require('react-dom/server');
const serverConfig = require('../../build/webpack.config.server');

const Module = module.constructor;
const memory = new MemoryFs();
const serverCompoler = webpack(serverConfig);

serverCompoler.outputFileSystem = memory;

let serverBundle = null;

serverCompoler.watch({}, (err, stats) => {
    if (err) throw err;
    stats = stats.toJson();
    stats.errors.forEach(err => console.error(err));
    stats.warnings.forEach(warn => console.error(warn));
    const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename);
    const bundle = memory.readFileSync(bundlePath, 'utf-8');
    const m = new Module();
    m._compile(bundle, 'serverEntry.js');
    serverBundle = m.default;
})
const getTemplate = () => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:8089/public/index.html').then(res => {
            resolve(res.data);
        }).catch(reject);
    })
}

module.exports = function (app) {
    app.get('*', function (req, res) {
        getTemplate().then(template => {
            const content = ReactDomServer.renderToString(serverBundle);
            console.log(content,'content')
            res.send(template.replace('<!-- app -->'), content);
        })
    })
}