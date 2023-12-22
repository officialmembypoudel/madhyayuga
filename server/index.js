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
const io = new Server(server);

let users = [];
// Set up Socket.IO event handling
io.on("connection", (socket) => {
  socket.on("addNewUser", (user) => {
    if (!users.find((u) => u.user === user)) {
      users.push({ id: socket.id, user });
      console.log("onlineUsers", users);
      socket.emit("onlineUsers", users);
    }
  });

  socket.on("sendMessage", (message) => {
    const recepient = users.find((u) => u.user === message?.recepient);
    console.log("recepient", message?.recepient);
    console.log("message", message);
    console.log("recepient", recepient);
    console.log("users", users);
    if (recepient) {
      socket.to(recepient.id).emit("newMessage", message.newMessage);
    }
  });
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
    users = users.filter((u) => u.id !== socket.id);
    console.log("online users", users);
    io.emit("onlineUsers", users);
  });
});
server.listen(process.env.PORT, () => {
  console.log("server is running on port " + process.env.PORT);
});

console.log("onlineUsers", users);
