

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { CheckIcon } from "lucide-react";

const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM",
];

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

const TeacherOnboarding = ({ step, onNext, onBack, onComplete }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    bio: "",
    hourlyRate: "",
    experience: "",
    qualifications: "",
  });
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [date, setDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSkillToggle = useCallback((skillId) => {
    setTeachingSkills((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  }, []);

  const handleSlotToggle = useCallback((slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  }, []);

  const handleDateSelect = useCallback((selectedDate) => {
    if (selectedDate instanceof Date) {
      setDate(selectedDate);
    }
  }, []);

  const validateForm = (currentStep) => {
    let isValid = true;
    const newErrors = {};

    if (currentStep === "info") {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full Name is required";
        isValid = false;
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone Number is required";
        isValid = false;
      } else if (!/^\+?\d{10,15}$/.test(formData.phone)) {
        newErrors.phone = "Invalid phone number";
        isValid = false;
      }
    } else if (currentStep === "expertise") {
      if (teachingSkills.length === 0) {
        newErrors.teachingSkills = "Please select at least one skill";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentStep = step;
    if (validateForm(currentStep)) {
      if (currentStep === "info") {
        onNext(formData);
      } else if (currentStep === "expertise") {
        onNext({ experience: formData.experience, qualifications: formData.qualifications, teachingSkills });
      }
    }
  };

  if (step === "info") {
    return (
      <div className="space-y-6 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900">Basic Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.fullName ? "border-red-500" : ""
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <Input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                errors.phone ? "border-red-500" : ""
              }`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">About You</label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Share information about your background and teaching style"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
            <Input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleInputChange}
              placeholder="25"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" variant="primary">Continue</Button>
          </div>
        </form>
      </div>
    );
  }

  if (step === "expertise") {
    return (
      <div className="space-y-6 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900">Your Expertise</h2>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Skills You Can Teach</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={skill.id}
                  checked={teachingSkills.includes(skill.id)}
                  onChange={() => handleSkillToggle(skill.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={skill.id} className="text-sm font-medium text-gray-700">
                  {skill.label}
                </label>
              </div>
            ))}
          </div>
          {errors.teachingSkills && (
            <p className="text-red-500 text-sm mt-1">{errors.teachingSkills}</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <Input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder="e.g., 5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Qualifications</label>
            <Textarea
              name="qualifications"
              value={formData.qualifications}
              onChange={handleInputChange}
              placeholder="List your relevant qualifications, certifications, or achievements"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" disabled={teachingSkills.length === 0} variant="primary">
              Continue
            </Button>
          </div>
        </form>
      </div>
    );
  }

  if (step === "availability") {
    return (
      <div className="space-y-6 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900">Set Your Availability</h2>
        <p className="text-sm text-gray-600">
          Select dates and time slots when you're available to teach.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">Select Dates</h3>
            <div className="rounded-md border">
              <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
            </div>
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">Available Time Slots</h3>
            <div className="grid grid-cols-1 gap-2">
              {timeSlots.map((slot) => (
                <div
                  key={slot}
                  className={`p-2 border rounded-md cursor-pointer transition-colors ${
                    selectedSlots.includes(slot) ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleSlotToggle(slot)}
                >
                  <div className="flex items-center justify-between">
                    <span>{slot}</span>
                    {selectedSlots.includes(slot) && (
                      <CheckIcon className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="button" onClick={() => onNext({ date, selectedSlots })} variant="primary">
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (step === "complete") {
    return (
      <div className="space-y-8 text-center max-w-md mx-auto">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckIcon className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">You're All Set!</h2>
          <p className="text-sm text-gray-600 mt-2">
            Your teacher profile has been created. Start sharing your knowledge with eager students!
          </p>
        </div>
        <Button size="lg" onClick={onComplete} variant="primary">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return null;
};

export default TeacherOnboarding;



