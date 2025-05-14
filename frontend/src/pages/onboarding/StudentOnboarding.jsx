

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
    setSelectedSkills((prev) => {
      if (prev.includes(skillId)) {
        return prev.filter((id) => id !== skillId);
      } else {
        return [...prev, skillId];
      }
    });
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
        <h2 className="text-3xl font-semibold text-gray-900">Basic Information</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-800">Full Name</label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={`mt-2 border rounded-md py-2 px-3 w-full ${
                errors.fullName ? "border-red-500" : ""
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800">Phone Number</label>
            <Input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              className={`mt-2 border rounded-md py-2 px-3 w-full ${
                errors.phone ? "border-red-500" : ""
              }`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800">
              About You (Optional)
            </label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us a bit about yourself and what you hope to learn"
              className="min-h-[120px] border rounded-md py-2 px-3 w-full"
            />
          </div>
          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </div>
    );
  }

  if (step === "interests") {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-semibold text-gray-900">Skills I Want to Learn</h2>
        <p className="text-lg text-gray-600">
          Select the skills you're interested in learning.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-center space-x-3">
              <Checkbox
                id={skill.id}
                checked={selectedSkills.includes(skill.id)}
                onCheckedChange={() => handleSkillToggle(skill.id)}
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
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={selectedSkills.length === 0}>
            Continue
          </Button>
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
          <h2 className="text-3xl font-semibold text-gray-900">You're All Set!</h2>
          <p className="text-lg text-gray-600 mt-3">
            Your student profile has been created. Let's start exploring skills and finding teachers.
          </p>
        </div>
        <Button onClick={onComplete} size="lg">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return null;
};

export default StudentOnboarding;