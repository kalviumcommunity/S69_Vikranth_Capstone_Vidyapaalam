
// const TeacherProfile = require('../models/Teacher');
// const User = require('../models/User');
// const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// const processFileUploads = async (files) => {
//   const uploadedMedia = {};

//   if (!files) return uploadedMedia;

//   if (files.avatar && files.avatar[0]) {
//     try {
//       const result = await uploadToCloudinary(files.avatar[0], 'avatars');
//       uploadedMedia.avatar = { url: result.secure_url, publicId: result.public_id };
//     } catch (uploadError) {
//       console.error('Failed to upload avatar to Cloudinary:', uploadError);
//       throw new Error(`Avatar upload failed: ${uploadError.message}`);
//     }
//   }

//   if (files.video && files.video[0]) {
//     try {
//       const result = await uploadToCloudinary(files.video[0], 'videos');
//       uploadedMedia.videoUrl = { url: result.secure_url, publicId: result.public_id };
//     } catch (uploadError) {
//       console.error('Failed to upload video to Cloudinary:', uploadError);
//       throw new Error(`Video upload failed: ${uploadError.message}`);
//     }
//   }

//   if (files.galleryPhotos && files.galleryPhotos.length > 0) {
//     const uploadPromises = files.galleryPhotos.map(file =>
//       uploadToCloudinary(file, 'gallery')
//         .then(result => ({ url: result.secure_url, publicId: result.public_id, name: file.originalname }))
//         .catch(uploadError => {
//           console.error(`Failed to upload gallery photo ${file.originalname}:`, uploadError);
//           throw new Error(`Gallery photo upload failed: ${uploadError.message}`);
//         })
//     );

//     const results = await Promise.allSettled(uploadPromises);
//     uploadedMedia.galleryPhotos = results
//       .filter(res => res.status === 'fulfilled' && res.value !== null)
//       .map(res => res.value);
//   }

//   return uploadedMedia;
// };

// async function handleSingleMediaUploadAndReplace(profile, mediaField, newFile, resourceType, clearExplicitly) {
//   console.log(`\n--- DEBUG: handleSingleMediaUploadAndReplace for ${mediaField} ---`);
//   console.log(`DEBUG: Initial profile[${mediaField}]:`, JSON.stringify(profile[mediaField]));
//   console.log(`DEBUG: newFile provided:`, !!newFile);
//   console.log(`DEBUG: clearExplicitly requested:`, clearExplicitly);

//   const oldPublicId = profile[mediaField]?.publicId || null;
//   console.log(`DEBUG: oldPublicId captured:`, oldPublicId);

//   let updatedMediaInfo = { url: '', publicId: '' };

//   if (newFile) {
//     console.log(`DEBUG: Entering 'newFile' branch for ${mediaField}.`);
//     try {
//       const folder = resourceType === 'image' ? 'avatars' : 'videos';
//       console.log(`DEBUG: Uploading new file to folder: ${folder}`);
//       const uploadResult = await uploadToCloudinary(newFile, folder);
//       updatedMediaInfo = { url: uploadResult.secure_url, publicId: uploadResult.public_id };
//       console.log(`DEBUG: New file uploaded. New publicId: ${uploadResult.public_id}`);

//       if (oldPublicId) {
//         console.log(`DEBUG: Attempting to delete old media: ${oldPublicId} (resourceType: ${resourceType})`);
//         await deleteFromCloudinary(oldPublicId, resourceType);
//         console.log(`DEBUG: Old media ${oldPublicId} DELETED successfully.`);
//       } else {
//         console.log(`DEBUG: No old publicId to delete for ${mediaField}.`);
//       }
//     } catch (uploadError) {
//       console.error(`DEBUG: ERROR: Failed to upload new ${mediaField}:`, uploadError.message);
//       throw new Error(`Failed to upload ${mediaField}: ${uploadError.message}`);
//     }
//   } else if (clearExplicitly) {
//     console.log(`DEBUG: Entering 'clearExplicitly' branch for ${mediaField}.`);
//     if (oldPublicId) {
//       console.log(`DEBUG: Attempting to delete old media on explicit clear: ${oldPublicId} (resourceType: ${resourceType})`);
//       await deleteFromCloudinary(oldPublicId, resourceType);
//       console.log(`DEBUG: Old media ${oldPublicId} DELETED successfully on explicit clear.`);
//     } else {
//       console.log(`DEBUG: No old publicId to delete on explicit clear for ${mediaField}.`);
//     }
//     updatedMediaInfo = { url: '', publicId: '' }; // Align with schema
//   } else {
//     console.log(`DEBUG: No new file or explicit clear. Retaining existing media for ${mediaField}.`);
//     updatedMediaInfo = profile[mediaField] || { url: '', publicId: '' };
//   }

//   profile[mediaField] = updatedMediaInfo;
//   console.log(`DEBUG: Final profile[${mediaField}] set to:`, JSON.stringify(profile[mediaField]));
//   console.log(`--- DEBUG: End handleSingleMediaUploadAndReplace for ${mediaField} ---\n`);
// }

// const parseIncomingGalleryPhotos = (body) => {
//   const galleryPhotos = [];
//   const indices = new Set();

//   // Collect all indices from keys like galleryPhotos[0][url], galleryPhotos[0][publicId], etc.
//   for (const key in body) {
//     const match = key.match(/galleryPhotos\[(\d+)\]\[(\w+)\]/);
//     if (match) {
//       const index = match[1];
//       indices.add(index);
//     }
//   }

//   // Build gallery photo objects for each index
//   for (const index of indices) {
//     const url = body[`galleryPhotos[${index}][url]`];
//     const publicId = body[`galleryPhotos[${index}][publicId]`];
//     const name = body[`galleryPhotos[${index}][name]`] || '';
//     if (url && publicId) {
//       galleryPhotos[index] = { url, publicId, name };
//     }
//   }

//   return galleryPhotos.filter(photo => photo && photo.url && photo.publicId);
// };

// exports.createTeacherProfile = async (req, res) => {
//   let {
//     name, title, email, phone, aboutMe,
//     skills, experience, hourlyRate, qualifications
//   } = req.body;
//   const userId = req.user.id;

//   if (!userId) {
//     return res.status(401).json({ message: 'User not authenticated. Cannot create profile.' });
//   }

//   try {
//     let teacherProfile = await TeacherProfile.findOne({ userId });
//     if (teacherProfile) {
//       return res.status(409).json({ message: 'Teacher profile already exists for this user.' });
//     }

//     const user = await User.findById(userId);
//     if (!user || user.role !== 'teacher') {
//       return res.status(403).json({ message: 'Only users with a "teacher" role can create a teacher profile.' });
//     }

//     const uploadedMedia = await processFileUploads(req.files);
//     const incomingGalleryPhotos = parseIncomingGalleryPhotos(req.body);

//     const newTeacherProfile = new TeacherProfile({
//       userId,
//       avatar: uploadedMedia.avatar || { url: '', publicId: '' },
//       name,
//       title,
//       email,
//       phone,
//       aboutMe,
//       skills: Array.isArray(skills) ? skills : [],
//       experience,
//       hourlyRate: hourlyRate ? Number(hourlyRate) : 0,
//       qualifications: Array.isArray(qualifications) ? qualifications : [],
//       videoUrl: uploadedMedia.videoUrl || { url: '', publicId: '' },
//       galleryPhotos: [...incomingGalleryPhotos, ...(uploadedMedia.galleryPhotos || [])]
//     });

//     const savedProfile = await newTeacherProfile.save();

//     const populatedProfile = await TeacherProfile.findById(savedProfile._id)
//       .populate('userId', 'name email role');

//     res.status(201).json(populatedProfile);
//   } catch (error) {
//     console.error('Error creating teacher profile:', error);
//     if (error.code === 11000) {
//       if (error.keyPattern && error.keyPattern.email) {
//         return res.status(400).json({ message: 'A profile with this email already exists.' });
//       }
//       if (error.keyPattern && error.keyPattern.userId) {
//         return res.status(400).json({ message: 'A profile already exists for this user.' });
//       }
//     }
//     res.status(500).json({ message: 'Server error while creating teacher profile', error: error.message });
//   }
// };

// exports.getTeacherProfiles = async (req, res) => {
//   try {
//     const profiles = await TeacherProfile.find()
//       .populate('userId', 'name email');

//     res.status(200).json(profiles);
//   } catch (error) {
//     console.error('Error fetching all teacher profiles:', error);
//     res.status(500).json({ message: 'Server error while fetching teacher profiles', error: error.message });
//   }
// };

// exports.getTeacherProfileByUserId = async (req, res) => {
//   try {
//     const userIdInParam = req.params.userId;

//     const teacherProfile = await TeacherProfile.findOne({ userId: userIdInParam })
//       .populate('userId', 'name email');

//     if (!teacherProfile) {
//       return res.status(404).json({ message: 'Teacher profile not found for this user ID.' });
//     }
//     res.status(200).json(teacherProfile);
//   } catch (error) {
//     console.error('Error fetching teacher profile by user ID:', error);
//     res.status(500).json({ message: 'Server error while fetching teacher profile by user ID', error: error.message });
//   }
// };

// exports.getAuthenticatedTeacherProfile = async (req, res) => {
//   try {
//     const teacherProfile = await TeacherProfile.findOne({ userId: req.user.id })
//       .populate('userId', 'name email role');

//     if (!teacherProfile) {
//       return res.status(404).json({ message: 'Your teacher profile does not exist. Please create one.' });
//     }
//     res.status(200).json(teacherProfile);
//   } catch (error) {
//     console.error('Error fetching authenticated teacher profile:', error);
//     res.status(500).json({ message: 'Server error while fetching your teacher profile', error: error.message });
//   }
// };

// exports.updateTeacherProfile = async (req, res) => {
//   const {
//     name, title, email, phone, aboutMe,
//     skills, experience, hourlyRate, qualifications
//   } = req.body;
//   const authenticatedUserId = req.user.id;
//   const authenticatedUserRole = req.user.role;

//   try {
//     let teacherProfile = await TeacherProfile.findById(req.params.id);

//     if (!teacherProfile) {
//       return res.status(404).json({ message: 'Teacher profile not found.' });
//     }

//     if (teacherProfile.userId.toString() !== authenticatedUserId.toString() && authenticatedUserRole !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized to update this profile.' });
//     }

//     await handleSingleMediaUploadAndReplace(
//       teacherProfile,
//       'avatar',
//       req.files && req.files.avatar ? req.files.avatar[0] : undefined,
//       'image',
//       req.body.avatar === ''
//     );

//     await handleSingleMediaUploadAndReplace(
//       teacherProfile,
//       'videoUrl',
//       req.files && req.files.video ? req.files.video[0] : undefined,
//       'video',
//       req.body.videoUrl === ''
//     );

//     const uploadedMedia = await processFileUploads(req.files);
//     const incomingGalleryPhotos = parseIncomingGalleryPhotos(req.body);

//     let finalGalleryPhotos = [
//       ...incomingGalleryPhotos,
//       ...(uploadedMedia.galleryPhotos || [])
//     ];

//     const finalPublicIds = new Set(
//       finalGalleryPhotos
//         .filter(p => p && p.publicId)
//         .map(p => p.publicId)
//     );

//     const photosToDeletePromises = [];
//     for (const existingPhoto of teacherProfile.galleryPhotos || []) {
//       if (existingPhoto.publicId && !finalPublicIds.has(existingPhoto.publicId)) {
//         photosToDeletePromises.push(
//           deleteFromCloudinary(existingPhoto.publicId, 'image')
//             .catch(err => {
//               console.error(`Failed to delete gallery photo ${existingPhoto.publicId}:`, err.message);
//               throw new Error(`Failed to delete gallery photo ${existingPhoto.publicId}: ${err.message}`);
//             })
//         );
//       }
//     }
//     await Promise.all(photosToDeletePromises);

//     teacherProfile.galleryPhotos = finalGalleryPhotos;

//     teacherProfile.name = name !== undefined ? name : teacherProfile.name;
//     teacherProfile.title = title !== undefined ? title : teacherProfile.title;
//     teacherProfile.email = email !== undefined ? email : teacherProfile.email;
//     teacherProfile.phone = phone !== undefined ? phone : teacherProfile.phone;
//     teacherProfile.aboutMe = aboutMe !== undefined ? aboutMe : teacherProfile.aboutMe;
//     teacherProfile.skills = Array.isArray(skills) ? skills : teacherProfile.skills;
//     teacherProfile.experience = experience !== undefined ? experience : teacherProfile.experience;
//     teacherProfile.hourlyRate = hourlyRate !== undefined ? Number(hourlyRate) : teacherProfile.hourlyRate;
//     teacherProfile.qualifications = Array.isArray(qualifications) ? qualifications : teacherProfile.qualifications;

//     const updatedProfile = await teacherProfile.save();

//     const populatedProfile = await TeacherProfile.findById(updatedProfile._id)
//       .populate('userId', 'name email role');

//     res.status(200).json(populatedProfile);
//   } catch (error) {
//     console.error('Error updating teacher profile:', error);
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'The email address provided is already in use by another profile.' });
//     }
//     res.status(500).json({ message: 'Server error while updating teacher profile', error: error.message });
//   }
// };

// exports.deleteTeacherProfile = async (req, res) => {
//   const authenticatedUserId = req.user.id;
//   const authenticatedUserRole = req.user.role;

//   try {
//     const teacherProfile = await TeacherProfile.findById(req.params.id);

//     if (!teacherProfile) {
//       return res.status(404).json({ message: 'Teacher profile not found.' });
//     }

//     if (teacherProfile.userId.toString() !== authenticatedUserId.toString() && authenticatedUserRole !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized to delete this profile.' });
//     }

//     const deletionPromises = [];
//     if (teacherProfile.avatar && teacherProfile.avatar.publicId) {
//       deletionPromises.push(
//         deleteFromCloudinary(teacherProfile.avatar.publicId, 'image')
//           .catch(err => {
//             console.error(`Failed to delete avatar ${teacherProfile.avatar.publicId}:`, err.message);
//             throw new Error(`Failed to delete avatar: ${err.message}`);
//           })
//       );
//     }
//     if (teacherProfile.videoUrl && teacherProfile.videoUrl.publicId) {
//       deletionPromises.push(
//         deleteFromCloudinary(teacherProfile.videoUrl.publicId, 'video')
//           .catch(err => {
//             console.error(`Failed to delete video ${teacherProfile.videoUrl.publicId}:`, err.message);
//             throw new Error(`Failed to delete video: ${err.message}`);
//           })
//       );
//     }
//     if (teacherProfile.galleryPhotos && teacherProfile.galleryPhotos.length > 0) {
//       teacherProfile.galleryPhotos.forEach(photo => {
//         if (photo.publicId) {
//           deletionPromises.push(
//             deleteFromCloudinary(photo.publicId, 'image')
//               .catch(err => {
//                 console.error(`Failed to delete gallery photo ${photo.publicId}:`, err.message);
//                 throw new Error(`Failed to delete gallery photo ${photo.publicId}: ${err.message}`);
//               })
//           );
//         }
//       });
//     }

//     await Promise.all(deletionPromises);

//     await TeacherProfile.deleteOne({ _id: req.params.id });

//     res.status(200).json({ message: 'Teacher profile removed successfully.' });
//   } catch (error) {
//     console.error('Error deleting teacher profile:', error);
//     res.status(500).json({ message: 'Server error while deleting teacher profile', error: error.message });
//   }
// };






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
      throw new Error(`Avatar upload failed: ${uploadError.message}`);
    }
  }

  if (files.video && files.video[0]) {
    try {
      const result = await uploadToCloudinary(files.video[0], 'videos');
      uploadedMedia.videoUrl = { url: result.secure_url, publicId: result.public_id };
    } catch (uploadError) {
      console.error('Failed to upload video to Cloudinary:', uploadError);
      throw new Error(`Video upload failed: ${uploadError.message}`);
    }
  }

  if (files.galleryPhotos && files.galleryPhotos.length > 0) {
    const uploadPromises = files.galleryPhotos.map(file =>
      uploadToCloudinary(file, 'gallery')
        .then(result => ({ url: result.secure_url, publicId: result.public_id, name: file.originalname }))
        .catch(uploadError => {
          console.error(`Failed to upload gallery photo ${file.originalname}:`, uploadError);
          throw new Error(`Gallery photo upload failed: ${uploadError.message}`);
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
  console.log(`\n--- DEBUG: handleSingleMediaUploadAndReplace for ${mediaField} ---`);
  console.log(`DEBUG: Initial profile[${mediaField}]:`, JSON.stringify(profile[mediaField]));
  console.log(`DEBUG: newFile provided:`, !!newFile);
  console.log(`DEBUG: clearExplicitly requested:`, clearExplicitly);

  const oldPublicId = profile[mediaField]?.publicId || null;
  console.log(`DEBUG: oldPublicId captured:`, oldPublicId);

  let updatedMediaInfo = { url: '', publicId: '' };

  if (newFile) {
    console.log(`DEBUG: Entering 'newFile' branch for ${mediaField}.`);
    try {
      const folder = resourceType === 'image' ? 'avatars' : 'videos';
      console.log(`DEBUG: Uploading new file to folder: ${folder}`);
      const uploadResult = await uploadToCloudinary(newFile, folder);
      updatedMediaInfo = { url: uploadResult.secure_url, publicId: uploadResult.public_id };
      console.log(`DEBUG: New file uploaded. New publicId: ${uploadResult.public_id}`);

      if (oldPublicId) {
        console.log(`DEBUG: Attempting to delete old media: ${oldPublicId} (resourceType: ${resourceType})`);
        const deleted = await deleteFromCloudinary(oldPublicId, resourceType);
        if (deleted) {
          console.log(`DEBUG: Old media ${oldPublicId} DELETED successfully.`);
        } else {
          console.log(`DEBUG: Failed to delete old media ${oldPublicId}, proceeding with update.`);
        }
      } else {
        console.log(`DEBUG: No old publicId to delete for ${mediaField}.`);
      }
    } catch (uploadError) {
      console.error(`DEBUG: ERROR: Failed to upload new ${mediaField}:`, uploadError.message);
      throw new Error(`Failed to upload ${mediaField}: ${uploadError.message}`);
    }
  } else if (clearExplicitly) {
    console.log(`DEBUG: Entering 'clearExplicitly' branch for ${mediaField}.`);
    if (oldPublicId) {
      console.log(`DEBUG: Attempting to delete old media on explicit clear: ${oldPublicId} (resourceType: ${resourceType})`);
      const deleted = await deleteFromCloudinary(oldPublicId, resourceType);
      if (deleted) {
        console.log(`DEBUG: Old media ${oldPublicId} DELETED successfully on explicit clear.`);
      } else {
        console.log(`DEBUG: Failed to delete old media ${oldPublicId}, proceeding with update.`);
      }
    } else {
      console.log(`DEBUG: No old publicId to delete on explicit clear for ${mediaField}.`);
    }
    updatedMediaInfo = { url: '', publicId: '' };
  } else {
    console.log(`DEBUG: No new file or explicit clear. Retaining existing media for ${mediaField}.`);
    updatedMediaInfo = profile[mediaField] || { url: '', publicId: '' };
  }

  profile[mediaField] = updatedMediaInfo;
  console.log(`DEBUG: Final profile[${mediaField}] set to:`, JSON.stringify(profile[mediaField]));
  console.log(`--- DEBUG: End handleSingleMediaUploadAndReplace for ${mediaField} ---\n`);
}

const parseIncomingGalleryPhotos = (body) => {
  const galleryPhotos = [];
  const indices = new Set();

  for (const key in body) {
    const match = key.match(/galleryPhotos\[(\d+)\]\[(\w+)\]/);
    if (match) {
      const index = match[1];
      indices.add(index);
    }
  }

  for (const index of indices) {
    const url = body[`galleryPhotos[${index}][url]`];
    const publicId = body[`galleryPhotos[${index}][publicId]`];
    const name = body[`galleryPhotos[${index}][name]`] || '';
    if (url && publicId) {
      galleryPhotos[index] = { url, publicId, name };
    }
  }

  return galleryPhotos.filter(photo => photo && photo.url && publicId);
};

exports.createTeacherProfile = async (req, res) => {
  let {
    name, title, email, phone, aboutMe,
    skills, experience, hourlyRate, qualifications
  } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated. Cannot create profile.' });
  }

  try {
    let teacherProfile = await TeacherProfile.findOne({ userId });
    if (teacherProfile) {
      return res.status(409).json({ message: 'Teacher profile already exists for this user.' });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only users with a "teacher" role can create a teacher profile.' });
    }

    const uploadedMedia = await processFileUploads(req.files);
    const incomingGalleryPhotos = parseIncomingGalleryPhotos(req.body);

    const newTeacherProfile = new TeacherProfile({
      userId,
      avatar: uploadedMedia.avatar || { url: '', publicId: '' },
      name,
      title,
      email,
      phone,
      aboutMe,
      skills: Array.isArray(skills) ? skills : [],
      experience,
      hourlyRate: hourlyRate ? Number(hourlyRate) : 0,
      qualifications: Array.isArray(qualifications) ? qualifications : [],
      videoUrl: uploadedMedia.videoUrl || { url: '', publicId: '' },
      galleryPhotos: [...incomingGalleryPhotos, ...(uploadedMedia.galleryPhotos || [])]
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

// exports.getTeacherProfiles = async (req, res) => {
//   try {
//     const profiles = await TeacherProfile.find()
//       .populate('userId', 'name email');

//     res.status(200).json(profiles);
//   } catch (error) {
//     console.error('Error fetching all teacher profiles:', error);
//     res.status(500).json({ message: 'Server error while fetching teacher profiles', error: error.message });
//   }
// };



exports.getTeacherProfiles = async (req, res) => {
  try {
    const profiles = await TeacherProfile.find()
      .populate('userId', 'name email teachingSkills');

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
    skills, experience, hourlyRate, qualifications
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
      req.files && req.files.avatar ? req.files.avatar[0] : undefined,
      'image',
      req.body.avatar === ''
    );

    await handleSingleMediaUploadAndReplace(
      teacherProfile,
      'videoUrl',
      req.files && req.files.video ? req.files.video[0] : undefined,
      'video',
      req.body.videoUrl === ''
    );

    const uploadedMedia = await processFileUploads(req.files);
    const incomingGalleryPhotos = parseIncomingGalleryPhotos(req.body);

    let finalGalleryPhotos = [
      ...incomingGalleryPhotos,
      ...(uploadedMedia.galleryPhotos || [])
    ];

    const finalPublicIds = new Set(
      finalGalleryPhotos
        .filter(p => p && p.publicId)
        .map(p => p.publicId)
    );

    const photosToDeletePromises = [];
    for (const existingPhoto of teacherProfile.galleryPhotos || []) {
      if (existingPhoto.publicId && !finalPublicIds.has(existingPhoto.publicId)) {
        photosToDeletePromises.push(
          deleteFromCloudinary(existingPhoto.publicId, 'image')
            .then(deleted => {
              if (deleted) {
                console.log(`DEBUG: Gallery photo ${existingPhoto.publicId} deleted successfully.`);
              } else {
                console.log(`DEBUG: Failed to delete gallery photo ${existingPhoto.publicId}, proceeding with update.`);
              }
            })
        );
      }
    }
    await Promise.all(photosToDeletePromises);

    teacherProfile.galleryPhotos = finalGalleryPhotos;

    teacherProfile.name = name !== undefined ? name : teacherProfile.name;
    teacherProfile.title = title !== undefined ? title : teacherProfile.title;
    teacherProfile.email = email !== undefined ? email : teacherProfile.email;
    teacherProfile.phone = phone !== undefined ? phone : teacherProfile.phone;
    teacherProfile.aboutMe = aboutMe !== undefined ? aboutMe : teacherProfile.aboutMe;
    teacherProfile.skills = Array.isArray(skills) ? skills : teacherProfile.skills;
    teacherProfile.experience = experience !== undefined ? experience : teacherProfile.experience;
    teacherProfile.hourlyRate = hourlyRate !== undefined ? Number(hourlyRate) : teacherProfile.hourlyRate;
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
      deletionPromises.push(
        deleteFromCloudinary(teacherProfile.avatar.publicId, 'image')
          .then(deleted => {
            if (deleted) {
              console.log(`DEBUG: Avatar ${teacherProfile.avatar.publicId} deleted successfully.`);
            } else {
              console.log(`DEBUG: Failed to delete avatar ${teacherProfile.avatar.publicId}, proceeding with update.`);
            }
          })
      );
    }
    if (teacherProfile.videoUrl && teacherProfile.videoUrl.publicId) {
      deletionPromises.push(
        deleteFromCloudinary(teacherProfile.videoUrl.publicId, 'video')
          .then(deleted => {
            if (deleted) {
              console.log(`DEBUG: Video ${teacherProfile.videoUrl.publicId} deleted successfully.`);
            } else {
              console.log(`DEBUG: Failed to delete video ${teacherProfile.videoUrl.publicId}, proceeding with update.`);
            }
          })
      );
    }
    if (teacherProfile.galleryPhotos && teacherProfile.galleryPhotos.length > 0) {
      teacherProfile.galleryPhotos.forEach(photo => {
        if (photo.publicId) {
          deletionPromises.push(
            deleteFromCloudinary(photo.publicId, 'image')
              .then(deleted => {
                if (deleted) {
                  console.log(`DEBUG: Gallery photo ${photo.publicId} deleted successfully.`);
                } else {
                  console.log(`DEBUG: Failed to delete gallery photo ${photo.publicId}, proceeding with update.`);
                }
              })
          );
        }
      });
    }

    await Promise.all(deletionPromises);

    await TeacherProfile.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Teacher profile removed successfully.' });
  } catch (error) {
    console.error('Error deleting teacher profile:', error);
    res.status(500).json({ message: 'Server error while deleting teacher profile', error: error.message });
  }
};



exports.getTeacherProfileById = async (req, res) => {
  try {
    const profile = await TeacherProfile.findById(req.params.id).populate('userId', 'name bio availability teachingSkills');
    if (!profile) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const formattedAvailability = profile.userId.availability.map(item => {
      const date = item.date.toISOString().split('T')[0];
      return `${date} ${item.slots.map(slot => `${slot.startTime}-${slot.endTime}`).join(', ')}`;
    });

    res.json({
      _id: profile._id,
      name: profile.userId.name || 'Unknown Teacher',
      avatarUrl: profile.avatar?.url || '',
      teachingSkills: profile.userId?.teachingSkills || profile.skills || [],
      rating: profile.rating || 0,
      hourlyRate: profile.hourlyRate || 0,
      bio: profile.userId.bio || 'No bio available',
      availability: formattedAvailability.length ? formattedAvailability : [],
      videoUrl: profile.videoUrl?.url || '',
      galleryPhotos: profile.galleryPhotos || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getTeacherAvailability = async (req, res) => {
  try {
    const teacherProfile = await TeacherProfile.findById(req.params.id).populate('userId', 'availability');
    if (!teacherProfile) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const availability = teacherProfile.userId.availability.map(item => ({
      date: item.date.toISOString().split('T')[0],
      slots: item.slots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
        available: slot.available,
      })),
    }));

    res.status(200).json({ availability });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { date, slotId } = req.body; // slotId should be a unique identifier (e.g., index or custom ID)
    const teacherProfile = await TeacherProfile.findById(req.params.id).populate('userId', 'availability');
    if (!teacherProfile) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const user = teacherProfile.userId;
    const availability = user.availability.find(a => format(new Date(a.date), "yyyy-MM-dd") === date);
    if (!availability) {
      return res.status(400).json({ message: 'No availability for the selected date' });
    }

    const slotIndex = availability.slots.findIndex(slot => {
      const slotKey = `${availability.date.toISOString().split('T')[0]}-${slot.startTime}-${slot.endTime}`;
      return slotKey === slotId; // Match based on a unique identifier
    });

    if (slotIndex === -1 || !availability.slots[slotIndex].available) {
      return res.status(400).json({ message: 'Slot not available' });
    }

    availability.slots[slotIndex].available = false;
    await user.save();

    res.status(201).json({ message: 'Booking successful', bookedSlot: availability.slots[slotIndex] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





