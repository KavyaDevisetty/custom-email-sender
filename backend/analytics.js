const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

function updateAnalytics(data) {
  io.emit('emailStatus', data);
}

module.exports = { updateAnalytics };


