const socket = io(); // Auto-connects to same host

// Basic Leaflet map
const map = L.map('map').setView([20.59, 78.96], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Mock device movement (remove in production)
setInterval(() => {
  const lat = 20.59 + (Math.random() * 0.1);
  const lng = 78.96 + (Math.random() * 0.1);
  socket.emit('send-location', { lat, lng });
}, 3000);

socket.on('receive-location', (data) => {
  L.marker([data.lat, data.lng]).addTo(map);
});