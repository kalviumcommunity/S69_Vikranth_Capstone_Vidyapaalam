import React, { useState, useEffect } from "react";
import { CheckIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const SKILLS = [
  { id: "painting", label: "Painting" },
  { id: "music", label: "Music" },
  { id: "cooking", label: "Cooking" },
  { id: "programming", label: "Programming" },
  { id: "yoga", label: "Yoga" },
  { id: "dancing", label: "Dancing" },
  { id: "photography", label: "Photography" },
  { id: "writing", label: "Creative Writing" },
  { id: "languages", label: "Languages" },
  { id: "crafts", label: "Arts & Crafts" },
  { id: "gardening", label: "Gardening" },
  { id: "fitness", label: "Fitness & Exercise" },
];

export default function StudentOnboarding({ step, onNext, onBack, onComplete }) {
  const { user, fetchUser, updateGeneralProfile, updateInterestedSkills } = useAuth();
  const [formData, setFormData] = useState({ fullName: "", phone: "", bio: "" });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (step === "info" && user) {
      setFormData({
        fullName: user.name || "",
        phone: user.phoneNumber || "",
        bio: user.bio || "",
      });
      setErrors({});
    }
  }, [step, user]);

  useEffect(() => {
    if (step === "interests" && user?.interestedSkills) {
      setSelectedSkills(user.interestedSkills);
      setErrors({});
    }
  }, [step, user]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    setErrors(err => ({ ...err, [name]: "" }));
  };

  const toggleSkill = id =>
    setSelectedSkills(s => (s.includes(id) ? s.filter(x => x !== id) : [...s, id]));

  const validateInfo = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    else if (formData.fullName.trim().length < 2)
      errs.fullName = "At least 2 characters";
    if (!/^\+?\d{10,15}$/.test(formData.phone))
      errs.phone = "Enter a valid phone number";
    setErrors(errs);
    return !Object.keys(errs).length;
  };

  const submitInfo = async e => {
    e.preventDefault();
    if (!validateInfo()) return;
    setSaving(true);
    try {
      await updateGeneralProfile({
        name: formData.fullName,
        phoneNumber: formData.phone,
        bio: formData.bio,
      });
      await fetchUser();
      onNext();
      toast.success("Basic information saved!");
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err);
      setErrors({ info: err.response?.data?.message || "Save failed" });
      toast.error(err.response?.data?.message || "Failed to save basic information.");
    } finally {
      setSaving(false);
    }
  };

  const saveInterests = async () => {
    setSaving(true);
    try {
      await updateInterestedSkills(selectedSkills);
      await fetchUser();
      onNext();
      toast.success("Interests saved successfully!");
    } catch (err) {
      console.error("Error updating interests:", err.response?.data || err);
      setErrors({ interests: err.response?.data?.message || "Save failed" });
      toast.error(err.response?.data?.message || "Failed to save interests.");
    } finally {
      setSaving(false);
    }
  };

  if (step === "info") {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold">Basic Information</h2>
        {errors.info && <p className="text-red-500">{errors.info}</p>}
        <form onSubmit={submitInfo} className="space-y-6">
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={saving}
              className={`mt-1 w-full p-2 border ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
            {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block font-medium">Phone Number</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={saving}
              className={`mt-1 w-full p-2 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
            {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          </div>
          <div>
            <label className="block font-medium">About You (Optional)</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={saving}
              className="mt-1 w-full p-2 border border-gray-300 rounded min-h-[80px]"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              disabled={saving}
              className="px-4 py-2 border rounded"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 text-white rounded ${
                saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "Saving…" : "Continue"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === "interests") {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold">Skills I Want to Learn</h2>
        {errors.interests && <p className="text-red-500">{errors.interests}</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SKILLS.map(skill => (
            <label
              key={skill.id}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedSkills.includes(skill.id)}
                onChange={() => toggleSkill(skill.id)}
                disabled={saving}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded"
              />
              <span>{skill.label}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-between">
          <button
            onClick={onBack}
            disabled={saving}
            className="px-4 py-2 border rounded"
          >
            Back
          </button>
          <button
            onClick={saveInterests}
            disabled={!selectedSkills.length || saving}
            className={`px-4 py-2 text-white rounded ${
              !selectedSkills.length || saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {saving ? "Saving…" : "Continue"}
          </button>
        </div>
      </div>
    );
  }

  if (step === "complete") {
    return (
      <div className="space-y-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center"
        >
          <CheckIcon className="h-12 w-12 text-green-600" />
        </motion.div>
        <h2 className="text-3xl font-bold">You're All Set!</h2>
        <p>Your student profile is ready—let’s start exploring skills and finding teachers.</p>
        <button
          onClick={onComplete}
          className="px-6 py-3 bg-blue-600 text-white rounded"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return null;
}