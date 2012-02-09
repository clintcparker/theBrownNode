var http = require('http');

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hellooooooooo World\n');
}).listen(process.env.C9_PORT || process.env.PORT || 3000);

console.log('Server running at http://127.0.0.1:8124/');