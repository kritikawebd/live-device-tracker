// server.js (or app.js)
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Socket.io Connection
io.on("connection", (socket) => {
  console.log(`Device connected: ${socket.id.slice(0, 5)}...`);
  
  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});

// Routes
app.get("/", (req, res) => {
  res.render("index"); // Ensure views/index.ejs exists
});

// Error Handling (NEW)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Server error");
});

// Vercel-Compatible Server Start (UPDATED)
const PORT = process.env.PORT || 8000; // Critical for Vercel
server.listen(PORT, () => {
  console.log(`
    Live Tracker v1.0
    Running on port ${PORT}
  `);
});