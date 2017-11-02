const headers = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
};

module.exports = function sse(response) {
  if (response.respond) {
    headers[':status'] = 200;
    response.respond(headers);
  } else {
    response.Connection = 'keep-alive';
    response.writeHead(200, headers);
  }

  response.write(':ok\n\n');

  return {
    send(event, data, id) {
      if (id !== undefined)
        response.write(`id: ${id}\n`);
      response.write(`event: ${event}\n`);
      if (!data)
        return;
      const lines = String(data).replace(/\r(\n)?/g, '\n').split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (i + 1 === lines.length)
          response.write(`data: ${lines[i]}\n\n`);
        else
          response.write(`data: ${lines[i]}\n`);
      }
      return true;
    },
    retry(time) {
      return response.write(`retry: ${time}\n\n`);
    },
  };
};
