const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
app.use(express.static("public"));

const rooms = {};

function generateRoomCode() {
  return Math.random().toString(36).substr(2, 4).toUpperCase();
}

io.on("connection", (socket) => {
  console.log("New player connected");

  socket.on("createRoom", () => {
    const roomCode = generateRoomCode();
    rooms[roomCode] = [socket.id];
    socket.join(roomCode);
    socket.emit("roomCreated", roomCode);
  });

  socket.on("joinRoom", (roomCode) => {
    if (rooms[roomCode] && rooms[roomCode].length < 2) {
      rooms[roomCode].push(socket.id);
      socket.join(roomCode);
      socket.emit("roomJoined", roomCode);
      io.to(roomCode).emit("startGame");
    } else {
      socket.emit("joinFailed");
    }
  });

  socket.on("playerMove", (data) => {
    const roomCode = data.room;
    socket.to(roomCode).emit("updateOtherPlayer", data);
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected");
    for (let code in rooms) {
      rooms[code] = rooms[code].filter((id) => id !== socket.id);
      if (rooms[code].length === 0) delete rooms[code];
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
