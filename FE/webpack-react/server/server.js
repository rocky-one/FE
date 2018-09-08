const express = require('express');
const ReactSSR = require('react-dom/server');
const erverEntry = require('../dist/serverEntry').default;
const app = express();
const port = 8091;
app.get('*',(req,res)=>{
    const strings = ReactSSR.renderToString(erverEntry);
    res.send(strings);
});

app.listen(port,()=>{
    console.log(`express 监听端口${port}`)
})