

// // authroutes.js
// const express = require('express');
// const router = express.Router();
// const {
//   signup,
//   login,
//   profile,
//   logout,
//   googleAuth,
//   googleAuthCallback,
//   refreshToken,
//   forgotPassword,
//   resetPassword,
//   verifyEmail,
//   saveRole,
//   updateInterestedSkills,
//   updateTeachingSkills,
//   updateAvailability, 
//   updateProfile
// } = require('../controller/authController'); 

// const { protect } = require('../middleware/authMiddleware');

// const { loginLimiter } = require('../config/rateLimiter');
// const {
//   signupValidationRules,
//   loginValidationRules,
//   validate
// } = require('../middleware/validation');

// // SignUp route
// router.post(
//   '/signup',
//   signupValidationRules,
//   validate,
//   signup
// );

// // Login route
// router.post(
//   '/login',
//   loginLimiter,
//   loginValidationRules,
//   validate,
//   login
// );

// // Protected profile
// router.get('/profile', protect, profile); 

// // Logout (protected)
// router.post('/logout', protect, logout); 

// // OAuth & token routes
// router.get('/google', googleAuth);         
// router.get('/google/callback', googleAuthCallback);

// router.post('/refreshtoken', refreshToken);

// // Password reset flows
// router.post('/forgotpassword', forgotPassword);
// router.post('/resetpassword',protect, resetPassword);

// // Email verification
// router.get('/verifyemail/:token', verifyEmail);

// // Save user role (protected)
// router.patch('/profile/role', protect, saveRole); 

// router.patch('/profile/interested-skills', protect, updateInterestedSkills);

// router.patch('/profile', protect, updateProfile);

// router.patch('/profile/teaching-skills', protect, updateTeachingSkills);
// router.patch('/profile/availability', protect, updateAvailability);


// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  googleCalendarAuthUrl,
  googleCalendarAuthCallback,
  refreshToken,
  saveRole,
  updateInterestedSkills, // Make sure this function is exported from authController.js
  updateUserProfile,
  updateTeachingSkills,
  updateAvailability,
} = require('../controller/authController'); // Corrected path: changed 'controller' to 'controllers'

const { protect } = require('../middleware/authMiddleware');

const { loginLimiter } = require('../config/rateLimiter');
const {
  signupValidationRules,
  loginValidationRules,
  validate
} = require('../middleware/validation');

router.post(
  '/signup',
  signupValidationRules,
  validate,
  registerUser
);

router.post(
  '/login',
  loginLimiter,
  loginValidationRules,
  validate,
  loginUser
);

router.get('/profile', protect, getMe);

router.post('/logout', protect, logoutUser);

router.get('/google', protect, googleCalendarAuthUrl); // Added 'protect' middleware as per authController logic
router.get('/google/callback', googleCalendarAuthCallback); // This route does not need protection

router.post('/refreshtoken', refreshToken); // Consider using GET for refresh token if it only reads cookies

router.patch('/profile/role', protect, saveRole);

router.patch('/profile/interested-skills', protect, updateInterestedSkills);

router.patch('/profile', protect, updateUserProfile);

router.patch('/profile/teaching-skills', protect, updateTeachingSkills);
router.patch('/profile/availability', protect, updateAvailability);

module.exports = router;
