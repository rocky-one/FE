const ejs = require('ejs');
const ReactDomServer = require('react-dom/server');
const serialize = require('serialize-javascript');
const asyncBootstrap = require('react-async-bootstrapper');
const Helmet = require('react-helmet').default;

const getStore = (stores) => {
    return Object.keys(stores).reduce((result,storeName) => {
        result[storeName] = stores[storeName].toJson();
        console.log(result[storeName],2)
        return result;
    },{})
}

module.exports = (bundle, templeate, req, res) => {
    return new Promise((resolve, reject) => {
        const createStoreMap = bundle.createStoreMap;
        const createApp = bundle.default;
        const routerContext = {};
        const stores = createStoreMap();
        const app = createApp(stores, routerContext, req.url);

        asyncBootstrap(app).then(() => {
            if (routerContext.url) {
                res.status(302).setHeader('Location', routerContext.url);
                res.end();
                return;
            }
            const helmet = Helmet.rewind();
            const content = ReactDomServer.renderToString(app);
            const store = getStore(stores);
            const html = ejs.render(templeate, {
                appString: content,
                initialState: serialize(store),
                meta: helmet.meta.toString(),
                title: helmet.title.toString(),
                style: helmet.style.toString(),
                link: helmet.link.toString(),
            });
            res.send(html);
            resolve();
            //res.status(200).send(template.replace('<!-- app -->', content));
        }).catch(reject)
    })
}
