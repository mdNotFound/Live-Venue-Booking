# 🍽️ Live Bookings Viewer

This is a real-time web app that simulates incoming venue bookings using Socket.IO and updates the UI live. Designed for restaurant managers and venue admins to view reservations without refreshing the page.

## 📋 What This App Does

Ever wondered what it's like to manage a busy restaurant's reservation system? This Live Bookings Viewer gives you that experience! It's a full-stack web application that simulates real-time venue bookings streaming in every 5 seconds.

Watch as new reservations appear at the top with smooth animations, see the live connection status, and clear all bookings with a satisfying staggered animation. Perfect for demonstrating real-time web technologies or as a foundation for actual restaurant management systems.

**Key Features:**
- **Real-time updates** - New bookings appear instantly across all connected browsers
- **Smooth animations** - New bookings slide in with purple highlights that fade gracefully
- **Live status monitoring** - See connection status with visual indicators
- **Multi-client sync** - Open multiple tabs and watch them stay perfectly synchronized
- **One-click clearing** - Clear all bookings with a beautiful cascading animation

## 🛠️ Tech Stack

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework for serving static files
- **Socket.IO** - Real-time bidirectional communication between server and clients

### Frontend
- **HTML5** - Clean semantic structure
- **CSS3** - Modern styling with gradients, animations, and glassmorphism effects
- **Vanilla JavaScript** - Client-side logic with Socket.IO integration (no frameworks needed!)

### Data Storage
- **In-memory arrays** - Simple and fast for this demo (no database setup required)

## 🚀 Getting Started

### What You'll Need
- Node.js (version 14 or higher)
- A web browser
- 5 minutes of your time

### Quick Setup

1. **Navigate to the project folder**:
   ```bash
   cd C:\Users\sahan\OneDrive\Desktop\Project
   ```

2. **Install the dependencies**:
   ```bash
   npm install
   ```

3. **Fire up the server**:
   ```bash
   npm start
   ```

4. **Open your browser** and go to:
   ```
   http://localhost:3000
   ```

That's it! You should see bookings starting to appear every 5 seconds.

## 🎮 How to Test It

### Single User Experience
1. Open the app and wait 5 seconds
2. Watch as new bookings slide in with purple highlights
3. Notice the connection status showing "Live" with a green dot
4. Try clicking "Clear All Bookings" for a satisfying animation

### Multi-User Magic
1. Open the same URL in 2-3 different browser tabs
2. Watch how all tabs show identical bookings appearing simultaneously
3. Clear bookings in one tab - they'll disappear from all tabs instantly
4. This demonstrates the real-time synchronization power of Socket.IO

### Connection Testing
1. Stop the server (Ctrl+C in your terminal)
2. Watch the status change to "Offline" with a pulsing red dot
3. Restart the server and see it reconnect automatically

## 📱 What You'll See

The app displays realistic venue bookings like:

```
🏢 Moonlight Cafe
👥 Party of 4
🕒 2:45 PM

🏢 Sky Lounge  
👥 Party of 2
🕒 2:50 PM
```

Each new booking appears with:
- Smooth slide-down animation
- Purple gradient highlight for 4 seconds
- Automatic scroll to keep new bookings visible
- Professional card design with icons

## 📁 How It's Organized

```
Project/
├── server.js              # Main server with Socket.IO magic
├── package.json           # Dependencies and npm scripts
└── public/               # Frontend files (served automatically)
    ├── index.html        # Main page structure
    ├── styles.css        # Beautiful CSS with animations
    └── script.js         # Client-side Socket.IO handling
```

## 🎨 Cool Features You'll Notice

- **Smart venue names** - Properly capitalized with a helper function
- **Realistic timing** - Uses `toLocaleTimeString()` for proper AM/PM format
- **Memory management** - Only keeps the latest 50 bookings to prevent slowdowns
- **Responsive design** - Looks great on desktop and mobile
- **Custom scrollbar** - Matches the purple theme
- **Staggered animations** - Clearing bookings creates a waterfall effect

## 🔧 Want to Customize It?

### Add Your Own Venues
Edit the `premiumVenues` array in `server.js`:
```javascript
const premiumVenues = [
  "Sky Lounge",
  "Your Restaurant Name",  // Add here
  "Another Cool Place"     // And here
];
```

### Change the Timing
Want faster bookings? Modify the interval in `server.js`:
```javascript
setInterval(processNewBooking, 3000); // 3 seconds instead of 5
```

## 🐛 Troubleshooting

**Stuck on "Loading bookings..."?**
- Make sure the server is running on port 3000
- Check your browser console for any JavaScript errors
- Try refreshing the page

**Bookings not appearing?**
- Verify the console shows "New reservation:" messages
- Check if your connection status shows "Live"
- Look for any firewall blocking localhost connections

**Port 3000 already in use?**
```bash
PORT=8080 npm start  # Try a different port
```

## 💡 Why I Built This

This project showcases modern web development techniques in a fun, visual way. It's perfect for:
- Learning Socket.IO and real-time web apps
- Demonstrating to clients how live updates work
- Using as a foundation for actual restaurant systems
- Impressing friends with smooth animations!

The code follows clean practices with meaningful variable names, helpful comments, and thoughtful touches that make it feel polished and professional.

---

**Ready to watch those bookings roll in?** Run `npm start` and enjoy the show! 🎉
