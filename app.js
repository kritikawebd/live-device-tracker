// app.js - Final Vercel-Compatible Version
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

// Initialize server
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*", // Allow all origins (update for production)
    methods: ["GET", "POST"]
  }
});

// Configuration
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// ================= ROUTES ================= //
app.get("/", (req, res) => {
  try {
    res.render("index"); // Ensure views/index.ejs exists
  } catch (err) {
    console.error("Render error:", err);
    res.status(500).send("Server error");
  }
});

// Health check endpoint (for Vercel monitoring)
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    version: "1.1.0"
  });
});

// ================= SOCKET.IO ================= //
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id.slice(0, 5)}`);

  socket.on("send-location", (data) => {
    io.emit("receive-location", { 
      id: socket.id, 
      ...data 
    });
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});

// ================= ERROR HANDLING ================= //
// Catch 404
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).send("Something broke!");
});

// ================= SERVER START ================= //
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
  ===================================
   Live Tracker v1.1 (Vercel Optimized)
   Running on port ${PORT}
   URL: https://live-device-tracker-btld.vercel.app
  ===================================
  `);
}).on("error", (err) => {
  console.error("SERVER CRASH:", err);
});

// Prevent crashes
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});