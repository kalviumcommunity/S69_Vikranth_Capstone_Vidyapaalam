

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
    getMe,
    refreshToken,
    logoutUser,
    saveRole,
    updateInterestedSkills,
    updateUserProfile,
    updateTeachingSkills,
    updateAvailability,
    firebaseAuth
} = require('../controller/authController');

const { protect } = require('../middleware/authMiddleware');

const {
    signupValidationRules,
    loginValidationRules,
    validate
} = require('../middleware/validation');

const router = express.Router();

router.post('/register', signupValidationRules, validate, registerUser);
router.post('/login', loginValidationRules, validate, loginUser);

router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);

router.post('/auth/firebase-google', firebaseAuth);

router.get('/profile', protect, getMe);

router.patch('/profile/role', protect, saveRole);
router.patch('/profile', protect, updateUserProfile);
router.patch('/profile/interested-skills', protect, updateInterestedSkills);
router.patch('/profile/teaching-skills', protect, updateTeachingSkills);
router.patch('/profile/availability', protect, updateAvailability);

module.exports = router;