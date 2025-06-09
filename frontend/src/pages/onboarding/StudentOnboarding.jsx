import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { motion } from "framer-motion";

const skills = [
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

const StudentOnboarding = ({ step, onNext, onBack, onComplete }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    bio: "",
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSkillToggle = (skillId) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\+?\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  if (step === "info") {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">Basic Information</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-800">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800">
              About You (Optional)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us a bit about yourself and what you hope to learn"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
            />
          </div>
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === "interests") {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-900">Skills I Want to Learn</h2>
        <p className="text-lg text-gray-600">
          Select the skills you're interested in learning.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={skill.id}
                checked={selectedSkills.includes(skill.id)}
                onChange={() => handleSkillToggle(skill.id)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={skill.id}
                className="text-lg font-medium text-gray-800 cursor-pointer"
              >
                {skill.label}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={selectedSkills.length === 0}
            className={`px-6 py-2 rounded-lg text-white ${
              selectedSkills.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === "complete") {
    return (
      <div className="space-y-8 text-center">
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center"
          >
            <CheckIcon className="h-12 w-12 text-green-600" />
          </motion.div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">You're All Set!</h2>
          <p className="text-lg text-gray-600 mt-3">
            Your student profile has been created. Let's start exploring skills and finding
            teachers.
          </p>
        </div>
        <button
          onClick={onComplete}
          className="mt-4 px-8 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 text-lg"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return null;
};

export default StudentOnboarding;
