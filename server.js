const io = require('socket.io')(3000);

// List of users connected with key as unique Socket ID
const users = {};
// single source of truth 
let currentValue;

io.on('connection', socket => {

  // Establish a conection with a Player
  socket.on('new-user', ({ name, randomNumber }) => {
    users[socket.id] = name;
    currentValue = randomNumber;
    socket.emit('user-connected', ({ name, currentValue }));
  });

  // User selection between operation types {-1, 0 & 1}
  socket.on('user-input', (operation) => {
    // case to handle for random whole number is '0'
    if (currentValue === 0) {
      socket.emit('least-random-number-zero', '0');
      return;
    }
    const initialValue = currentValue;
    if (operation === '-1') {
      if ((Number(currentValue) - 1) % 3 === 0) {
        currentValue = (Number(currentValue) - 1) / 3;
      } else {
        // Emit event to suggest correct operation type to perform
        socket.emit('suggest-correct-operation', currentValue);
        return;
      }
    } else if (operation === '+0') {
      if (Number(currentValue) % 3 === 0) {
        currentValue = Number(currentValue) / 3;
      } else {
        // Emit event to suggest correct operation type to perform
        socket.emit('suggest-correct-operation', currentValue);
        return;
      }
    } else {
      // +1 operation selected
      if ((Number(currentValue) + 1) % 3 === 0) {
        currentValue = (Number(currentValue) + 1) / 3;
      } else {
        // Emit event to suggest correct operation type to perform
        socket.emit('suggest-correct-operation', currentValue);
        return;
      }
    }
    // Update the Result calculated with operation type on initial value
    socket.emit('user-input-calculated', ({ operation, currentValue, initialValue }));
  });

  // update the single source of truth 'currentValue' after system operation
  socket.on('system-input-value', value => {
    currentValue = value;
  });

  socket.on('disconnect', () => {
    socket.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});
