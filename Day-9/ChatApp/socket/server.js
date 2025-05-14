import { Server } from "socket.io";
import express from 'express';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);
let onlineUsers = [];

const io = new Server(httpServer, { 
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type"]
  },
  pingTimeout: 60000,
  path: "/socket.io"
});

io.on("connection", (socket) => {
  console.log("New Connection", socket.id);

  // Listen to a connection
  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({ userId, socketId: socket.id });
      console.log("onlineUsers", onlineUsers);
    }
    io.emit("getOnlineUsers", onlineUsers.map(user => user.userId));
  });

  // Listen to message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.recipientId);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date()
      });
    }
  });

  // Listen to disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers.map(user => user.userId));
  });
});

const PORT = 3002;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});