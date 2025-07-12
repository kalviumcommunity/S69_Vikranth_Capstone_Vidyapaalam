// // src/contexts/TeacherProfileContext.js

// import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
// import { toast } from '@/hooks/use-toast'; 
// import { useAuth } from './AuthContext'; 
// import { api } from '../api/axios'; 

// const TeacherProfileContext = createContext(null);


// const TEACHER_PROFILE_API_PATH = "/api/teacher-profiles";

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

//   const fetchTeacherProfile = useCallback(async () => {
//     if (authLoading || !user) {
//       if (!authLoading) { 
//         setIsLoading(false);
//       }
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
//         setTeacherProfile(null);
//         toast({
//           title: "Failed to load profile",
//           description: err.response?.data?.message || "Please try again.",
//           variant: "destructive",
//         });
//       }
//     } finally {
//       if (isMountedRef.current) {
//         setIsLoading(false);
//       }
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
//         profileDataUpdates[key].forEach((item) => formData.append(key, item));
//       } else if (profileDataUpdates[key] !== null && profileDataUpdates[key] !== undefined) {
//         formData.append(key, profileDataUpdates[key]);
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
//   }, [user, teacherProfile, avatarFile, videoFile, galleryFiles]); // Dependencies for useCallback


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
//         profileData[key].forEach((item) => formData.append(key, item));
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
        toast({
          title: "Failed to load profile",
          description: err.response?.data?.message || "Please try again.",
          variant: "destructive",
        });
      }
      throw err;
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

    for (const key in profileDataUpdates) {
      if (Array.isArray(profileDataUpdates[key])) {
        if (key === 'galleryPhotos') {
          // FIX: Correctly append each property of the gallery photo objects
          profileDataUpdates[key].forEach((item, index) => {
            // Ensure item is an object before iterating its keys
            if (typeof item === 'object' && item !== null) {
              Object.keys(item).forEach(prop => {
                formData.append(`${key}[${index}][${prop}]`, item[prop]);
              });
            }
          });
        } else {
          // For other arrays (skills, qualifications), just append items
          profileDataUpdates[key].forEach((item) => formData.append(key, item));
        }
      } else if (profileDataUpdates[key] !== null && profileDataUpdates[key] !== undefined) {
        formData.append(key, profileDataUpdates[key]);
      }
    }

    // Append files from local state (avatarFile, videoFile, galleryFiles)
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    } else if (profileDataUpdates.avatar === '') { // Explicitly clear avatar
      formData.append("avatar", '');
    }

    if (videoFile) {
      formData.append("video", videoFile);
    } else if (profileDataUpdates.videoUrl === '') { // Explicitly clear video
      formData.append("videoUrl", '');
    }

    galleryFiles.forEach((file) => {
      formData.append("galleryPhotos", file); // These are new File objects
    });

    try {
      const response = await api.put(
        `${TEACHER_PROFILE_API_PATH}/${teacherProfile._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (isMountedRef.current) {
        setTeacherProfile(response.data);
        toast({ title: "Profile updated successfully!" });

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
      throw err;
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
    formData.append("userId", user.id);

    for (const key in profileData) {
      if (Array.isArray(profileData[key])) {
        if (key === 'galleryPhotos') {
          // FIX: Correctly append each property of the gallery photo objects for creation
          profileData[key].forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              Object.keys(item).forEach(prop => {
                formData.append(`${key}[${index}][${prop}]`, item[prop]);
              });
            }
          });
        } else {
          profileData[key].forEach((item) => formData.append(key, item));
        }
      } else if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]);
      }
    }

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    if (videoFile) {
      formData.append("video", videoFile);
    }
    galleryFiles.forEach((file) => {
      formData.append("galleryPhotos", file);
    });

    try {
      const response = await api.post(
        TEACHER_PROFILE_API_PATH,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (isMountedRef.current) {
        setTeacherProfile(response.data);
        toast({ title: "Profile created successfully!" });

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
      throw err;
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
