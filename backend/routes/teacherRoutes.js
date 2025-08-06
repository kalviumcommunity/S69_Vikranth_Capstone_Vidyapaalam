const express = require('express');
const {
  createTeacherProfile,
  getTeacherProfiles,
  getTeacherProfileByUserId,
  getAuthenticatedTeacherProfile,
  updateTeacherProfile,
  deleteTeacherProfile,
  getTeacherProfileById,
  getTeacherAvailability, 
  createBooking ,
  getTeacherProfileWithFormattedAvailability
} = require('../controller/teacherController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getTeacherProfiles);
router.get('/user/:userId', getTeacherProfileByUserId);
router.get('/me', protect, authorizeRoles('teacher'), getAuthenticatedTeacherProfile);
router.get('/:id', getTeacherProfileById);
router.post('/', protect, authorizeRoles('teacher'), upload, createTeacherProfile);
router.put('/:id', protect, authorizeRoles('teacher', 'admin'), upload, updateTeacherProfile);
router.delete('/:id', protect, authorizeRoles('teacher', 'admin'), deleteTeacherProfile);
router.get('/:id/availability', getTeacherAvailability);
router.get('/teacher-profiles-for-booking/:id', getTeacherProfileWithFormattedAvailability);
router.post('/:id/bookings', protect, authorizeRoles('student', 'teacher'), createBooking);

module.exports = router;
