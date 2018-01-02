const fs = require('fs');
const http = require('http');
const http2 = require('http2');
const sse = require('../');
const read = (p) => fs.readFileSync(require.resolve(p));

const index = fs.readFileSync(`${__dirname}/test.html`);

http.createServer((req, res) => {
  if (req.url === '/events') {
    const c = sse(res);
    setInterval(() => {
      c.send('time', Date.now());
    }, 1000);
  } else {
    res.end(index);
  }
}).listen(1337);

http2.createSecureServer({
  key: read('./localhost-privkey.pem'),
  cert: read('./localhost-cert.pem'),
}).on('request', (req) => {
  if (req.url === '/events') {
    const c = sse(req);
    setInterval(() => {
      c.send('time', Date.now());
    }, 1000);
  } else {
    req.stream.end(index);
  }
}).listen(1338);
