const express = require('express');
const ReactSSR = require('react-dom/server');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');
const dev = process.env.NODE_ENV === 'development';
const bodyParser = require('body-parser');
const session = require('express-session');
const port = 8091;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    maxAge: 10 * 60 * 1000,
    name: 'tid',
    resave: false,
    saveUninitialized: false,
    secret: 'react class'// 定义字符串加密session
}));

app.use(favicon(path.join(__dirname,'../src/favicon.ico')));
app.use('/api/user',require('./utils/handleLogin'));
app.use('/api', require('./utils/proxy'));

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
