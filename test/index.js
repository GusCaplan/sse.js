const fs = require('fs');
const http = require('http');
const http2 = require('http2');
const sse = require('../');
const read = (p) => fs.readFileSync(require.resolve(p));

http.createServer((req, res) => {
  const c = sse(res);
  setInterval(() => {
    c.send('time', Date.now());
  }, 1000);
}).listen(1337);

http2.createSecureServer({
  key: read('./localhost-privkey.pem'),
  cert: read('./localhost-cert.pem'),
}).on('stream', (stream) => {
  const c = sse(stream);
  setInterval(() => {
    c.send('time', Date.now());
  }, 1000);
}).listen(1338);
