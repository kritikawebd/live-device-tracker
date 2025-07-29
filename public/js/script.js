// script.js - Final Optimized Version
console.log("LiveTracker Client - Customized by Kritika");

// Initialize Socket.io with explicit URL and error handling
const socket = io("https://live-device-tracker-btld.vercel.app", {
  transports: ["websocket"],
  reconnectionAttempts: 5
});

// Initialize Leaflet Map
const map = L.map("map").setView([20.5937, 78.9629], 5); // Default to India coordinates
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const markers = {};

// Geolocation with Error Fallback
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const randomShift = Math.random() * 0.0005;
      socket.emit("send-location", {
        latitude: position.coords.latitude + randomShift,
        longitude: position.coords.longitude + randomShift,
        deviceId: `DT-${Math.floor(Math.random()*9000)+1000}`
      });
    },
    (err) => {
      console.error("Geolocation Error:", err.message);
      alert("Please enable GPS for live tracking!");
      map.setView([0, 0], 2); // Reset view if GPS fails
    },
    { 
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
} else {
  alert("Geolocation not supported by your browser");
}

// Socket.io Event Handlers
socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("receive-location", (data) => {
  const { id, latitude, longitude, deviceId } = data;
  
  if (!markers[id]) {
    markers[id] = L.marker([latitude, longitude])
      .bindPopup(`<b>Device:</b> ${deviceId}`)
      .addTo(map);
  } else {
    markers[id]
      .setLatLng([latitude, longitude])
      .setPopupContent(`<b>Device:</b> ${deviceId}`);
  }
  
  map.setView([latitude, longitude], 15);
});

socket.on("disconnect", () => {
  console.warn("Disconnected from server");
});