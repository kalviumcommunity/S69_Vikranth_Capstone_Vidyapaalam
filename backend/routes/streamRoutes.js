const express = require('express');
const { generateToken, generateVideoToken } = require('../controller/streamController');
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.get('/token', protect, generateToken);

router.get('/video-token', protect, generateVideoToken);

module.exports = router;

