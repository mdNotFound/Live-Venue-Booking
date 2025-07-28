const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for active bookings
const activeBookings = [];

// Curated list of premium venue names
const premiumVenues = [
  "Sky Lounge",
  "Moonlight Cafe",
  "River Deck",
  "Garden Terrace",
  "Urban Bistro",
  "Sunset Rooftop"
];

// Helper function to capitalize venue names properly
function formatVenueName(venueName) {
  return venueName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Generate a realistic booking with proper time formatting
function createRandomBooking() {
  const selectedVenue = premiumVenues[Math.floor(Math.random() * premiumVenues.length)];
  const partySize = Math.ceil(Math.random() * 8);
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const newBooking = {
    venueName: formatVenueName(selectedVenue),
    partySize: partySize,
    time: currentTime,
    id: Date.now() + Math.random() // Unique identifier for each booking
  };

  return newBooking;
}

// Add booking to storage and broadcast to all clients
function processNewBooking() {
  const freshBooking = createRandomBooking();

  // Add to beginning of array for newest-first display
  activeBookings.unshift(freshBooking);

  // Keep only the most recent 50 bookings to prevent memory bloat
  if (activeBookings.length > 50) {
    activeBookings.splice(50);
  }

  // Broadcast the new booking to all connected clients
  io.emit('new-booking', freshBooking);

  console.log(`📋 New reservation: ${freshBooking.venueName} - Party of ${freshBooking.partySize} at ${freshBooking.time}`);
}

// Handle client connections and disconnections
function setupClientHandlers() {
  io.on('connection', (clientSocket) => {
    console.log(`✅ Client connected: ${clientSocket.id}`);

    // Send current bookings to newly connected client
    clientSocket.emit('existing-bookings', activeBookings);

    // Handle request to clear all bookings
    clientSocket.on('clear-all-bookings', () => {
      console.log(`🗑️ Clear request from client: ${clientSocket.id}`);

      // Clear server storage
      activeBookings.length = 0;

      // Notify all clients that bookings were cleared
      io.emit('bookings-cleared');
    });

    clientSocket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${clientSocket.id}`);
    });
  });
}

// Initialize the booking simulation system
function startBookingSimulation() {
  // Create a new booking every 5 seconds
  setInterval(processNewBooking, 5000);
  console.log('🎯 Booking simulation started - generating bookings every 5 seconds');
}

// Start the application
function initializeServer() {
  setupClientHandlers();
  startBookingSimulation();

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Live Bookings Viewer running on http://localhost:${PORT}`);
    console.log(`📊 Ready to simulate real-time venue reservations`);
  });
}

// Launch the server
initializeServer();
