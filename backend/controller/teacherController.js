// const TeacherProfile = require('../models/Teacher');
// const User = require('../models/User'); 
// const Skill = require('../models/Skill'); 

// // Create a new teacher profile  POST /api/teacher-profiles  Private (Teacher only)
// const createTeacherProfile = async (req, res) => {
//   const { bio, experience, qualifications, skillsOffered, availability, hourlyRate } = req.body;
//   const userId = req.user.id; // The ID of the authenticated user

//   try {
//     // 1. Check if a profile already exists for this user
//     let teacherProfile = await TeacherProfile.findOne({ user: userId });
//     if (teacherProfile) {
//       return res.status(409).json({ message: 'Teacher profile already exists for this user.' });
//     }

//     // 2. Optional: Verify user role (though authorizeRoles middleware should handle this)
//     const user = await User.findById(userId);
//     if (!user || user.role !== 'teacher') {
//       return res.status(403).json({ message: 'Only users with a "teacher" role can create a teacher profile.' });
//     }

//     // 3. Validate and sanitize skillsOffered (ensure they are valid Skill IDs)
//     let validSkills = [];
//     if (skillsOffered && skillsOffered.length > 0) {
//       const existingSkills = await Skill.find({ _id: { $in: skillsOffered } });
//       if (existingSkills.length !== skillsOffered.length) {
//         // Some provided skill IDs were not found
//         const foundIds = existingSkills.map(skill => skill._id.toString());
//         const invalidIds = skillsOffered.filter(id => !foundIds.includes(id));
//         return res.status(400).json({ message: `Invalid skill IDs provided: ${invalidIds.join(', ')}` });
//       }
//       validSkills = existingSkills.map(skill => skill._id);
//     }

//     // 4. Create the new profile
//     const newTeacherProfile = new TeacherProfile({
//       user: userId,
//       bio,
//       experience,
//       qualifications,
//       skillsOffered: validSkills,
//       availability,
//       hourlyRate,
//     });

//     const savedProfile = await newTeacherProfile.save();

//     // 5. Populate user and skills for the response
//     const populatedProfile = await TeacherProfile.findById(savedProfile._id)
//       .populate('user', 'name email role')
//       .populate('skillsOffered');

//     res.status(201).json(populatedProfile);
//   } catch (error) {
//     console.error('Error creating teacher profile:', error);
//     res.status(500).json({ message: 'Server error while creating teacher profile', error: error.message });
//   }
// };

// // Get all teacher profiles  GET /api/teacher-profiles  Public
// const getTeacherProfiles = async (req, res) => {
//   try {
//     const profiles = await TeacherProfile.find()
//       .populate('user', 'name email') // Show basic user info
//       .populate('skillsOffered'); // Show detailed skill info

//     res.status(200).json(profiles);
//   } catch (error) {
//     console.error('Error fetching teacher profiles:', error);
//     res.status(500).json({ message: 'Server error while fetching teacher profiles', error: error.message });
//   }
// };

// // Get a single teacher profile by user ID or profile ID   GET /api/teacher-profiles/:id (or /api/teacher-profiles/user/:userId)   Public
// const getTeacherProfileById = async (req, res) => {
//   try {
//     const profileId = req.params.id;
//     let teacherProfile;

//     // We can allow fetching by either the profile's _id or the associated user's _id
//     // This example assumes profileId could be either for simplicity
//     // A more robust API might have /profiles/:id and /profiles/user/:userId
//     if (profileId.match(/^[0-9a-fA-F]{24}$/)) { // Check if it's a valid ObjectId
//       teacherProfile = await TeacherProfile.findById(profileId)
//         .populate('user', 'name email')
//         .populate('skillsOffered');
//     } else {
//       // Assuming 'id' in path is a user ID if not a profile ID
//       teacherProfile = await TeacherProfile.findOne({ user: profileId })
//         .populate('user', 'name email')
//         .populate('skillsOffered');
//     }

//     if (!teacherProfile) {
//       return res.status(404).json({ message: 'Teacher profile not found.' });
//     }
//     res.status(200).json(teacherProfile);
//   } catch (error) {
//     console.error('Error fetching teacher profile:', error);
//     res.status(500).json({ message: 'Server error while fetching teacher profile', error: error.message });
//   }
// };

// //Update a teacher profile   PUT /api/teacher-profiles/:id  Private (Teacher who owns it, or Admin)
// const updateTeacherProfile = async (req, res) => {
//   const { bio, experience, qualifications, skillsOffered, availability, hourlyRate } = req.body;
//   const authenticatedUserId = req.user.id;
//   const authenticatedUserRole = req.user.role;

//   try {
//     let teacherProfile = await TeacherProfile.findById(req.params.id);

//     if (!teacherProfile) {
//       return res.status(404).json({ message: 'Teacher profile not found.' });
//     }

//     // Authorization check: Only the owner or an admin can update
//     if (teacherProfile.user.toString() !== authenticatedUserId.toString() && authenticatedUserRole !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized to update this profile.' });
//     }

//     // Validate and sanitize skillsOffered for update
//     let validSkills = [];
//     if (skillsOffered && skillsOffered.length > 0) {
//       const existingSkills = await Skill.find({ _id: { $in: skillsOffered } });
//       if (existingSkills.length !== skillsOffered.length) {
//         const foundIds = existingSkills.map(skill => skill._id.toString());
//         const invalidIds = skillsOffered.filter(id => !foundIds.includes(id));
//         return res.status(400).json({ message: `Invalid skill IDs provided: ${invalidIds.join(', ')}` });
//       }
//       validSkills = existingSkills.map(skill => skill._id);
//     }

//     teacherProfile.bio = bio !== undefined ? bio : teacherProfile.bio;
//     teacherProfile.experience = experience !== undefined ? experience : teacherProfile.experience;
//     teacherProfile.qualifications = qualifications !== undefined ? qualifications : teacherProfile.qualifications;
//     teacherProfile.skillsOffered = validSkills.length > 0 ? validSkills : teacherProfile.skillsOffered; // Update only if provided
//     teacherProfile.availability = availability !== undefined ? availability : teacherProfile.availability;
//     teacherProfile.hourlyRate = hourlyRate !== undefined ? hourlyRate : teacherProfile.hourlyRate;


//     const updatedProfile = await teacherProfile.save();

//     // Populate user and skills for the response
//     const populatedProfile = await TeacherProfile.findById(updatedProfile._id)
//       .populate('user', 'name email role')
//       .populate('skillsOffered');

//     res.status(200).json(populatedProfile);
//   } catch (error) {
//     console.error('Error updating teacher profile:', error);
//     res.status(500).json({ message: 'Server error while updating teacher profile', error: error.message });
//   }
// };

// //Delete a teacher profile   DELETE /api/teacher-profiles/:id  Private (Teacher who owns it, or Admin)
// const deleteTeacherProfile = async (req, res) => {
//   const authenticatedUserId = req.user.id;
//   const authenticatedUserRole = req.user.role;

//   try {
//     const teacherProfile = await TeacherProfile.findById(req.params.id);

//     if (!teacherProfile) {
//       return res.status(404).json({ message: 'Teacher profile not found.' });
//     }

//     // Authorization check: Only the owner or an admin can delete
//     if (teacherProfile.user.toString() !== authenticatedUserId.toString() && authenticatedUserRole !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized to delete this profile.' });
//     }

//     await TeacherProfile.deleteOne({ _id: req.params.id });
//     res.status(200).json({ message: 'Teacher profile removed successfully.' });
//   } catch (error) {
//     console.error('Error deleting teacher profile:', error);
//     res.status(500).json({ message: 'Server error while deleting teacher profile', error: error.message });
//   }
// };

// module.exports = {
//   createTeacherProfile,
//   getTeacherProfiles,
//   getTeacherProfileById,
//   updateTeacherProfile,
//   deleteTeacherProfile,
// };




// controllers/teacherProfileController.js

const TeacherProfile = require('../models/TeacherProfile');
const User = require('../models/User'); 


exports.createTeacherProfile = async (req, res) => {
  const {
    avatar,
    name,
    title,
    email,
    phone,
    aboutMe,
    skills,
    experience,
    hourlyRate,
    qualifications,
    videoUrl,
    galleryPhotos
  } = req.body;
  const userId = req.user.id;

  try {
    let teacherProfile = await TeacherProfile.findOne({ userId: userId });
    if (teacherProfile) {
      return res.status(409).json({ message: 'Teacher profile already exists for this user.' });
    }

    // 2. Optional: Verify user role (defense-in-depth if middleware isn't perfect)
    const user = await User.findById(userId);
    if (!user || user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only users with a "teacher" role can create a teacher profile.' });
    }

    // 3. Basic validation for array types before saving
    const validatedSkills = Array.isArray(skills) ? skills : [];
    const validatedQualifications = Array.isArray(qualifications) ? qualifications : [];
    const validatedGalleryPhotos = Array.isArray(galleryPhotos) ? galleryPhotos : [];

    // 4. Create the new profile
    const newTeacherProfile = new TeacherProfile({
      userId: userId, // Link to the authenticated user
      avatar,
      name,
      title,
      email,
      phone,
      aboutMe,
      skills: validatedSkills,
      experience,
      hourlyRate,
      qualifications: validatedQualifications,
      videoUrl,
      galleryPhotos: validatedGalleryPhotos
    });

    const savedProfile = await newTeacherProfile.save();

    // 5. Populate user for the response (no skill population needed as skills are strings)
    const populatedProfile = await TeacherProfile.findById(savedProfile._id)
      .populate('userId', 'name email role');

    res.status(201).json(populatedProfile);
  } catch (error) {
    console.error('Error creating teacher profile:', error);
    // Handle duplicate key error (e.g., if email or userId unique constraint is violated)
    if (error.code === 11000) {
        // Check if the duplicate is on 'email' or 'userId'
        if (error.keyPattern && error.keyPattern.email) {
            return res.status(400).json({ message: 'A profile with this email already exists.' });
        }
        if (error.keyPattern && error.keyPattern.userId) {
            return res.status(400).json({ message: 'A profile already exists for this user.' });
        }
    }
    res.status(500).json({ message: 'Server error while creating teacher profile', error: error.message });
  }
};


exports.getTeacherProfiles = async (req, res) => {
  try {
    const profiles = await TeacherProfile.find()
      .populate('userId', 'name email'); // Populate the associated user's basic info

    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error fetching all teacher profiles:', error);
    res.status(500).json({ message: 'Server error while fetching teacher profiles', error: error.message });
  }
};


exports.getTeacherProfileByUserId = async (req, res) => {
  try {
    const userIdInParam = req.params.userId; // The user ID passed in the URL parameter

    const teacherProfile = await TeacherProfile.findOne({ userId: userIdInParam })
      .populate('userId', 'name email'); // Populate the associated user's basic info

    if (!teacherProfile) {
      return res.status(404).json({ message: 'Teacher profile not found for this user ID.' });
    }
    res.status(200).json(teacherProfile);
  } catch (error) {
    console.error('Error fetching teacher profile by user ID:', error);
    res.status(500).json({ message: 'Server error while fetching teacher profile by user ID', error: error.message });
  }
};


exports.getAuthenticatedTeacherProfile = async (req, res) => {
  try {
    const teacherProfile = await TeacherProfile.findOne({ userId: req.user.id })
      .populate('userId', 'name email role'); // Populate the associated user's basic info

    if (!teacherProfile) {
      return res.status(404).json({ message: 'Your teacher profile does not exist. Please create one.' });
    }
    res.status(200).json(teacherProfile);
  } catch (error) {
    console.error('Error fetching authenticated teacher profile:', error);
    res.status(500).json({ message: 'Server error while fetching your teacher profile', error: error.message });
  }
};



exports.updateTeacherProfile = async (req, res) => {
  const {
    avatar, name, title, email, phone, aboutMe,
    skills, experience, hourlyRate, qualifications,
    videoUrl, galleryPhotos
  } = req.body;
  const authenticatedUserId = req.user.id;
  const authenticatedUserRole = req.user.role;

  try {
    let teacherProfile = await TeacherProfile.findById(req.params.id);

    if (!teacherProfile) {
      return res.status(404).json({ message: 'Teacher profile not found.' });
    }

    if (teacherProfile.userId.toString() !== authenticatedUserId.toString() && authenticatedUserRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this profile.' });
    }

  
    teacherProfile.avatar = avatar !== undefined ? avatar : teacherProfile.avatar;
    teacherProfile.name = name !== undefined ? name : teacherProfile.name;
    teacherProfile.title = title !== undefined ? title : teacherProfile.title;
    teacherProfile.email = email !== undefined ? email : teacherProfile.email;
    teacherProfile.phone = phone !== undefined ? phone : teacherProfile.phone;
    teacherProfile.aboutMe = aboutMe !== undefined ? aboutMe : teacherProfile.aboutMe;
    
    teacherProfile.skills = Array.isArray(skills) ? skills : teacherProfile.skills;
    teacherProfile.experience = experience !== undefined ? experience : teacherProfile.experience;
    teacherProfile.hourlyRate = hourlyRate !== undefined ? hourlyRate : teacherProfile.hourlyRate;
    teacherProfile.qualifications = Array.isArray(qualifications) ? qualifications : teacherProfile.qualifications;
    teacherProfile.videoUrl = videoUrl !== undefined ? videoUrl : teacherProfile.videoUrl;
    teacherProfile.galleryPhotos = Array.isArray(galleryPhotos) ? galleryPhotos : teacherProfile.galleryPhotos;

    const updatedProfile = await teacherProfile.save(); // pre-save hook updates isProfileComplete

    const populatedProfile = await TeacherProfile.findById(updatedProfile._id)
      .populate('userId', 'name email role');

    res.status(200).json(populatedProfile);
  } catch (error) {
    console.error('Error updating teacher profile:', error);
    if (error.code === 11000) {
        return res.status(400).json({ message: 'The email address provided is already in use by another profile.' });
    }
    res.status(500).json({ message: 'Server error while updating teacher profile', error: error.message });
  }
};


exports.deleteTeacherProfile = async (req, res) => {
  const authenticatedUserId = req.user.id;
  const authenticatedUserRole = req.user.role;

  try {
    const teacherProfile = await TeacherProfile.findById(req.params.id);

    if (!teacherProfile) {
      return res.status(404).json({ message: 'Teacher profile not found.' });
    }

    if (teacherProfile.userId.toString() !== authenticatedUserId.toString() && authenticatedUserRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this profile.' });
    }

    await TeacherProfile.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Teacher profile removed successfully.' });
  } catch (error) {
    console.error('Error deleting teacher profile:', error);
    res.status(500).json({ message: 'Server error while deleting teacher profile', error: error.message });
  }
};

module.exports = {
  createTeacherProfile,
  getTeacherProfiles,
  getTeacherProfileByUserId,
  getAuthenticatedTeacherProfile, 
  updateTeacherProfile,
  deleteTeacherProfile,
};
