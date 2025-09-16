import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Video, X, Loader2 } from "lucide-react";
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { useAuth } from "@/contexts/AuthContext";
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { v4 as uuidv4 } from 'uuid';

const TeacherProfileEdit = () => {
  const {
    teacherProfile,
    isLoading,
    isSaving,
    updateTeacherProfile,
    createTeacherProfile,
    setAvatarFile,
    setVideoFile,
    setGalleryFiles,
    avatarFile,
    videoFile,
    galleryFiles
  } = useTeacherProfile();

  const { user, loading: authLoading } = useAuth();

  const [currentTab, setCurrentTab] = useState("basic");
  const [newSkill, setNewSkill] = useState("");
  const [newQualification, setNewQualification] = useState("");
  const [galleryUrls, setGalleryUrls] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [galleryFileIds, setGalleryFileIds] = useState([]);
  const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);
  const [hasModifiedGallery, setHasModifiedGallery] = useState(false);

  const avatarInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const photoInputRef = useRef(null);

  const [localProfileData, setLocalProfileData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    aboutMe: "",
    skills: [],
    experience: "",
    hourlyRate: "",
    qualifications: [],
    galleryPhotos: [],
    deleteAvatar: false,
    deleteVideo: false
  });

  useEffect(() => {
    if (teacherProfile && !isSaving && !hasModifiedGallery) {
      console.log('Syncing with teacherProfile:', {
        id: teacherProfile._id,
        galleryPhotos: teacherProfile.galleryPhotos
      });
      setLocalProfileData(prev => ({
        ...prev,
        name: teacherProfile.name || prev.name,
        title: teacherProfile.title || prev.title,
        email: teacherProfile.email || prev.email,
        phone: teacherProfile.phone || prev.phone,
        aboutMe: teacherProfile.aboutMe || prev.aboutMe,
        skills: teacherProfile.skills || prev.skills,
        experience: teacherProfile.experience || prev.experience,
        hourlyRate: teacherProfile.hourlyRate !== undefined && teacherProfile.hourlyRate !== null ? String(teacherProfile.hourlyRate) : prev.hourlyRate,
        qualifications: teacherProfile.qualifications || prev.qualifications,
        galleryPhotos: teacherProfile.galleryPhotos?.map(p => ({
          url: p.url,
          _id: p._id || uuidv4()
        })) || prev.galleryPhotos,
        deleteAvatar: prev.deleteAvatar,
        deleteVideo: prev.deleteVideo
      }));
      setAvatarFile(null);
      setVideoFile(null);
      setGalleryFiles([]);
      setGalleryUrls([]);
      setGalleryFileIds([]);
      setAvatarUrl(teacherProfile.avatar?.url || "");
      setVideoUrl(teacherProfile.videoUrl?.url || "");
    } else if (user && !authLoading && !isLoading && !hasModifiedGallery && !isSaving) {
      console.log('Syncing with user:', user);
      setLocalProfileData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phoneNumber || prev.phone,
        aboutMe: user.bio || prev.aboutMe,
        skills: user.skills || prev.skills,
        deleteAvatar: prev.deleteAvatar,
        deleteVideo: prev.deleteVideo
      }));
      setAvatarUrl("");
      setVideoUrl("");
      setGalleryUrls([]);
      setGalleryFileIds([]);
    } else {
      console.log('Skipping sync: isSaving=', isSaving, 'hasModifiedGallery=', hasModifiedGallery);
    }
  }, [teacherProfile, user, authLoading, isLoading, isSaving, hasModifiedGallery, setAvatarFile, setVideoFile, setGalleryFiles]);

  useEffect(() => {
    console.log('Updated localProfileData:', {
      galleryPhotos: localProfileData.galleryPhotos
    });
  }, [localProfileData.galleryPhotos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const newUrl = URL.createObjectURL(file);
      setAvatarFile(file);
      setAvatarUrl(newUrl);
      setLocalProfileData(prev => ({
        ...prev,
        deleteAvatar: false
      }));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please upload a valid image file.',
        confirmButtonColor: '#f97316',
        timer: 5000,
        timerProgressBar: true
      });
    }
  };

  const handleRemoveAvatar = () => {
    if (avatarFile && avatarUrl) {
      URL.revokeObjectURL(avatarUrl);
    }
    setAvatarFile(null);
    setAvatarUrl("");
    setLocalProfileData(prev => ({
      ...prev,
      deleteAvatar: true
    }));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      const newUrl = URL.createObjectURL(file);
      setVideoFile(file);
      setVideoUrl(newUrl);
      setLocalProfileData(prev => ({
        ...prev,
        deleteVideo: false
      }));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please upload a valid video file.',
        confirmButtonColor: '#f97316',
        timer: 5000,
        timerProgressBar: true
      });
    }
  };

  const handleRemoveVideo = () => {
    if (videoFile && videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(null);
    setVideoUrl("");
    setLocalProfileData(prev => ({
      ...prev,
      deleteVideo: true
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith("image/"));
    if (files.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Files',
        text: 'Please upload valid image files.',
        confirmButtonColor: '#f97316',
        timer: 5000,
        timerProgressBar: true
      });
      return;
    }
    const currentTotalPhotos = (localProfileData.galleryPhotos?.length || 0) + galleryFiles.length;
    const newFilesToAdd = files.slice(0, 10 - currentTotalPhotos);
    if (newFilesToAdd.length < files.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Photo Limit',
        text: `You can only upload up to ${10 - currentTotalPhotos} more photos.`,
        confirmButtonColor: '#f97316',
        timer: 5000,
        timerProgressBar: true
      });
    }
    const newUrls = newFilesToAdd.map(file => URL.createObjectURL(file));
    const newFileIds = newFilesToAdd.map(() => uuidv4());
    setGalleryFiles((prev) => [...prev, ...newFilesToAdd]);
    setGalleryUrls((prev) => [...prev, ...newUrls]);
    setGalleryFileIds((prev) => [...prev, ...newFileIds]);
    setHasModifiedGallery(true);
  };

  const handleRemoveGalleryPhoto = (indexToRemove) => {
    if (isRemovingPhoto) {
      console.warn('Photo removal in progress, skipping:', indexToRemove);
      return;
    }
    setIsRemovingPhoto(true);
    console.log('Before removal:', {
      galleryPhotos: localProfileData.galleryPhotos,
      galleryFiles: galleryFiles,
      galleryUrls: galleryUrls,
      galleryFileIds: galleryFileIds,
      indexToRemove
    });
    const savedPhotosCount = localProfileData.galleryPhotos?.length || 0;
    if (indexToRemove < savedPhotosCount) {
      const newGalleryPhotos = localProfileData.galleryPhotos.filter((_, i) => i !== indexToRemove);
      console.log('New galleryPhotos after filter:', newGalleryPhotos);
      setLocalProfileData(prev => ({
        ...prev,
        galleryPhotos: [...newGalleryPhotos]
      }));
      setHasModifiedGallery(true);
    } else {
      const newFileIndex = indexToRemove - savedPhotosCount;
      if (newFileIndex >= 0 && newFileIndex < galleryFiles.length) {
        setGalleryFiles((prev) => prev.filter((_, i) => i !== newFileIndex));
        setGalleryUrls((prev) => {
          const newUrls = prev.filter((_, i) => i !== newFileIndex);
          URL.revokeObjectURL(prev[newFileIndex]);
          return newUrls;
        });
        setGalleryFileIds((prev) => prev.filter((_, i) => i !== newFileIndex));
        setHasModifiedGallery(true);
      } else {
        console.warn(`Invalid newFileIndex: ${newFileIndex}`);
      }
    }
    setTimeout(() => setIsRemovingPhoto(false), 100);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !localProfileData.skills.includes(newSkill.trim())) {
      setLocalProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setLocalProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove)
    }));
  };

  const handleAddQualification = () => {
    if (
      newQualification.trim() &&
      !localProfileData.qualifications.includes(newQualification.trim())
    ) {
      setLocalProfileData((prev) => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()]
      }));
      setNewQualification("");
    }
  };

  const handleRemoveQualification = (qualToRemove) => {
    setLocalProfileData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((qual) => qual !== qualToRemove)
    }));
  };

  const handleSaveAllProfileData = async (e) => {
    e.preventDefault();

    const formData = {
      name: localProfileData.name,
      title: localProfileData.title,
      email: localProfileData.email,
      phone: localProfileData.phone,
      aboutMe: localProfileData.aboutMe,
      skills: localProfileData.skills,
      experience: localProfileData.experience,
      hourlyRate: localProfileData.hourlyRate === "" ? undefined : Number(localProfileData.hourlyRate),
      qualifications: localProfileData.qualifications,
      galleryPhotos: localProfileData.galleryPhotos
    };

    if (formData.hourlyRate !== undefined && isNaN(formData.hourlyRate)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Hourly Rate must be a valid number.',
        confirmButtonColor: '#f97316',
        timer: 5000,
        timerProgressBar: true
      });
      return;
    }

    if (localProfileData.deleteAvatar) {
      formData.avatar = '';
    } else if (teacherProfile?.avatar?.url && !avatarFile) {
      formData.avatar = teacherProfile.avatar.url;
    }

    if (localProfileData.deleteVideo) {
      formData.videoUrl = '';
    } else if (teacherProfile?.videoUrl?.url && !videoFile) {
      formData.videoUrl = teacherProfile.videoUrl.url;
    }

    try {
      console.log('Saving formData:', formData);
      let response;
      if (teacherProfile) {
        response = await updateTeacherProfile(formData);
        console.log('updateTeacherProfile response:', response);
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Profile updated successfully!',
          confirmButtonColor: '#f97316',
          timer: 3000,
          timerProgressBar: true
        });
        setHasModifiedGallery(false);
      } else {
        response = await createTeacherProfile(formData);
        console.log('createTeacherProfile response:', response);
        await Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Profile created successfully!',
          confirmButtonColor: '#f97316',
          timer: 3000,
          timerProgressBar: true
        });
        setHasModifiedGallery(false);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'An unexpected error occurred while saving your profile.',
        confirmButtonColor: '#f97316',
        timer: 5000,
        timerProgressBar: true
      });
    }
  };

  const getDisplayAvatarUrl = () => {
    if (avatarUrl) return avatarUrl;
    if (localProfileData.deleteAvatar) return "";
    if (teacherProfile?.avatar?.url) return teacherProfile.avatar.url;
    return "";
  };

  const getDisplayVideoUrl = () => {
    if (videoUrl) return videoUrl;
    if (localProfileData.deleteVideo) return "";
    if (teacherProfile?.videoUrl?.url) return teacherProfile.videoUrl.url;
    return "";
  };

  const getDisplayGalleryPhotos = useCallback(() => {
    const savedPhotos = localProfileData.galleryPhotos?.map((photo, index) => ({
      url: photo.url,
      name: `Saved Photo ${index + 1}`,
      id: photo._id || uuidv4()
    })) || [];
    const newFilesPhotos = galleryFiles.map((file, index) => ({
      url: galleryUrls[index] || URL.createObjectURL(file),
      name: file.name,
      id: galleryFileIds[index]
    }));
    const photos = [...savedPhotos, ...newFilesPhotos];
    console.log('Displayed gallery photos:', photos);
    return photos;
  }, [localProfileData.galleryPhotos, galleryFiles, galleryUrls, galleryFileIds]);

  useEffect(() => {
    return () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      galleryUrls.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="ml-3 text-lg text-gray-700">Loading profile...</p>
      </div>
    );
  }

  const isCreatingNewProfile = !teacherProfile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 p-6 bg-white rounded-md shadow-md max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold mb-2 text-orange-600">
            {isCreatingNewProfile ? "Create Your Profile" : "Edit Your Profile"}
          </h2>
          <p className="text-gray-500">
            {isCreatingNewProfile ? "Start by creating your professional profile." : "Update your profile information and teaching details."}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid w-full grid-cols-3 gap-6">
          <button
            onClick={() => setCurrentTab("basic")}
            className={`px-6 py-3 text-base font-medium rounded-md ${
              currentTab === "basic"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-500 hover:bg-orange-50"
            }`}
          >
            Basic Information
          </button>
          <button
            onClick={() => setCurrentTab("teaching")}
            className={`px-6 py-3 text-base font-medium rounded-md ${
              currentTab === "teaching"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-500 hover:bg-orange-50"
            }`}
          >
            Teaching Profile
          </button>
          <button
            onClick={() => setCurrentTab("media")}
            className={`px-6 py-3 text-base font-medium rounded-md ${
              currentTab === "media"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-500 hover:bg-orange-50"
            }`}
          >
            Media & Videos
          </button>
        </div>

        {currentTab === "basic" && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md border border-orange-200">
              <div className="p-6 border-b border-orange-200">
                <h3 className="text-2xl font-semibold text-orange-500">
                  Basic Information
                </h3>
                <p className="text-gray-500">
                  Update your profile details and contact information
                </p>
              </div>
              <div className="p-6">
                <form onSubmit={handleSaveAllProfileData} className="space-y-8">
                  <div className="flex flex-col items-center gap-6 sm:flex-row">
                    <div className="relative inline-block h-32 w-32 rounded-full overflow-hidden border-2 border-orange-300">
                      {getDisplayAvatarUrl() ? (
                        <img
                          src={getDisplayAvatarUrl()}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-orange-500 text-white text-3xl font-bold">
                          {localProfileData.name ? localProfileData.name.substring(0, 2).toUpperCase() : 'JS'}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        className="border border-orange-500 text-orange-500 px-6 py-3 rounded hover:bg-orange-50 text-base flex items-center justify-center"
                        onClick={() => avatarInputRef.current.click()}
                      >
                        <Upload className="mr-2 h-5 w-5 text-orange-500" />
                        Change Photo
                      </button>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <p className="text-sm text-gray-500">
                        Recommended: Square image, at least 300x300 pixels
                      </p>
                      {getDisplayAvatarUrl() && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="text-red-500 hover:underline text-sm mt-1"
                        >
                          Remove Current Photo
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <label
                        htmlFor="name"
                        className="block text-base font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={localProfileData.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        htmlFor="title"
                        className="block text-base font-medium text-gray-700"
                      >
                        Professional Title
                      </label>
                      <input
                        id="title"
                        name="title"
                        placeholder="e.g., Yoga Instructor"
                        value={localProfileData.title}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        htmlFor="email"
                        className="block text-base font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={localProfileData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        htmlFor="phone"
                        className="block text-base font-medium text-gray-700"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        value={localProfileData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="aboutMe"
                      className="block text-base font-medium text-gray-700"
                    >
                      About Me
                    </label>
                    <textarea
                      id="aboutMe"
                      name="aboutMe"
                      className="w-full min-h-[150px] border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                      placeholder="Tell students about yourself..."
                      value={localProfileData.aboutMe}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">
                      Write a brief introduction about yourself and your teaching philosophy.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 text-base flex items-center"
                      disabled={isSaving}
                    >
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Basic Information
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {currentTab === "teaching" && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md border border-orange-200">
              <div className="p-6 border-b border-orange-200">
                <h3 className="text-2xl font-semibold text-orange-500">
                  Teaching Profile
                </h3>
                <p className="text-gray-500">
                  Information about your skills, qualifications, and teaching services
                </p>
              </div>
              <div className="p-6">
                <form onSubmit={handleSaveAllProfileData} className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <label
                        htmlFor="experience"
                        className="block text-base font-medium text-gray-700"
                      >
                        Years of Experience
                      </label>
                      <input
                        id="experience"
                        name="experience"
                        placeholder="e.g., 5+ years"
                        value={localProfileData.experience}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        htmlFor="hourlyRate"
                        className="block text-base font-medium text-gray-700"
                      >
                        Hourly Rate (₹)
                      </label>
                      <input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        min="0"
                        value={localProfileData.hourlyRate}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-base font-medium text-gray-700">
                      Skills & Subjects You Teach
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {localProfileData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-700 border border-orange-200"
                        >
                          {skill}
                          <button
                            className="ml-2 text-gray-500 hover:text-orange-500"
                            onClick={() => handleRemoveSkill(skill)}
                            type="button"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <input
                        placeholder="Add a skill or subject"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 text-base"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-base font-medium text-gray-700">
                      Qualifications & Certifications
                    </label>
                    <div className="space-y-3 mb-3">
                      {localProfileData.qualifications.map((qualification, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border rounded-md p-3 border-gray-300"
                        >
                          <span>{qualification}</span>
                          <button
                            className="text-gray-500 hover:text-orange-500"
                            onClick={() => handleRemoveQualification(qualification)}
                            type="button"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <input
                        placeholder="Add qualification or certification"
                        value={newQualification}
                        onChange={(e) => setNewQualification(e.target.value)}
                        className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                      />
                      <button
                        type="button"
                        onClick={handleAddQualification}
                        className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 text-base"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 text-base flex items-center"
                      disabled={isSaving}
                    >
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Teaching Information
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {currentTab === "media" && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md border border-orange-200">
              <div className="p-6 border-b border-orange-200">
                <h3 className="text-2xl font-semibold text-orange-500">
                  Media & Videos
                </h3>
                <p className="text-gray-500">
                  Add videos and media to showcase your teaching style
                </p>
              </div>
              <div className="p-6 space-y-8">
                <form onSubmit={handleSaveAllProfileData} className="space-y-8">
                  <div className="space-y-3">
                    <label className="block text-base font-medium text-gray-700">
                      Introduction Video
                    </label>
                    <p className="text-sm text-gray-500 mb-3">
                      Add a short video introducing yourself and your teaching style
                    </p>
                    {getDisplayVideoUrl() ? (
                      <div className="space-y-3">
                        <div className="aspect-video">
                          <video
                            src={getDisplayVideoUrl()}
                            controls
                            className="w-full h-full rounded-md shadow-md"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Uploaded Video</span>
                          <button
                            type="button"
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                            onClick={handleRemoveVideo}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-md p-8 text-center space-y-3 border-gray-300">
                        <Video className="h-12 w-12 mx-auto text-gray-500" />
                        <div>
                          <p className="text-base font-medium text-gray-700">
                            No video uploaded
                          </p>
                          <p className="text-sm text-gray-500">
                            Upload a short video to introduce yourself to potential students
                          </p>
                        </div>
                        <button
                          type="button"
                          className="border border-orange-500 text-orange-500 px-6 py-3 rounded hover:bg-orange-50 text-base flex items-center justify-center"
                          onClick={() => videoInputRef.current.click()}
                        >
                          <Upload className="h-5 w-5 mr-2 text-orange-500" />
                          Upload Video
                        </button>
                        <input
                          type="file"
                          ref={videoInputRef}
                          onChange={handleVideoUpload}
                          accept="video/*"
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-base font-medium text-gray-700">
                      Teaching Gallery
                    </label>
                    <p className="text-sm text-gray-500">
                      Add photos that showcase your teaching environment or past classes
                    </p>
                    {getDisplayGalleryPhotos().length > 0 ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {getDisplayGalleryPhotos().map((photo, index) => (
                            <div key={photo.id} className="relative">
                              <img
                                src={photo.url}
                                alt={photo.name || `Gallery Photo ${index + 1}`}
                                className="h-32 w-full object-cover rounded-md"
                              />
                              <button
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-md"
                                onClick={() => handleRemoveGalleryPhoto(index)}
                                type="button"
                                disabled={isRemovingPhoto}
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                        {getDisplayGalleryPhotos().length < 10 && (
                          <div className="flex justify-center mt-4">
                            <button
                              type="button"
                              className="border border-orange-500 text-orange-500 px-6 py-3 rounded hover:bg-orange-50 text-base flex items-center justify-center"
                              onClick={() => photoInputRef.current.click()}
                            >
                              <Upload className="h-5 w-5 mr-2 text-orange-500" />
                              Add More Photos
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={photoInputRef}
                          onChange={handlePhotoUpload}
                          accept="image/*"
                          multiple
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-md p-8 text-center space-y-3 border-gray-300">
                        <Upload className="h-12 w-12 mx-auto text-gray-500" />
                        <div>
                          <p className="text-base font-medium text-gray-700">
                            No photos uploaded
                          </p>
                          <p className="text-sm text-gray-500">
                            Upload photos to create an engaging gallery for your profile.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="border border-orange-500 text-orange-500 px-6 py-3 rounded hover:bg-orange-50 text-base flex items-center justify-center"
                          onClick={() => photoInputRef.current.click()}
                        >
                          <Upload className="h-5 w-5 mr-2 text-orange-500" />
                          Upload Photos
                        </button>
                        <input
                          type="file"
                          ref={photoInputRef}
                          onChange={handlePhotoUpload}
                          accept="image/*"
                          multiple
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 text-base flex items-center"
                      disabled={isSaving}
                    >
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Media & Videos
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeacherProfileEdit;
