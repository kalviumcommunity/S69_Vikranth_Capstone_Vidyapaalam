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

const TeacherProfile = require('../models/Teacher');
const User = require('../models/User');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');


const processFileUploads = async (files) => {
  const uploadedMedia = {};

  if (!files) return uploadedMedia;

  
  if (files.avatar && files.avatar[0]) {
    try {
      const result = await uploadToCloudinary(files.avatar[0], 'avatars');
      uploadedMedia.avatar = { url: result.secure_url, publicId: result.public_id };
    } catch (uploadError) {
      console.error('Failed to upload avatar to Cloudinary:', uploadError);
    }
  }

  
  if (files.video && files.video[0]) {
    try {
      const result = await uploadToCloudinary(files.video[0], 'videos');
      uploadedMedia.videoUrl = { url: result.secure_url, publicId: result.public_id };
    } catch (uploadError) {
      console.error('Failed to upload video to Cloudinary:', uploadError);
    }
  }

  if (files.galleryPhotos && files.galleryPhotos.length > 0) {
    const uploadPromises = files.galleryPhotos.map(file =>
      uploadToCloudinary(file, 'gallery')
        .then(result => ({ url: result.secure_url, publicId: result.public_id, name: file.originalname }))
        .catch(uploadError => {
          console.error(`Failed to upload gallery photo ${file.originalname}:`, uploadError);
          return null; // Return null for failed uploads
        })
    );

    const results = await Promise.allSettled(uploadPromises);
    uploadedMedia.galleryPhotos = results
      .filter(res => res.status === 'fulfilled' && res.value !== null)
      .map(res => res.value);
  }

  return uploadedMedia;
};


async function handleSingleMediaUploadAndReplace(profile, mediaField, newFile, resourceType, clearExplicitly) {
  let updatedMediaInfo = { ...profile[mediaField] }; // Start with current DB value

  if (newFile) {
    
    try {
      const uploadResult = await uploadToCloudinary(newFile, resourceType === 'image' ? 'avatars' : 'videos');
      
      if (profile[mediaField] && profile[mediaField].publicId) {
        try {
          await deleteFromCloudinary(profile[mediaField].publicId, resourceType);
        } catch (deleteError) {
          console.warn(`Failed to delete old ${mediaField} from Cloudinary:`, deleteError);
          
        }
      }
      updatedMediaInfo = { url: uploadResult.secure_url, publicId: uploadResult.public_id };
    } catch (uploadError) {
      console.error(`Failed to upload new ${mediaField}:`, uploadError);
      throw uploadError; // Re-throw to indicate overall update failure if critical
    }
  } else if (clearExplicitly) {
    if (profile[mediaField] && profile[mediaField].publicId) {
      try {
        await deleteFromCloudinary(profile[mediaField].publicId, resourceType);
      } catch (deleteError) {
        console.warn(`Failed to delete old ${mediaField} on explicit clear:`, deleteError);
      }
    }
    updatedMediaInfo = { url: '', publicId: '' };
  }
  profile[mediaField] = updatedMediaInfo;
}



exports.createTeacherProfile = async (req, res) => {
  const {
    name, title, email, phone, aboutMe,
    skills, experience, hourlyRate, qualifications
  } = req.body;
  const userId = req.user.id;

  try {
    let teacherProfile = await TeacherProfile.findOne({ userId: userId });
    if (teacherProfile) {
      return res.status(409).json({ message: 'Teacher profile already exists for this user.' });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only users with a "teacher" role can create a teacher profile.' });
    }

    const uploadedMedia = await processFileUploads(req.files);

    const newTeacherProfile = new TeacherProfile({
      userId: userId,
      avatar: uploadedMedia.avatar || { url: '', publicId: '' },
      name,
      title,
      email,
      phone,
      aboutMe,
      skills: Array.isArray(skills) ? skills : [],
      experience,
      hourlyRate,
      qualifications: Array.isArray(qualifications) ? qualifications : [],
      videoUrl: uploadedMedia.videoUrl || { url: '', publicId: '' },
      galleryPhotos: uploadedMedia.galleryPhotos || []
    });

    const savedProfile = await newTeacherProfile.save();

    const populatedProfile = await TeacherProfile.findById(savedProfile._id)
      .populate('userId', 'name email role');

    res.status(201).json(populatedProfile);
  } catch (error) {
    console.error('Error creating teacher profile:', error);
    if (error.code === 11000) {
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
      .populate('userId', 'name email');

    res.status(200).json(profiles);
  } catch (error) {
    console.error('Error fetching all teacher profiles:', error);
    res.status(500).json({ message: 'Server error while fetching teacher profiles', error: error.message });
  }
};


exports.getTeacherProfileByUserId = async (req, res) => {
  try {
    const userIdInParam = req.params.userId;

    const teacherProfile = await TeacherProfile.findOne({ userId: userIdInParam })
      .populate('userId', 'name email');

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
      .populate('userId', 'name email role');

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
    name, title, email, phone, aboutMe,
    skills, experience, hourlyRate, qualifications,
    galleryPhotos: incomingGalleryPhotos // Renamed to avoid conflict with req.files.galleryPhotos
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

    await handleSingleMediaUploadAndReplace(
      teacherProfile,
      'avatar',
      req.files?.avatar?.[0],
      'image',
      req.body.avatar === ''
    );

    await handleSingleMediaUploadAndReplace(
      teacherProfile,
      'videoUrl',
      req.files?.video?.[0],
      'video',
      req.body.videoUrl === ''
    );


    let finalGalleryPhotos = teacherProfile.galleryPhotos || []; // Start with existing photos from DB

    
    const incomingPublicIds = new Set(
        (Array.isArray(incomingGalleryPhotos) ? incomingGalleryPhotos : [])
        .filter(p => p && p.publicId)
        .map(p => p.publicId)
    );

    const photosToDeletePromises = [];
    for (const existingPhoto of finalGalleryPhotos) {
        if (existingPhoto.publicId && !incomingPublicIds.has(existingPhoto.publicId)) {
            photosToDeletePromises.push(deleteFromCloudinary(existingPhoto.publicId, 'image'));
        }
    }
    await Promise.allSettled(photosToDeletePromises); // Use allSettled to log individual failures but not stop the whole process


    finalGalleryPhotos = (Array.isArray(incomingGalleryPhotos) ? incomingGalleryPhotos : [])
        .filter(p => p && p.url && p.publicId); // Ensure they have necessary fields

    const newUploadedGalleryPhotos = await processFileUploads(req.files);
    if (newUploadedGalleryPhotos.galleryPhotos && newUploadedGalleryPhotos.galleryPhotos.length > 0) {
        finalGalleryPhotos = [...finalGalleryPhotos, ...newUploadedGalleryPhotos.galleryPhotos];
    }
    
    teacherProfile.galleryPhotos = finalGalleryPhotos;


    teacherProfile.name = name !== undefined ? name : teacherProfile.name;
    teacherProfile.title = title !== undefined ? title : teacherProfile.title;
    teacherProfile.email = email !== undefined ? email : teacherProfile.email;
    teacherProfile.phone = phone !== undefined ? phone : teacherProfile.phone;
    teacherProfile.aboutMe = aboutMe !== undefined ? aboutMe : teacherProfile.aboutMe;
    
    teacherProfile.skills = Array.isArray(skills) ? skills : teacherProfile.skills;
    teacherProfile.experience = experience !== undefined ? experience : teacherProfile.experience;
    teacherProfile.hourlyRate = hourlyRate !== undefined ? hourlyRate : teacherProfile.hourlyRate;
    teacherProfile.qualifications = Array.isArray(qualifications) ? qualifications : teacherProfile.qualifications;
    
    const updatedProfile = await teacherProfile.save();

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

    const deletionPromises = [];
    if (teacherProfile.avatar && teacherProfile.avatar.publicId) {
      deletionPromises.push(deleteFromCloudinary(teacherProfile.avatar.publicId, 'image'));
    }
    if (teacherProfile.videoUrl && teacherProfile.videoUrl.publicId) {
      deletionPromises.push(deleteFromCloudinary(teacherProfile.videoUrl.publicId, 'video'));
    }
    if (teacherProfile.galleryPhotos && teacherProfile.galleryPhotos.length > 0) {
      teacherProfile.galleryPhotos.forEach(photo => {
        if (photo.publicId) {
          deletionPromises.push(deleteFromCloudinary(photo.publicId, 'image'));
        }
      });
    }

    await Promise.allSettled(deletionPromises);
    deletionPromises.forEach((promise, index) => {
        promise.catch(error => console.warn(`Failed to delete media item ${index} from Cloudinary:`, error));
    });


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
