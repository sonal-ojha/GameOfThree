const io = require('socket.io')(3000);

// List of users connected with key as unique Socket ID
const users = {};

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.emit('user-connected', name);
  });

  socket.on('disconnect', () => {
    socket.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});
