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

router.post('/firebase-google', firebaseAuth);

router.get('/profile', protect, getMe);

router.patch('/profile/role', protect, saveRole);
router.patch('/profile', protect, updateUserProfile);
router.patch('/profile/interested-skills', protect, updateInterestedSkills);
router.patch('/profile/teaching-skills', protect, updateTeachingSkills);
router.patch('/profile/availability', protect, updateAvailability);

module.exports = router;
