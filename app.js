const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Basic config
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

// Socket.io
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('send-location', (data) => {
    io.emit('receive-location', data); 
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 10000; // Render uses 10000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});