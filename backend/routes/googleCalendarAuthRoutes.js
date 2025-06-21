// routes/googleCalendarAuthRoutes.js
const express = require('express');
const calendarController = require('../controllers/calendarController'); // Ensure correct path
const { protect } = require('../middleware/authMiddleware'); // Your authentication middleware

const router = express.Router();

router.get('/auth-url', protect, calendarController.googleCalendarAuthUrl);

router.get('/calendar-callback', calendarController.googleCalendarAuthCallback);

module.exports = router;