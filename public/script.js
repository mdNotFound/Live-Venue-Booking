// Establish real-time connection to the booking server
const realtimeSocket = io();

// Core DOM elements for the booking interface
const bookingDisplayContainer = document.getElementById('bookingsContainer');
const totalBookingCounter = document.getElementById('bookingCount');
const connectionStatusDot = document.getElementById('connectionStatus');
const connectionStatusText = document.getElementById('statusText');
const clearAllBookingsButton = document.getElementById('clearAllBtn');

let currentBookingCount = 0;

// Update the visual connection status indicator
function updateConnectionIndicator(isConnected) {
    if (isConnected) {
        connectionStatusDot.classList.add('connected');
        connectionStatusText.textContent = 'Live';
    } else {
        connectionStatusDot.classList.remove('connected');
        connectionStatusText.textContent = 'Offline';
    }
}

// Create a beautifully formatted booking card element
function createBookingCardElement(bookingData, shouldHighlight = false) {
    const bookingCard = document.createElement('div');
    bookingCard.className = shouldHighlight ? 'booking-card new-booking' : 'booking-card';

    // Build the card content with proper structure and formatting
    bookingCard.innerHTML = `
        <div class="booking-info">
            <div class="venue-details">
                <div class="venue-name">${bookingData.venueName}</div>
                <div class="party-info">Party of ${bookingData.partySize}</div>
            </div>
            <div class="booking-meta">
                <div class="booking-time">${bookingData.time}</div>
            </div>
        </div>
    `;

    return bookingCard;
}

// Add a new booking to the top of the list with smooth animation
function displayNewBookingAtTop(incomingBooking) {
    // Remove loading spinner if still present
    const loadingSpinner = bookingDisplayContainer.querySelector('.loading');
    if (loadingSpinner) {
        loadingSpinner.remove();
    }

    // Create the new booking card with highlight animation
    const highlightedBookingCard = createBookingCardElement(incomingBooking, true);

    // Insert at the very top of the bookings list
    bookingDisplayContainer.insertBefore(highlightedBookingCard, bookingDisplayContainer.firstChild);

    // Ensure the new booking is visible by scrolling to top
    bookingDisplayContainer.scrollTop = 0;

    // Remove the highlight effect after 4 seconds for subtle transition
    setTimeout(() => {
        highlightedBookingCard.classList.remove('new-booking');
    }, 4000);

    currentBookingCount++;
    animateBookingCountUpdate();
}

// Display all existing bookings when first connecting to server
function renderExistingBookings(existingBookingsArray) {
    // Clear any loading states or previous content
    bookingDisplayContainer.innerHTML = '';

    if (existingBookingsArray.length === 0) {
        showEmptyBookingState();
        return;
    }

    // Create cards for each existing booking without highlight
    existingBookingsArray.forEach(bookingData => {
        const regularBookingCard = createBookingCardElement(bookingData, false);
        bookingDisplayContainer.appendChild(regularBookingCard);
    });

    currentBookingCount = existingBookingsArray.length;
    animateBookingCountUpdate();
}

// Show a friendly empty state when no bookings exist
function showEmptyBookingState() {
    bookingDisplayContainer.innerHTML = `
        <div class="empty-state">
            <h3>No reservations yet</h3>
            <p>Live venue bookings will appear here as they come in ✨</p>
        </div>
    `;
    currentBookingCount = 0;
    animateBookingCountUpdate();
}

// Animate the booking counter with a subtle scale effect
function animateBookingCountUpdate() {
    const counterElement = document.getElementById('bookingCount');

    // Brief scale-up animation to draw attention
    counterElement.style.transform = 'scale(1.15)';
    counterElement.textContent = currentBookingCount;

    // Return to normal size smoothly
    setTimeout(() => {
        counterElement.style.transform = 'scale(1)';
    }, 150);
}

// Clear all bookings with a satisfying staggered animation
function executeBookingClearance() {
    if (currentBookingCount === 0) {
        return; // Nothing to clear
    }

    // Get all current booking cards for animation
    const allBookingCards = bookingDisplayContainer.querySelectorAll('.booking-card');

    // Animate each card out with a staggered delay for visual appeal
    allBookingCards.forEach((bookingCard, cardIndex) => {
        setTimeout(() => {
            bookingCard.style.animation = 'fadeOutLeft 0.5s ease-in forwards';
        }, cardIndex * 60); // 60ms stagger between each card
    });

    // Show empty state after all animations complete
    const totalAnimationTime = allBookingCards.length * 60 + 500;
    setTimeout(() => {
        showEmptyBookingState();
        // Sync the clear action with the server
        realtimeSocket.emit('clear-all-bookings');
    }, totalAnimationTime);
}

// Add dynamic CSS animations for smooth interactions
function injectCustomStyles() {
    const dynamicStylesheet = document.createElement('style');
    dynamicStylesheet.textContent = `
        @keyframes fadeOutLeft {
            0% {
                opacity: 1;
                transform: translateX(0);
            }
            100% {
                opacity: 0;
                transform: translateX(-100px);
            }
        }
        
        .booking-count span {
            transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
            display: inline-block;
        }
    `;
    document.head.appendChild(dynamicStylesheet);
}

// Set up all event listeners for user interactions
function initializeEventHandlers() {
    clearAllBookingsButton.addEventListener('click', executeBookingClearance);
}

// Configure all real-time socket event listeners
function setupRealtimeConnection() {
    realtimeSocket.on('connect', () => {
        console.log('🔗 Connected to booking server');
        updateConnectionIndicator(true);
    });

    realtimeSocket.on('disconnect', () => {
        console.log('📴 Disconnected from booking server');
        updateConnectionIndicator(false);
    });

    realtimeSocket.on('existing-bookings', (bookingsFromServer) => {
        console.log(`📋 Loaded ${bookingsFromServer.length} existing bookings`);
        renderExistingBookings(bookingsFromServer);
    });

    // Handle incoming new bookings in real-time
    realtimeSocket.on('new-booking', (freshBooking) => {
        console.log('⚡ New booking received:', freshBooking.venueName);
        displayNewBookingAtTop(freshBooking);
    });

    // Handle server-initiated booking clearance
    realtimeSocket.on('bookings-cleared', () => {
        console.log('🧹 All bookings cleared by server');
        showEmptyBookingState();
    });

    realtimeSocket.on('connect_error', (connectionError) => {
        console.error('🚫 Connection failed:', connectionError);
        updateConnectionIndicator(false);
        connectionStatusText.textContent = 'Connection Failed';
    });
}

// Initialize the entire booking viewer application
function launchBookingViewer() {
    console.log('🎯 Live Bookings Viewer starting up...');
    injectCustomStyles();
    initializeEventHandlers();
    setupRealtimeConnection();
    console.log('✅ Booking viewer ready - waiting for live reservations');
}

// Start the application when DOM is fully loaded
document.addEventListener('DOMContentLoaded', launchBookingViewer);
