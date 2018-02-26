'use strict';

const fs = require('fs');
const http = require('http');
const http2 = require('http2');
const sse = require('../');
const read = (p) => fs.readFileSync(require.resolve(p));

const index = fs.readFileSync(`${__dirname}/test.html`);

http.createServer((req, res) => {
  if (req.url === '/events')
    tenprint(res);
  else
    res.end(index);
}).listen(1337);

http2.createSecureServer({
  key: read('./localhost-privkey.pem'),
  cert: read('./localhost-cert.pem'),
}).on('request', (req) => {
  if (req.url === '/events')
    tenprint(req);
  else
    req.stream.end(index);
}).listen(1338);

function tenprint(stream) {
  const c = sse(stream);
  setInterval(() => {
    const data = Math.random() > 0.5 ? '╱' : '╲';
    c.send({ data });
  }, 10);
}
