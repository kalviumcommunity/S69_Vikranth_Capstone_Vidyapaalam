
// // src/contexts/TeacherProfileContext.js

// import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
// import { toast } from '@/hooks/use-toast';
// import { useAuth } from './AuthContext';
// import { api } from '../api/axios';

// // Create the context
// const TeacherProfileContext = createContext(null);

// // Export the context
// export { TeacherProfileContext };

// const TEACHER_PROFILE_API_PATH = "/api/teacher-profiles";

// // Provider Component
// export const TeacherProfileProvider = ({ children }) => {
//   const { user, loading: authLoading } = useAuth();
//   const [teacherProfile, setTeacherProfile] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState(null);

//   const [avatarFile, setAvatarFile] = useState(null);
//   const [videoFile, setVideoFile] = useState(null);
//   const [galleryFiles, setGalleryFiles] = useState([]);

//   const isMountedRef = useRef(true);

//   useEffect(() => {
//     return () => {
//       isMountedRef.current = false;
//     };
//   }, []);






// src/contexts/TeacherProfileContext.js

import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { api } from '../api/axios';

// Create the context
const TeacherProfileContext = createContext(null);

// Export the context
export { TeacherProfileContext };

const TEACHER_PROFILE_API_PATH = "/api/teacher-profiles";

// Provider Component
export const TeacherProfileProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [avatarFile, setAvatarFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchTeacherProfile = useCallback(async () => {
    if (authLoading || !user) {
      if (!authLoading) setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`${TEACHER_PROFILE_API_PATH}/me`);
      if (isMountedRef.current) {
        setTeacherProfile(response.data);
      }
    } catch (err) {
      console.error("Error fetching teacher profile:", err.response?.data || err.message);
      if (isMountedRef.current) {
        setError(err);
        setTeacherProfile(null); // Clear profile if fetching fails

        if (err.response && err.response.status === 404 && err.response.data?.message === 'Your teacher profile does not exist. Please create one.') {
          toast({
            title: "Profile not found",
            description: "It looks like you don't have a teacher profile yet. Please create one.",
            variant: "default",
          });
        } else {
          toast({
            title: "Failed to load profile",
            description: err.response?.data?.message || "Please try again.",
            variant: "destructive",
          });
        }
      }
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    fetchTeacherProfile();
  }, [fetchTeacherProfile]);

  const updateTeacherProfile = useCallback(async (profileDataUpdates) => {
    if (!user || !user.id || !teacherProfile?._id) {
      toast({ title: "Error", description: "User not authenticated or profile ID missing.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    setError(null);

    const formData = new FormData();

    // Append all non-file fields to FormData
    for (const key in profileDataUpdates) {
      if (Array.isArray(profileDataUpdates[key])) {
        // Special handling for galleryPhotos array which might contain objects (existing photos metadata)
        if (key === 'galleryPhotos') {
          profileDataUpdates[key].forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              // Assuming 'item' is an object for existing photos, append its properties
              Object.keys(item).forEach(prop => {
                formData.append(`${key}[${index}][${prop}]`, item[prop]);
              });
            } else {
              // Fallback for primitive values in array, though not expected for galleryPhotos array
              formData.append(key, item);
            }
          });
        } else {
          // For other arrays (e.g., subjects, languages), append each item
          profileDataUpdates[key].forEach((item) => formData.append(key, item));
        }
      } else if (profileDataUpdates[key] !== null && profileDataUpdates[key] !== undefined) {
        formData.append(key, profileDataUpdates[key]);
      }
    }

    // Append file objects if they exist
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    } else if (profileDataUpdates.avatar === '') { // Handles explicit avatar removal
      formData.append("avatar", '');
    }

    if (videoFile) {
      formData.append("video", videoFile);
    } else if (profileDataUpdates.videoUrl === '') { // Handles explicit video removal
      formData.append("videoUrl", '');
    }

    // Append new gallery files
    galleryFiles.forEach((file) => {
      formData.append("galleryPhotos", file);
    });

    try {
      const response = await api.put(
        `${TEACHER_PROFILE_API_PATH}/${teacherProfile._id}`,
        formData,
        // *** IMPORTANT: DO NOT set "Content-Type": "multipart/form-data" manually.
        // Axios handles this automatically when a FormData object is provided.
        // Removing it prevents issues with boundary string generation.
        // If other headers are needed, add them here, but not Content-Type for FormData.
        {}
      );
      if (isMountedRef.current) {
        setTeacherProfile(response.data);
        toast({ title: "Profile updated successfully!" });

        // Clear file states after successful upload
        setAvatarFile(null);
        setVideoFile(null);
        setGalleryFiles([]);
      }
    } catch (err) {
      console.error("Error updating teacher profile:", err.response?.data || err.message);
      if (isMountedRef.current) {
        setError(err);
        toast({
          title: "Failed to update profile",
          description: err.response?.data?.message || "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  }, [user, teacherProfile, avatarFile, videoFile, galleryFiles]);


  const createTeacherProfile = useCallback(async (profileData) => {
    if (!user || !user.id) {
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append("userId", user.id); // Ensure userId is sent for new profile creation

    // Append all non-file fields to FormData
    for (const key in profileData) {
      if (Array.isArray(profileData[key])) {
        // Special handling for galleryPhotos array which might contain objects
        if (key === 'galleryPhotos') {
          profileData[key].forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              // Assuming 'item' is an object for existing photos, append its properties
              Object.keys(item).forEach(prop => {
                formData.append(`${key}[${index}][${prop}]`, item[prop]);
              });
            } else {
              // Fallback for primitive values in array, though not expected for galleryPhotos array
              formData.append(key, item);
            }
          });
        } else {
          // For other arrays (e.g., subjects, languages), append each item
          profileData[key].forEach((item) => formData.append(key, item));
        }
      } else if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]);
      }
    }

    // Append file objects if they exist
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    if (videoFile) {
      formData.append("video", videoFile);
    }
    // Append new gallery files
    galleryFiles.forEach((file) => {
      formData.append("galleryPhotos", file);
    });

    try {
      const response = await api.post(
        TEACHER_PROFILE_API_PATH,
        formData,
        // *** IMPORTANT: DO NOT set "Content-Type": "multipart/form-data" manually.
        // Axios handles this automatically when a FormData object is provided.
        // Removing it prevents issues with boundary string generation.
        // If other headers are needed, add them here, but not Content-Type for FormData.
        {}
      );
      if (isMountedRef.current) {
        setTeacherProfile(response.data);
        toast({ title: "Profile created successfully!" });

        // Clear file states after successful upload
        setAvatarFile(null);
        setVideoFile(null);
        setGalleryFiles([]);
      }
    } catch (err) {
      console.error("Error creating teacher profile:", err.response?.data || err.message);
      if (isMountedRef.current) {
        setError(err);
        toast({
          title: "Failed to create profile",
          description: err.response?.data?.message || "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  }, [user, avatarFile, videoFile, galleryFiles]);


  const contextValue = {
    teacherProfile,
    isLoading,
    isSaving,
    error,
    fetchTeacherProfile,
    updateTeacherProfile,
    createTeacherProfile,
    setAvatarFile,
    setVideoFile,
    setGalleryFiles,
    avatarFile,
    videoFile,
    galleryFiles
  };

  return (
    <TeacherProfileContext.Provider value={contextValue}>
      {children}
    </TeacherProfileContext.Provider>
  );
};

export const useTeacherProfile = () => {
  const context = useContext(TeacherProfileContext);
  if (!context) {
    throw new Error('useTeacherProfile must be used within a TeacherProfileProvider');
  }
  return context;
};

//   const fetchTeacherProfile = useCallback(async () => {
//     if (authLoading || !user) {
//       if (!authLoading) setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await api.get(`${TEACHER_PROFILE_API_PATH}/me`);
//       if (isMountedRef.current) {
//         setTeacherProfile(response.data);
//       }
//     } catch (err) {
//       console.error("Error fetching teacher profile:", err.response?.data || err.message);
//       if (isMountedRef.current) {
//         setError(err);
//         setTeacherProfile(null); // Clear profile if fetching fails

//         if (err.response && err.response.status === 404 && err.response.data?.message === 'Your teacher profile does not exist. Please create one.') {
//           toast({
//             title: "Profile not found",
//             description: "It looks like you don't have a teacher profile yet. Please create one.",
//             variant: "default",
//           });
//         } else {
//           toast({
//             title: "Failed to load profile",
//             description: err.response?.data?.message || "Please try again.",
//             variant: "destructive",
//           });
//         }
//       }
//     } finally {
//       if (isMountedRef.current) setIsLoading(false);
//     }
//   }, [user, authLoading]);

//   useEffect(() => {
//     fetchTeacherProfile();
//   }, [fetchTeacherProfile]);

//   const updateTeacherProfile = useCallback(async (profileDataUpdates) => {
//     if (!user || !user.id || !teacherProfile?._id) {
//       toast({ title: "Error", description: "User not authenticated or profile ID missing.", variant: "destructive" });
//       return;
//     }

//     setIsSaving(true);
//     setError(null);

//     const formData = new FormData();

//     for (const key in profileDataUpdates) {
//       if (Array.isArray(profileDataUpdates[key])) {
//         if (key === 'galleryPhotos') {
//           profileDataUpdates[key].forEach((item, index) => {
//             if (typeof item === 'object' && item !== null) {
//               Object.keys(item).forEach(prop => {
//                 formData.append(`${key}[${index}][${prop}]`, item[prop]);
//               });
//             }
//           });
//         } else {
//           profileDataUpdates[key].forEach((item) => formData.append(key, item));
//         }
//       } else if (profileDataUpdates[key] !== null && profileDataUpdates[key] !== undefined) {
//         formData.append(key, profileDataUpdates[key]);
//       }
//     }

//     if (avatarFile) {
//       formData.append("avatar", avatarFile);
//     } else if (profileDataUpdates.avatar === '') {
//       formData.append("avatar", '');
//     }

//     if (videoFile) {
//       formData.append("video", videoFile);
//     } else if (profileDataUpdates.videoUrl === '') {
//       formData.append("videoUrl", '');
//     }

//     galleryFiles.forEach((file) => {
//       formData.append("galleryPhotos", file);
//     });

//     try {
//       const response = await api.put(
//         `${TEACHER_PROFILE_API_PATH}/${teacherProfile._id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       if (isMountedRef.current) {
//         setTeacherProfile(response.data);
//         toast({ title: "Profile updated successfully!" });

//         setAvatarFile(null);
//         setVideoFile(null);
//         setGalleryFiles([]);
//       }
//     } catch (err) {
//       console.error("Error updating teacher profile:", err.response?.data || err.message);
//       if (isMountedRef.current) {
//         setError(err);
//         toast({
//           title: "Failed to update profile",
//           description: err.response?.data?.message || "Please try again.",
//           variant: "destructive",
//         });
//       }
//     } finally {
//       if (isMountedRef.current) {
//         setIsSaving(false);
//       }
//     }
//   }, [user, teacherProfile, avatarFile, videoFile, galleryFiles]);


//   const createTeacherProfile = useCallback(async (profileData) => {
//     if (!user || !user.id) {
//       toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
//       return;
//     }

//     setIsSaving(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append("userId", user.id);

//     for (const key in profileData) {
//       if (Array.isArray(profileData[key])) {
//         if (key === 'galleryPhotos') {
//           profileData[key].forEach((item, index) => {
//             if (typeof item === 'object' && item !== null) {
//               Object.keys(item).forEach(prop => {
//                 formData.append(`${key}[${index}][${prop}]`, item[prop]);
//               });
//             }
//           });
//         } else {
//           profileData[key].forEach((item) => formData.append(key, item));
//         }
//       } else if (profileData[key] !== null && profileData[key] !== undefined) {
//         formData.append(key, profileData[key]);
//       }
//     }

//     if (avatarFile) {
//       formData.append("avatar", avatarFile);
//     }
//     if (videoFile) {
//       formData.append("video", videoFile);
//     }
//     galleryFiles.forEach((file) => {
//       formData.append("galleryPhotos", file);
//     });

//     try {
//       const response = await api.post(
//         TEACHER_PROFILE_API_PATH,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       if (isMountedRef.current) {
//         setTeacherProfile(response.data);
//         toast({ title: "Profile created successfully!" });

//         setAvatarFile(null);
//         setVideoFile(null);
//         setGalleryFiles([]);
//       }
//     } catch (err) {
//       console.error("Error creating teacher profile:", err.response?.data || err.message);
//       if (isMountedRef.current) {
//         setError(err);
//         toast({
//           title: "Failed to create profile",
//           description: err.response?.data?.message || "Please try again.",
//           variant: "destructive",
//         });
//       }
//     } finally {
//       if (isMountedRef.current) {
//         setIsSaving(false);
//       }
//     }
//   }, [user, avatarFile, videoFile, galleryFiles]);


//   const contextValue = {
//     teacherProfile,
//     isLoading,
//     isSaving,
//     error,
//     fetchTeacherProfile,
//     updateTeacherProfile,
//     createTeacherProfile,
//     setAvatarFile,
//     setVideoFile,
//     setGalleryFiles,
//     avatarFile,
//     videoFile,
//     galleryFiles
//   };

//   return (
//     <TeacherProfileContext.Provider value={contextValue}>
//       {children}
//     </TeacherProfileContext.Provider>
//   );
// };

// export const useTeacherProfile = () => {
//   const context = useContext(TeacherProfileContext);
//   if (!context) {
//     throw new Error('useTeacherProfile must be used within a TeacherProfileProvider');
//   }
//   return context;
// };

