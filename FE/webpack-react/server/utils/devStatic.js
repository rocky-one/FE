const axios = require('axios');
const path = require('path');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const ReactDomServer = require('react-dom/server');
const serverConfig = require('../../build/webpack.config.server');
const proxy = require('http-proxy-middleware');
const asyncBootstrap = require('react-async-bootstrapper');
const ejs = require('ejs');
const serialize = require('serialize-javascript');
const Module = module.constructor;
const memory = new MemoryFs();
const NativeModule = require('module');
const vm = require('vm');
const Helmet = require('react-helmet').default;

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

let serverBundle = null, createStoreMap = null;

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

    serverBundle = m.exports.default;
    createStoreMap = m.exports.createStoreMap;
})
const getTemplate = () => {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:8089/public/server.ejs').then(res => {
            resolve(res.data);
        }).catch(reject);
    })
}
const getStore = (stores) => {
    return Object.keys(stores).reduce((result,storeName) => {
        result[storeName] = stores[storeName].toJson();
        console.log(result[storeName],2)
        return result;
    },{})
}
module.exports = function (app) {

    app.use('/public', proxy({
        target: 'http://localhost:8089'
    }))
    app.get('*', function (req, res) {
        getTemplate().then(template => {
            const routerContext = {};
            const stores = createStoreMap();
            const app = serverBundle(stores, routerContext, req.url);

            asyncBootstrap(app).then(() => {
                if (routerContext.url) {
                    res.status(302).setHeader('Location', routerContext.url);
                    res.end();
                    return;
                }
                const helmet = Helmet.rewind();
                const content = ReactDomServer.renderToString(app);
                const store = getStore(stores);
                const html = ejs.render(template, {
                    appString: content,
                    initialState: serialize(store),
                    meta: helmet.meta.toString(),
                    title: helmet.title.toString(),
                    style: helmet.style.toString(),
                    link: helmet.link.toString(),
                });
                res.send(html);
                //res.status(200).send(template.replace('<!-- app -->', content));
            })

        })
    })
}
