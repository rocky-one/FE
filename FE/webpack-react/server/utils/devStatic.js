const axios = require('axios');
const path = require('path');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const serverConfig = require('../../build/webpack.config.server');
const proxy = require('http-proxy-middleware');
const Module = module.constructor;
const memory = new MemoryFs();
const NativeModule = require('module');
const vm = require('vm');
const serverRender = require('./serverRender');

const getModuleFromString = (bundle, filename) => {
    const m = { exports: {}}
    const wrapper = NativeModule.wrap(bundle)
    const script = new vm.Script(wrapper, {
        filename: filename,
        displayErrors: true,
    })
    const result = script.runInThisContext()
    result.call(m.exports, m.exports, require, m)
    return m
}
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
    // const m = new Module();
    // m._compile(bundle, 'serverEntry.js');
    const m = getModuleFromString(bundle, 'serverEntry.js');

    serverBundle = m.exports;
})
const getTemplate = () => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:8089/public/server.ejs').then(res => {
            resolve(res.data);
        }).catch(reject);
    })
}

module.exports = function (app) {

    app.use('/public', proxy({
        target: 'http://localhost:8089'
    }))
    app.get('*', function (req, res, next) {
        getTemplate().then(template => {
            return serverRender(serverBundle, template, req, res)
        }).catch(next)
    })
}
