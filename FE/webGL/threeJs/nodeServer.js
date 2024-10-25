const static = require('koa-static');
const Koa = require('koa');
const cors = require('koa2-cors');
const http = require("http");
const https = require("https");
const fs = require("fs");

const app = new Koa();
app.use(cors());
app.use(static('./'));
// app.listen(8085);


// console.log('监听:http://localhost:8085/', 'http://localhost:8085/three/examples/');

http.createServer(app.callback()).listen(3000);
const options = {
  key: fs.readFileSync("./server.key", "utf8"),
  cert: fs.readFileSync("./server.cert", "utf8")
};
https.createServer(options, app.callback()).listen(443);