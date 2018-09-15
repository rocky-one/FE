const express = require('express');
const ReactSSR = require('react-dom/server');
const fs = require('fs');
const path = require('path');
const dev = process.env.NODE_ENV === 'development';
const app = express();
const port = 8091;


if (!dev) {
    const erverEntry = require('../dist/serverEntry').default;
    const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8');
    // 静态文件 静态内容还是服务端渲染内容
    app.use('/public', express.static(path.join(__dirname, '../dist')));
    app.get('*', (req, res) => {
        const strings = ReactSSR.renderToString(erverEntry);
        res.send(template.replace('<app></app>', strings));
    });
}else{
    const devStatic = require('./utils/devStatic');
    devStatic(app);
}


app.listen(port, () => {
    console.log(`express 监听端口${port}`)
})