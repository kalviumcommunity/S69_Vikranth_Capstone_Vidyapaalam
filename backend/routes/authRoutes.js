

// authroutes.js
const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  profile,
  logout,
  googleLogin,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  saveRole,
  updateInterestedSkills,
  updateTeachingSkills,
  updateAvailability, 
  updateProfile
} = require('../controller/authController'); // Corrected path to 'controllers' from 'controller'

// FIX: Destructure 'protect' from the authMiddleware module
const { protect } = require('../middleware/authMiddleware');

const { loginLimiter } = require('../config/rateLimiter');
const {
  signupValidationRules,
  loginValidationRules,
  googleLoginValidationRules,
  validate
} = require('../middleware/validation');

// SignUp route
router.post(
  '/signup',
  signupValidationRules,
  validate,
  signup
);

// Login route
router.post(
  '/login',
  loginLimiter,
  loginValidationRules,
  validate,
  login
);

// Protected profile
router.get('/profile', protect, profile); // Use 'protect' here

// Logout (protected)
router.post('/logout', protect, logout); // Use 'protect' here

// OAuth & token routes
router.post(
  '/google-login',
  googleLoginValidationRules,
  validate,
  googleLogin
);

router.post('/refreshtoken', refreshToken);

// Password reset flows
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword',protect, resetPassword);

// Email verification
router.get('/verifyemail/:token', verifyEmail);

// Save user role (protected)
router.patch('/profile/role', protect, saveRole); // Use 'protect' here

router.patch('/profile/interested-skills', protect, updateInterestedSkills);

router.patch('/profile', protect, updateProfile);

router.patch('/profile/teaching-skills', protect, updateTeachingSkills);
router.patch('/profile/availability', protect, updateAvailability);


module.exports = router;