console.log("Live Device Tracker - Customized by Kritika Kasera"); // NEW

const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
// Deleted duplicate static middleware

io.on("connection", function (socket) {
    console.log(`Device connected: ${socket.id.slice(0, 5)}...`); // NEW
    socket.on("send-location", function (data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });
    socket.on("disconnect", function () {
        io.emit("user-disconnected", socket.id);
    });
});

app.get("/", function (req, res) {
    res.render("index");
});

app.use((err, req, res, next) => { // NEW
  console.error("Error:", err.message);
  res.status(500).send("Something went wrong");
});

server.listen(8000, () => {
    console.log(`  // NEW
      Live Tracker v1.0
      Running on http://localhost:8000
    `);
});