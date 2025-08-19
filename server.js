const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Enable CORS
app.use(cors());
app.use(express.json());

// Store connected users
const users = {};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('join', (username) => {
    users[socket.id] = username;
    socket.broadcast.emit('userJoined', username);
    console.log(`${username} joined the chat`);
  });

  // Handle message sending
  socket.on('sendMessage', (message) => {
    const username = users[socket.id];
    const messageData = {
      id: Date.now(),
      username,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    
    io.emit('newMessage', messageData);
    console.log(`${username}: ${message}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      delete users[socket.id];
      socket.broadcast.emit('userLeft', username);
      console.log(`${username} left the chat`);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
