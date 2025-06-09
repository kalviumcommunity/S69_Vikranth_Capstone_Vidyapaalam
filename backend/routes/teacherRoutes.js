const express = require('express');
const {
  createTeacherProfile,
  getTeacherProfiles,
  getTeacherProfileById,
  updateTeacherProfile,
  deleteTeacherProfile,
} = require('../controller/teacherController');

// Import authentication and authorization middleware
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for creating and getting all teacher profiles
router.route('/')
  .post(protect, authorizeRoles('teacher'), createTeacherProfile) // Only teachers can create their profile
  .get(getTeacherProfiles); // Publicly viewable for Browse teachers

// Routes for specific teacher profiles by ID
router.route('/:id')
  .get(getTeacherProfileById) // Publicly viewable for individual teacher profiles
  .put(protect, authorizeRoles('teacher', 'admin'), updateTeacherProfile) // Only owner or admin can update
  .delete(protect, authorizeRoles('teacher', 'admin'), deleteTeacherProfile); // Only owner or admin can delete

module.exports = router;