
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




import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';

export const TeacherProfileContext = createContext();

export const TeacherProfileProvider = ({ children }) => {
  const { user } = useAuth();
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const response = await api.get('/api/teacher-profiles/me');
        setTeacherProfile(response.data);
      } catch (error) {
        console.error('Error fetching teacher profile:', error);
        if (error.response?.status !== 404) {
          toast({
            title: 'Error',
            description: 'Failed to fetch teacher profile.',
            variant: 'destructive'
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const createTeacherProfile = async (profileData) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      for (const key in profileData) {
        if (Object.prototype.hasOwnProperty.call(profileData, key)) {
          if (key === 'galleryPhotos' && Array.isArray(profileData[key])) {
            profileData[key].forEach((photo, index) => {
              formData.append(`galleryPhotos[${index}][url]`, photo.url || '');
              formData.append(`galleryPhotos[${index}][publicId]`, photo._id || '');
              formData.append(`galleryPhotos[${index}][name]`, photo.name || '');
            });
          } else if (Array.isArray(profileData[key])) {
            profileData[key].forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else {
            formData.append(key, profileData[key] ?? '');
          }
        }
      }

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      if (videoFile) {
        formData.append('video', videoFile);
      }
      galleryFiles.forEach((file, index) => {
        formData.append('galleryPhotos', file);
      });

      // Debug FormData
      console.log('DEBUG: createTeacherProfile FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      const response = await api.post('/api/teacher-profiles', formData);
      setTeacherProfile(response.data);
      setAvatarFile(null);
      setVideoFile(null);
      setGalleryFiles([]);
      toast({
        title: 'Success',
        description: 'Teacher profile created successfully.',
        variant: 'success'
      });
      return response.data;
    } catch (error) {
      console.error('Error creating teacher profile:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create teacher profile.',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const updateTeacherProfile = async (profileData) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      for (const key in profileData) {
        if (Object.prototype.hasOwnProperty.call(profileData, key)) {
          if (key === 'galleryPhotos' && Array.isArray(profileData[key])) {
            profileData[key].forEach((photo, index) => {
              formData.append(`galleryPhotos[${index}][url]`, photo.url || '');
              formData.append(`galleryPhotos[${index}][publicId]`, photo._id || '');
              formData.append(`galleryPhotos[${index}][name]`, photo.name || '');
            });
          } else if (Array.isArray(profileData[key])) {
            profileData[key].forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else {
            formData.append(key, profileData[key] ?? '');
          }
        }
      }

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      if (videoFile) {
        formData.append('video', videoFile);
      }
      galleryFiles.forEach((file, index) => {
        formData.append('galleryPhotos', file);
      });

      // Debug FormData
      console.log('DEBUG: updateTeacherProfile FormData:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      const response = await api.put(`/api/teacher-profiles/${teacherProfile._id}`, formData);
      setTeacherProfile(response.data);
      setAvatarFile(null);
      setVideoFile(null);
      setGalleryFiles([]);
      toast({
        title: 'Success',
        description: 'Teacher profile updated successfully.',
        variant: 'success'
      });
      return response.data;
    } catch (error) {
      console.error('Error updating teacher profile:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update teacher profile.',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TeacherProfileContext.Provider
      value={{
        teacherProfile,
        setTeacherProfile,
        isLoading,
        isSaving,
        createTeacherProfile,
        updateTeacherProfile,
        avatarFile,
        setAvatarFile,
        videoFile,
        setVideoFile,
        galleryFiles,
        setGalleryFiles
      }}
    >
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
