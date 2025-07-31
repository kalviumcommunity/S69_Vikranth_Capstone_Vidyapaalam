const express = require('express');
const { generateToken } = require('../controller/streamController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

const router = express.Router();

router.get('/token', protect, generateToken);

module.exports = router;

