const express=require("express");
const app=express();
const http=require("http");
const cors=require("cors");
const { Server }=require("socket.io");
app.use(cors());

const server=http.createServer(app);
const io=new Server(server, {
cors: {
origin: "http://localhost:5173",
methods: ["GET", "POST"],
},
});

// Track users in rooms
const roomUsers = {};

io.on("connection", (socket) => {
console.log(`User Connected: ${socket.id}`);

socket.on("join_room", (data) => {
const { room, username } = data;
socket.join(room);

// Add user to room tracking (keyed by socket.id so duplicate
// usernames in the same room are each counted correctly)
if (!roomUsers[room]) {
  roomUsers[room] = new Set();
}
roomUsers[room].add(socket.id);
socket.username = username;
socket.room = room;

console.log(`User ${username} joined room: ${room}`);

// Broadcast updated user count to the room
io.to(room).emit("room_data", {
  userCount: roomUsers[room].size,
});
});
socket.on("send_message", (data) => {
// Broadcast message to everyone in the room including sender
io.to(data.room).emit("receive_message", data);
});

socket.on("typing", (data) => {
// Broadcast typing status to others in the room
socket.to(data.room).emit("user_typing", data);
});

socket.on("disconnect", () => {
console.log("User Disconnected", socket.id);

if (socket.room) {
  if (roomUsers[socket.room]) {
    roomUsers[socket.room].delete(socket.id);

    // Broadcast updated user count
    io.to(socket.room).emit("room_data", {
      userCount: roomUsers[socket.room].size,
    });

    // Clean up empty rooms to avoid leaking memory
    if (roomUsers[socket.room].size === 0) {
      delete roomUsers[socket.room];
    }
  }
}
});
});

const PORT=process.env.PORT || 3001;

server.listen(PORT, () => {
console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
