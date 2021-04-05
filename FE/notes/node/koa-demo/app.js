'use strict'

const Koa = require('koa');
const app = new Koa();
app.use(async ctx => {
  ctx.body = 'HelloWorld';
});

app.listen(3000);

module.exports = app
