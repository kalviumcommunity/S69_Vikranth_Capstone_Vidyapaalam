// src/routes/skillRoutes.js (No changes needed)
const express = require('express');
const {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  updateInterestedSkills
} = require('../controller/skillController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); 

const router = express.Router();

router.route('/')
  .post(protect, authorizeRoles('teacher', 'admin'), createSkill) 
  .get(getSkills);

router.route('/:id')
  .get(getSkillById)
  .put(protect, authorizeRoles('teacher', 'admin'), updateSkill) 
  .delete(protect, authorizeRoles('teacher', 'admin'), deleteSkill); 

router.put('/interests', protect, authorizeRoles('student'), updateInterestedSkills);

module.exports = router;