// backend/routes/calendarRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  getGoogleCalendarBusyTimes,
} = require('../controller/calendarController'); 

router.get('/busy-times', protect, getGoogleCalendarBusyTimes);

module.exports = router;
