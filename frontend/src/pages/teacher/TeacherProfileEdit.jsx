import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Video, X } from "lucide-react";
import { useTheme } from "next-themes";

const TeacherProfileEdit = () => {
  const { theme, setTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState("basic");
  const [profileData, setProfileData] = useState({
    avatar: "",
    name: "",
    title: "",
    email: "",
    phone: "",
    aboutMe: "",
    skills: [],
    experience: "",
    hourlyRate: "",
    qualifications: [],
  });
  const [newSkill, setNewSkill] = useState("");
  const [newQualification, setNewQualification] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const avatarInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const photoInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileData((prev) => ({ ...prev, avatar: url }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleAddQualification = () => {
    if (
      newQualification.trim() &&
      !profileData.qualifications.includes(newQualification.trim())
    ) {
      setProfileData((prev) => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()],
      }));
      setNewQualification("");
    }
  };

  const handleRemoveQualification = (qualToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((qual) => qual !== qualToRemove),
    }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert("Profile Saved: Your profile has been updated successfully.");
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setGalleryPhotos((prev) => [...prev, ...newPhotos].slice(0, 10));
  };

  const handleSaveMedia = (e) => {
    e.preventDefault();
    alert("Media Saved: Your media files have been updated successfully.");
  };

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
            Edit Your Profile
          </h2>
          <p className="text-gray-500">
            Update your profile information and teaching details.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          
         
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
                <div onSubmit={handleSaveProfile} className="space-y-8">
                  <div className="flex flex-col items-center gap-6 sm:flex-row">
                    <div className="relative inline-block h-32 w-32 rounded-full overflow-hidden border-2 border-orange-300">
                      {profileData.avatar ? (
                        <img
                          src={profileData.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-orange-500 text-white text-3xl font-bold">
                          JS
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        className="border border-orange-500 text-orange-500 px-6 py-3 rounded hover:bg-orange-50 text-base"
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
                        value={profileData.name}
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
                        value={profileData.title}
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
                        value={profileData.email}
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
                        value={profileData.phone}
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
                      value={profileData.aboutMe}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-gray-500">
                      Write a brief introduction about yourself and your teaching philosophy.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 text-base"
                    >
                      Save Basic Information
                    </button>
                  </div>
                </div>
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
                <div onSubmit={handleSaveProfile} className="space-y-8">
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
                        value={profileData.experience}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
                      />
                    </div>
                    <div className="space-y-3">
                      <label
                        htmlFor="hourlyRate"
                        className="block text-base font-medium text-gray-700"
                      >
                        Hourly Rate ($)
                      </label>
                      <input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        min="0"
                        value={profileData.hourlyRate}
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
                      {profileData.skills.map((skill) => (
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
                      {profileData.qualifications.map((qualification, index) => (
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
                      onClick={handleSaveProfile}
                      className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 text-base"
                    >
                      Save Teaching Information
                    </button>
                  </div>
                </div>
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
                <div onSubmit={handleSaveMedia} className="space-y-8">
                  <div className="space-y-3">
                    <label className="block text-base font-medium text-gray-700">
                      Introduction Video
                    </label>
                    <p className="text-sm text-gray-500 mb-3">
                      Add a short video introducing yourself and your teaching style
                    </p>
                    {videoUrl ? (
                      <div className="space-y-3">
                        <div className="aspect-video">
                          <video
                            src={videoUrl}
                            controls
                            className="w-full h-full rounded-md shadow-md"
                          />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Uploaded Video</span>
                          <button
                            type="button"
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
                            onClick={() => setVideoUrl("")}
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
                          className="border border-orange-500 text-orange-500 px-6 py-3 rounded hover:bg-orange-50 text-base"
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
                    {galleryPhotos.length > 0 ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-4">
                          {galleryPhotos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                src={photo.url}
                                alt={photo.name}
                                className="h-32 w-full object-cover rounded-md"
                              />
                              <button
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                onClick={() =>
                                  setGalleryPhotos((prev) =>
                                    prev.filter((_, i) => i !== index)
                                  )
                                }
                                type="button"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-md p-8 text-center border-gray-300">
                        <Upload className="h-12 w-12 mx-auto text-gray-500" />
                        <p className="mt-3 text-base font-medium text-gray-700">
                          Drag photos here or click to upload
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Upload up to 10 photos (max 5MB each)
                        </p>
                        <button
                          type="button"
                          className="mt-4 border border-orange-500 text-orange-500 px-6 py-3 rounded hover:bg-orange-50 text-base"
                          onClick={() => photoInputRef.current.click()}
                        >
                          Select Photos
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
                      onClick={handleSaveMedia}
                      className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 text-base"
                    >
                      Save Media
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeacherProfileEdit;