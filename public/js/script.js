// Add at the VERY TOP (5-second change)
console.log("LiveTracker Client - Customized by Kritika");

const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const randomShift = Math.random() * 0.0005;  
            const latitude = position.coords.latitude + randomShift;
            const longitude = position.coords.longitude + randomShift;
            // Add device ID (10-second change)
            socket.emit("send-location", { 
                latitude, 
                longitude,
                deviceId: `DT-${Math.floor(Math.random()*9000)+1000}`
            });
        },
        (error) => {
            console.error("GPS Error:", error.message); // Slightly better error
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 2500
        }
    );
}

const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

const markers = {};

socket.on("receive-location", (data) => {
    const { id, latitude, longitude, deviceId } = data; // Added deviceId
    map.setView([latitude, longitude], 15);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude])
            .bindPopup(`Device ${deviceId}`) // Added popup (5 sec)
            .addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});