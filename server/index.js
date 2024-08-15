import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { config } from "dotenv";
import { connectDatabase } from "./config/database.js";
import { configureCloudinary } from "./config/cloudinary.js";

config({
  path: "./config/config.env",
});

configureCloudinary();
connectDatabase();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let users = [];
// Set up Socket.IO event handling
io.on("connection", (socket) => {
  socket.on("addNewUser", (user) => {
    if (!users.find((u) => u.user === user)) {
      users.push({ id: socket.id, user });
    }
    io.emit("onlineUsers", users);
    console.log(users, "online users");
  });

  socket.on("sendMessage", (message) => {
    const recepient = users
      .filter((u) => u.user === message?.recepient)
      .map((u) => u.id);

    if (recepient.length > 0) {
      if (recepient.length > 1) {
        io.to(recepient).emit("newMessage", message.newMessage);
      } else {
        io.to(recepient[0]).emit("newMessage", message.newMessage);
      }
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
    users = users.filter((u) => u.id !== socket.id);
    io.emit("onlineUsers", users);
    console.log(users, "online users");
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log("server is running on port " + process.env.PORT);
});
