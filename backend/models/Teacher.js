const mongoose = require('mongoose');

const teacherProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    avatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    name: {
      type: String,
      required: [true, 'Name is required for the profile'],
      trim: true
    },
    title: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      required: [true, 'Email is required for the profile'],
      unique: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    aboutMe: {
      type: String,
      trim: true,
      default: ''
    },

    skills: {
      type: [String],
      default: []
    },
    experience: {
      type: String,
      trim: true,
      default: ''
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [0, 'Hourly rate cannot be negative'],
      default: 0
    },
    qualifications: {
      type: [String],
      default: []
    },

    videoUrl: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    galleryPhotos: {
      type: [{
        url: { type: String, trim: true },
        publicId: { type: String, trim: true },
        name: { type: String, trim: true }
      }],
      default: []
    },

    isProfileComplete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

teacherProfileSchema.pre('save', function(next) {
  
  if (this.name && this.email && this.hourlyRate > 0 && this.experience && this.skills.length > 0) {
    this.isProfileComplete = true;
  } else {
    this.isProfileComplete = false;
  }
  next();
});

module.exports = mongoose.model('TeacherProfile', teacherProfileSchema);

