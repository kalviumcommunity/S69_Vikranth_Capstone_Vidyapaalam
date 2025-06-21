// routes/calendarApiRoutes.js
const express = require('express');
const calendarController = require('../controllers/calendarController'); // Ensure correct path
const { protect } = require('../middleware/authMiddleware'); // Your authentication middleware

const router = express.Router();

router.get('/busy-times', protect, calendarController.getGoogleCalendarBusyTimes);

module.exports = router;