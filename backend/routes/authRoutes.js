

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
const {
  registerUser,
  loginUser,
  getMe, // Added getMe as it's a core auth function
  refreshToken,
  logoutUser,
  saveRole,
  updateInterestedSkills,
  updateUserProfile,
  updateTeachingSkills,
  updateAvailability,
} = require('../controller/authController'); // Make sure this path is correct: `../controllers/authController` vs `../controller/authController`

const { protect } = require('../middleware/authMiddleware'); // Make sure this path is correct

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken); // Primary refresh token route
router.post('/logout', logoutUser);

// Protected routes (authentication required using 'protect' middleware)
router.get('/me', protect, getMe); // Get authenticated user's profile

router.patch('/profile/role', protect, saveRole);
router.patch('/profile', protect, updateUserProfile); // General profile updates (name, phone, bio, teacherOnboardingComplete)
router.patch('/profile/interested-skills', protect, updateInterestedSkills); // Student-specific skills
router.patch('/profile/teaching-skills', protect, updateTeachingSkills); // Teacher-specific skills
router.patch('/profile/availability', protect, updateAvailability); // Teacher availability

module.exports = router;
