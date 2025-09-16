import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/axios';
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
      if (!user) {
        setTeacherProfile(null);
        setIsLoading(false);
        return;
      }

      if (user.role !== 'teacher') {
        setTeacherProfile(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get('/api/teacher-profiles/me');
        setTeacherProfile(response.data);
      } catch (error) {
        console.error('Error fetching teacher profile:', error);
        if (error.response?.status !== 404 && error.response?.status !== 403) {
          alert('Error: Failed to fetch teacher profile. ' + (error.response?.data?.message || 'Please try again.'));
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
      galleryFiles.forEach((file) => {
        formData.append('galleryPhotos', file);
      });

      const response = await api.post('/api/teacher-profiles', formData);
      setTeacherProfile(response.data);
      setAvatarFile(null);
      setVideoFile(null);
      setGalleryFiles([]);
      alert('Success: Teacher profile created successfully.');
      return response.data;
    } catch (error) {
      console.error('Error creating teacher profile:', error);
      alert('Error: ' + (error.response?.data?.message || 'Failed to create teacher profile.'));
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
      galleryFiles.forEach((file) => {
        formData.append('galleryPhotos', file);
      });

      const response = await api.put(`/api/teacher-profiles/${teacherProfile._id}`, formData);
      setTeacherProfile(response.data);
      setAvatarFile(null);
      setVideoFile(null);
      setGalleryFiles([]);
      alert('Success: Teacher profile updated successfully.');
      return response.data;
    } catch (error) {
      console.error('Error updating teacher profile:', error);
      alert('Error: ' + (error.response?.data?.message || 'Failed to update teacher profile.'));
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
