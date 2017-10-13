

const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

// pass in the http server into socketio and grab the webscoket server as io
const io = socketio(app);

const onJoin = (sock) => {
  const socket = sock;
  socket.on('join', () => {
    socket.join('room1');
    console.log('Someone joined');
  });
};

const sendDraw = (sock) => {
  const socket = sock;
  socket.on('draw', (data) => {
    io.in('room1').emit('draw', data);
  });
};

io.sockets.on('connection', (socket) => {
  onJoin(socket);
  sendDraw(socket);
});
