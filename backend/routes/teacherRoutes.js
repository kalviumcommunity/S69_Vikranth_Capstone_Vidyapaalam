// const express = require('express');
// const {
//   createTeacherProfile,
//   getTeacherProfiles,
//   getTeacherProfileById,
//   updateTeacherProfile,
//   deleteTeacherProfile,
// } = require('../controller/teacherController');

// // Import authentication and authorization middleware
// const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// const router = express.Router();

// // Routes for creating and getting all teacher profiles
// router.route('/')
//   .post(protect, authorizeRoles('teacher'), createTeacherProfile) // Only teachers can create their profile
//   .get(getTeacherProfiles); // Publicly viewable for Browse teachers

// // Routes for specific teacher profiles by ID
// router.route('/:id')
//   .get(getTeacherProfileById) // Publicly viewable for individual teacher profiles
//   .put(protect, authorizeRoles('teacher', 'admin'), updateTeacherProfile) // Only owner or admin can update
//   .delete(protect, authorizeRoles('teacher', 'admin'), deleteTeacherProfile); // Only owner or admin can delete

// module.exports = router;



// routes/teacherProfileRoutes.js

const express = require('express');
const {
  createTeacherProfile,
  getTeacherProfiles,
  getTeacherProfileByUserId,
  getAuthenticatedTeacherProfile,
  updateTeacherProfile,
  deleteTeacherProfile,
} = require('../controllers/teacherProfileController');

const upload = require('../middleware/uploadMiddleware');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // Import your actual middleware

const router = express.Router();

router.get('/', getTeacherProfiles);

router.get('/user/:userId', getTeacherProfileByUserId);

router.get('/me', protect, authorizeRoles('teacher'), getAuthenticatedTeacherProfile);

router.post('/', protect, authorizeRoles('teacher'), upload, createTeacherProfile);

router.put('/:id', protect, authorizeRoles('teacher', 'admin'), upload, updateTeacherProfile);

router.delete('/:id', protect, authorizeRoles('teacher', 'admin'), deleteTeacherProfile);

module.exports = router;
