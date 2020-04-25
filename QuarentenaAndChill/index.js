const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const users = {};

app.use(express.static(path.join(__dirname, './public')));

app.get('/',function(req,res) {
  res.sendFile('index.html');
});

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('mouse', data => {
    socket.broadcast.emit('mouse', data);
  })
  socket.on('play', () => {
    socket.broadcast.emit('play');
  }) 
  socket.on('pause', () => {
    socket.broadcast.emit('pause');
  }) 
  socket.on('video_time', time => {
    socket.broadcast.emit('video_time', time);
  }) 
  socket.on('chosen-video', urlYTVideo => {
    socket.broadcast.emit('chosen-video', urlYTVideo);
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  })
})

server.listen(PORT, () => {
	console.log(`Servidor iniciado na porta ${PORT}`);
});