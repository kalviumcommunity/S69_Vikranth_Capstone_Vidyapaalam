// src/controllers/skillController.js
const Skill = require('../models/Skill');
const User = require('../models/User'); // Still useful for clarity if needed, but 'role' is now on req.user

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private (Teachers only for now, can be Admin later)
const createSkill = async (req, res) => {
  const { name, description, category, imageUrl } = req.body;
  const teacherId = req.user.id; // ID of the authenticated user from 'protect' middleware

  // The skillModel's pre-save hook already checks the teacher's role.
  // We can add a controller-level check too if preferred, but it's redundant here.
  // The 'authorizeRoles' middleware on the route is the primary gatekeeper.

  if (!name || !description) {
    return res.status(400).json({ message: 'Skill name and description are required.' });
  }

  try {
    const newSkill = new Skill({
      name,
      description,
      teacher: teacherId, // Link the skill to the teacher creating it
      category: category || 'General',
      imageUrl: imageUrl || 'https://via.placeholder.com/g',
    });

    const savedSkill = await newSkill.save();
    res.status(201).json(savedSkill);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Skill with this name already exists.', error: error.message });
    }
    console.error('Error creating skill:', error);
    res.status(500).json({ message: 'Server error while creating skill', error: error.message });
  }
};

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().populate('teacher', 'name email');
    res.status(200).json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Server error while fetching skills', error: error.message });
  }
};

// @desc    Get a single skill by ID
// @route   GET /api/skills/:id
// @access  Public
const getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('teacher', 'name email');
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found.' });
    }
    res.status(200).json(skill);
  } catch (error) {
    console.error('Error fetching skill by ID:', error);
    res.status(500).json({ message: 'Server error while fetching skill', error: error.message });
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private (Teacher who owns it, or Admin)
const updateSkill = async (req, res) => {
  const { name, description, category, imageUrl } = req.body;
  const authenticatedUserId = req.user.id;
  const authenticatedUserRole = req.user.role; // Get the role from req.user

  try {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found.' });
    }

    // Authorization check: Must be the skill's teacher OR an admin
    if (skill.teacher.toString() !== authenticatedUserId.toString() && authenticatedUserRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this skill.' });
    }

    skill.name = name || skill.name;
    skill.description = description || skill.description;
    skill.category = category || skill.category;
    skill.imageUrl = imageUrl || skill.imageUrl;

    const updatedSkill = await skill.save();
    res.status(200).json(updatedSkill);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Skill name already exists.', error: error.message });
    }
    console.error('Error updating skill:', error);
    res.status(500).json({ message: 'Server error while updating skill', error: error.message });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private (Teacher who owns it, or Admin)
const deleteSkill = async (req, res) => {
  const authenticatedUserId = req.user.id;
  const authenticatedUserRole = req.user.role; // Get the role from req.user

  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found.' });
    }

    // Authorization check: Must be the skill's teacher OR an admin
    if (skill.teacher.toString() !== authenticatedUserId.toString() && authenticatedUserRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this skill.' });
    }

    await Skill.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Skill removed successfully.' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ message: 'Server error while deleting skill', error: error.message });
  }
};

const updateInterestedSkills = async (req, res) => {
  const { skills } = req.body;
  const userId = req.user.id;

  if (!Array.isArray(skills)) {
    return res.status(400).json({ message: 'Skills must be an array of skill IDs.' });
  }

  try {
    const user = await User.findById(userId);

    if (!user || user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can update interested skills.' });
    }

    user.interestedSkills = skills;
    await user.save();

    const populatedUser = await user.populate('interestedSkills', 'name category');
    res.status(200).json({
      message: 'Interested skills updated successfully.',
      interestedSkills: populatedUser.interestedSkills,
    });
  } catch (error) {
    console.error('Error updating interested skills:', error);
    res.status(500).json({ message: 'Server error while updating interested skills', error: error.message });
  }
};

module.exports = {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  updateInterestedSkills
};