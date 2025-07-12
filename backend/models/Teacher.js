// const mongoose = require('mongoose');

// const teacherProfileSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//       unique: true, // A user can only have one teacher profile
//     },
//     title: { // Corresponds to 'Professional Title' on frontend
//       type: String,
//       trim: true,
//       default: '',
//     },
//     hourlyRate: {
//       type: Number,
//       required: [true, 'Hourly rate is required'],
//       min: [0, 'Hourly rate cannot be negative'],
//     },
//     experience: { // Corresponds to 'Years of Experience'
//       type: String, // Keep as string as per frontend ("5+ years")
//       trim: true,
//       default: '',
//     },
//     qualifications: [ // Changed from String to Array of Strings for multiple qualifications
//       {
//         type: String,
//         trim: true,
//       }
//     ],
//     teachingSkills: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Skill',
//       },
//     ],
//     introductionVideoUrl: { // Corresponds to 'Introduction Video' on frontend
//       type: String,
//       trim: true,
//       default: '',
//     },
//     galleryImages: [ // Corresponds to 'Teaching Gallery' on frontend
//       {
//         type: String, // Store URLs of the images
//         trim: true,
//       }
//     ],
//     // 'profilePicture' is handled on the User model
//     isProfileComplete: {
//       type: Boolean,
//       default: false,
//     }
//   },
//   {
//     timestamps: true,
//   }
// );

// // Optional: Add a pre-save hook to set isProfileComplete based on certain fields
// teacherProfileSchema.pre('save', function(next) {
//   // You can define what makes a profile "complete" here.
//   // For example, if hourlyRate, experience, and at least one skill are present.
//   if (this.hourlyRate && this.experience && this.teachingSkills.length > 0) {
//     this.isProfileComplete = true;
//   } else {
//     this.isProfileComplete = false;
//   }
//   next();
// });


// module.exports = mongoose.model('TeacherProfile', teacherProfileSchema);



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
