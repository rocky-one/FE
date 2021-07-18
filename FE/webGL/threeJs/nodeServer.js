const static = require('koa-static');
const Koa = require('koa');
var cors = require('koa2-cors');

const app = new Koa();
app.use(cors());
app.use(static('./'));
app.listen(8085);

console.log('监听:http://localhost:8085/');