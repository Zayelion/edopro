const next = require('next');

const port = parseInt(process.env.NEXT_PORT || '3000', 10);
const hostname = process.env.NEXT_HOST || '127.0.0.1';
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, hostname, port, dir: __dirname + '/..' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const http = require('http');
  const server = http.createServer((req, res) => handle(req, res));

  server.listen(port, hostname, () => {
    console.log(`Next server ready at http://${hostname}:${port}`);
  });
});
