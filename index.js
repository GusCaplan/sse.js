'use strict';

const headers = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
};

module.exports = function sse(response) {
  if (response.stream)
    response = response.stream;
  if (response.respond) {
    headers[':status'] = 200;
    response.respond(headers);
  } else {
    response.Connection = 'keep-alive';
    response.writeHead(200, headers);
  }

  response.write(':ok\n\n');

  return {
    send({ event, data, id, comment }) {
      const end = data !== undefined || comment !== undefined ? '' : '\n';
      if (id !== undefined)
        response.write(`id: ${id}\n${end}`);
      if (event !== undefined)
        response.write(`event: ${event}\n${end}`);
      if (comment !== undefined)
        multilineSend(response, comment.toString());
      if (data !== undefined)
        multilineSend(response, data.toString());
    },
    retry(time) {
      return response.write(`retry: ${time}\n\n`);
    },
  };
};

function multilineSend(stream, text) {
  const lines = text.split(/\r(\n)?/g);
  const len = lines.length - 1;
  for (let i = 0; i < len; i++)
    stream.write(`data: ${lines[i]}\n`);
  stream.write(`data: ${lines[len]}\n\n`);
}
