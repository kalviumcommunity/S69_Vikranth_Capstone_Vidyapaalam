import React, { useState, useCallback, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";

const timeSlots = [
  "12:00 AM - 01:00 AM",
  "01:00 AM - 02:00 AM",
  "02:00 AM - 03:00 AM",
  "03:00 AM - 04:00 AM",
  "04:00 AM - 05:00 AM",
  "05:00 AM - 06:00 AM",
  "06:00 AM - 07:00 AM",
  "07:00 AM - 08:00 AM",
  "08:00 AM - 09:00 AM",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "01:00 PM - 02:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
  "06:00 PM - 07:00 PM",
  "07:00 PM - 08:00 PM",
  "08:00 PM - 09:00 PM",
  "09:00 PM - 10:00 PM",
  "10:00 PM - 11:00 PM",
  "11:00 PM - 12:00 AM",
  
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

const TeacherOnboarding = ({ step, onNext, onBack, onComplete, onSetStep }) => {
  const { api, user: authUser, loading: authLoading, fetchUser, updateGeneralProfile, updateTeachingSkills, updateAvailability } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    bio: "",
  });
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [date, setDate] = useState(new Date());

  const [selectedSlots, setSelectedSlots] = useState([]);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (authUser) {
      if (step === "info") {
        setFormData((prev) => ({
          ...prev,
          fullName: authUser.name || "",
          phone: authUser.phoneNumber || "",
          bio: authUser.bio || "",
        }));
      } else if (step === "expertise") {
        setTeachingSkills(authUser.teachingSkills ? [...authUser.teachingSkills] : []);
      }

    }
  }, [authUser, authLoading, step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleCustomSkillInputChange = (e) => {
    setCustomSkillInput(e.target.value);
  };

  const handleSkillToggle = useCallback((skillId) => {
    setTeachingSkills((prev) => {
      const newState = prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId];
      return newState;
    });
    setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" }));
  }, []);

  const handleRemoveSkill = useCallback((skillToRemove) => {
    setTeachingSkills((prev) => {
      const newState = prev.filter((skill) => skill !== skillToRemove);
      return newState;
    });
    setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" }));
  }, []);

  const handleAddCustomSkill = useCallback(() => {
    const trimmedSkill = customSkillInput.trim();
    if (!trimmedSkill) {
      toast.error("Custom skill cannot be empty.");
      return;
    }
    if (teachingSkills.includes(trimmedSkill.toLowerCase())) {
      toast.error("This skill has already been added.");
      return;
    }

    setTeachingSkills((prev) => {
      const newState = [...prev, trimmedSkill.toLowerCase()];
      return newState;
    });
    setCustomSkillInput("");
    setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" }));
  }, [customSkillInput, teachingSkills]);

  const handleSlotToggle = useCallback((slotKey) => {
    setSelectedSlots((prev) => {
      const newState = prev.includes(slotKey)
        ? prev.filter((s) => s !== slotKey)
        : [...prev, slotKey];
      return newState;
    });
    setErrors((prevErrors) => ({ ...prevErrors, selectedSlots: "" }));
  }, []);

  const handleWholeWeekToggle = useCallback((slot) => {
    const currentDate = new Date(date);
    const weekDates = [];

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(weekDate.toISOString().split('T')[0]);
    }

    setSelectedSlots((prev) => {
      const updatedSlotsSet = new Set(prev); 

      const allWeekSelectedForThisSlot = weekDates.every(dateStr =>
        updatedSlotsSet.has(`${dateStr}|${slot}`)
      );

      if (allWeekSelectedForThisSlot) {
        weekDates.forEach(dateStr => {
          updatedSlotsSet.delete(`${dateStr}|${slot}`);
        });
      } else {
        weekDates.forEach(dateStr => {
          updatedSlotsSet.add(`${dateStr}|${slot}`);
        });
      }

      return Array.from(updatedSlotsSet); 
    });
    setErrors((prevErrors) => ({ ...prevErrors, selectedSlots: "" }));
  }, [date]); 

  const handleDateSelect = useCallback((selectedDate) => {
    if (selectedDate instanceof Date) {
      setDate(selectedDate);
      setErrors((prevErrors) => ({ ...prevErrors, date: "" }));
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
        newErrors.phone = "Invalid phone number format. Use +CountryCode and 10-15 digits.";
        isValid = false;
      }
      if (!formData.bio.trim()) {
        newErrors.bio = "A short bio is required";
        isValid = false;
      }
    } else if (currentStep === "expertise") {
      if (teachingSkills.length === 0) {
        newErrors.teachingSkills = "Please select or add at least one skill.";
        isValid = false;
      }
    } else if (currentStep === "availability") {
      if (!date) {
        newErrors.date = "Please select a date for your availability.";
        isValid = false;
      }
      if (selectedSlots.length === 0) {
        newErrors.selectedSlots = "Please select at least one time slot.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentStep = step;

    if (!validateForm(currentStep)) {
      toast.error("Please correct the errors in the form before continuing.");
      return;
    }

    setIsLoading(true);

    try {
      if (currentStep === "info") {
        await updateGeneralProfile({
          name: formData.fullName,
          phoneNumber: formData.phone,
          bio: formData.bio,
        });
      } else if (currentStep === "expertise") {
        await updateTeachingSkills(teachingSkills);
      } else if (currentStep === "availability") {
        await updateAvailability({
          date: date.toISOString(), 
          slots: selectedSlots,
        });
      }

      toast.success("Information saved successfully!");
      onNext();

    } catch (error) {
      console.error("Onboarding step failed:", error.response?.data || error.message, error);
      toast.error(error.response?.data?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      await fetchUser();
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsLoading(true);
    try {
      await api.patch("/auth/profile", { teacherOnboardingComplete: true });
      await fetchUser(); 

      toast.success("Onboarding complete! Welcome to the teacher community.");
      onComplete();
    } catch (error) {
      console.error("Finalizing onboarding failed:", error.response?.data || error.message, error);
      toast.error(error.response?.data?.message || "Failed to finalize onboarding. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <div className="text-center p-12 text-lg text-gray-600 font-inter">Loading User Data...</div>;
  }

  if (step === "info") {
    return (
      <div className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-white font-inter">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Information</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={`block w-full p-2.5 rounded-md border shadow-sm text-base outline-none transition-all duration-200 ease-in-out
                ${errors.fullName ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>
          <div className="mb-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              className={`block w-full p-2.5 rounded-md border shadow-sm text-base outline-none transition-all duration-200 ease-in-out
                ${errors.phone ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">About You</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Share information about your background and teaching style"
              className={`block w-full p-2.5 rounded-md border shadow-sm text-base min-h-[80px] outline-none resize-y transition-all duration-200 ease-in-out
                ${errors.bio ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
            />
            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
          </div>

          <div className="flex justify-between pt-4 gap-4">
            <button type="button" onClick={onBack} disabled={isLoading || authLoading}
              className="flex-1 bg-transparent text-gray-700 py-2.5 px-5 rounded-md border border-gray-300 cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Back
            </button>
            <button type="submit" disabled={isLoading || authLoading}
              className="flex-1 bg-blue-500 text-white py-2.5 px-5 rounded-md border-none cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Saving..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === "expertise") {
    return (
      <div className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-white font-inter">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Expertise</h2>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Skills You Can Teach</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={skill.id}
                  checked={teachingSkills.includes(skill.id)}
                  onChange={() => handleSkillToggle(skill.id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <label htmlFor={skill.id} className="text-sm font-medium text-gray-700 cursor-pointer">
                  {skill.label}
                </label>
              </div>
            ))}
          </div>
          {errors.teachingSkills && (
            <p className="text-red-500 text-sm mt-1">{errors.teachingSkills}</p>
          )}

          <div className="mt-5 mb-2">
            <label htmlFor="customSkill" className="block text-sm font-medium text-gray-700 mb-1">Add Custom Skill</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="customSkill"
                value={customSkillInput}
                onChange={handleCustomSkillInputChange}
                placeholder="e.g., Chess Coaching"
                className="block w-full p-2 rounded-md border shadow-sm text-base outline-none transition-all duration-200 ease-in-out
                  border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                disabled={isLoading}
                className="bg-blue-500 text-white py-2 px-3 rounded-md border-none cursor-pointer text-sm font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>

          {teachingSkills.length > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-200">
              <h4 className="text-base font-medium text-gray-800 mb-2">Selected Skills:</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {teachingSkills.map((skill, index) => (
                  <div key={index} className="inline-flex items-center bg-blue-50 text-blue-800 py-1.5 px-3 rounded-full text-sm font-medium shadow-sm">
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      disabled={isLoading}
                      className="ml-1.5 text-blue-800 hover:text-red-600 focus:outline-none text-xl leading-none bg-transparent border-none cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-between pt-4 gap-4">
            <button type="button" onClick={onBack} disabled={isLoading || authLoading}
              className="flex-1 bg-transparent text-gray-700 py-2.5 px-5 rounded-md border border-gray-300 cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Back
            </button>
            <button type="submit" disabled={isLoading || authLoading}
              className="flex-1 bg-blue-500 text-white py-2.5 px-5 rounded-md border-none cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Saving..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === "availability") {
    const currentDate = date || new Date();
    const dateString = currentDate.toISOString().split('T')[0]; 

    return (
      <div className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-white font-inter">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Set Your Availability</h2>
        <p className="text-sm text-gray-600 mb-6">
          Select dates and time slots when you're available to teach.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">Select Date</h3>
            <div className="rounded-md border border-gray-300 overflow-hidden">
              <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
            </div>
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">Available Time Slots</h3>
            <div className="grid grid-cols-1 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = selectedSlots.includes(`${dateString}|${slot}`); // Check against the current date string
                return (
                  <div key={slot} className="flex items-center gap-2">
                    <div
                      onClick={() => handleSlotToggle(`${dateString}|${slot}`)} // Toggle for current date's slot
                      className={`flex-1 p-2 border rounded-md transition-colors duration-200 ease-in-out cursor-pointer
                        ${isSelected ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50 border-gray-300"}
                        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{slot}</span>
                        {isSelected && (
                          <CheckIcon className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleWholeWeekToggle(slot)} // Toggle for this slot across the week
                      className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                    >
                      Whole Week
                    </button>
                  </div>
                );
              })}
            </div>
            {errors.selectedSlots && <p className="text-red-500 text-sm mt-1">{errors.selectedSlots}</p>}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <div className="flex justify-between pt-4 gap-4">
            <button type="button" onClick={onBack} disabled={isLoading || authLoading}
              className="flex-1 bg-transparent text-gray-700 py-2.5 px-5 rounded-md border border-gray-300 cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Back
            </button>
            <button type="submit" disabled={isLoading || authLoading}
              className="flex-1 bg-blue-500 text-white py-2.5 px-5 rounded-md border-none cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Saving..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === "complete") {
    return (
      <div className="max-w-md mx-auto text-center p-6 space-y-8 font-inter">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center shadow-lg">
            <CheckIcon className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">You're All Set!</h2>
          <p className="text-sm text-gray-600">
            Your teacher profile has been created. Start sharing your knowledge with eager students!
          </p>
        </div>
        <button
          onClick={handleCompleteOnboarding}
          disabled={isLoading || authLoading}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-md border-none cursor-pointer text-lg font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : "Go to Dashboard"}
        </button>
      </div>
    );
  }

  return null;
};

export default TeacherOnboarding;