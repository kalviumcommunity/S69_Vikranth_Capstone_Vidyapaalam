// src/models/skillModel.js
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Skill description is required'],
      minlength: [10, 'Description must be at least 10 characters long'],
    },
    teacher: { // This links a skill to a specific teacher who offers it
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      // enum: ['Programming', 'Music', 'Languages', 'Art', 'Science'], // Good to keep this commented out for now, or define explicitly
      default: 'General',
    },
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to normalize the skill name to lowercase
// This helps prevent duplicate entries like "Math" and "math"
skillSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) { // Check if name is modified or if it's a new document
    this.name = this.name.toLowerCase();
  }
  next();
});

// Optional: Add a pre-save hook to ensure the teacher role
skillSchema.pre('save', async function(next) {
  // Only execute this if the 'teacher' field is present and has been modified or is new
  if (this.teacher && (this.isModified('teacher') || this.isNew)) {
    try {
      const user = await mongoose.model('User').findById(this.teacher);
      if (!user) {
        return next(new Error('Associated user not found for this skill.'));
      }
      if (user.role !== 'teacher') {
        return next(new Error('Only users with a "teacher" role can own skills.'));
      }
    } catch (error) {
      return next(error); 
    }
  }
  next();
});

module.exports = mongoose.model('Skill', skillSchema);