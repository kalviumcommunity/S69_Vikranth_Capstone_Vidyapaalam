// backend/routes/calendarRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Adjust path as needed

// Import calendar functions from the dedicated calendar controller
const {
  googleCalendarAuthUrl,
  googleCalendarAuthCallback,
  getGoogleCalendarBusyTimes,
} = require('../controller/calendarController'); // Adjust path as needed

// Routes for Google Calendar Integration
router.get('/google', protect, googleCalendarAuthUrl);
router.get('/google/callback', googleCalendarAuthCallback);
router.get('/google/busy-times', protect, getGoogleCalendarBusyTimes);

module.exports = router;