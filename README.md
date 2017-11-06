# SSE

### Easy SSE for http and http2

```js
const sse = require('sse');

require('http').createServer((req, res) => {
  const c = sse(res);
  setInterval(() => {
    c.send('time', Date.now());
  }, 1000);
}).listen(80);

// OR

require('http2').createSecureServer({
  key: ...
  cert: ...
}).on('stream', (stream) => {
  const c = sse(stream);
  setInterval(() => {
    c.send('time', Date.now());
  }, 1000);
}).listen(443);
```