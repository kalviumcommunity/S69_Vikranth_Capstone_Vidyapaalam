import React, { useState, useCallback, useEffect } from "react";
import { format, addHours, startOfDay, getDay } from 'date-fns';
import { CheckIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast"; // Using react-hot-toast for simplicity
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import { DayPicker } from 'react-day-picker';

// Import your actual AuthContext
import { useAuth } from "../../contexts/AuthContext";

// --- Utility Functions (from shadcn/ui lib/utils.js) ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Button Component (from shadcn/ui components/ui/button.jsx) ---
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white hover:bg-blue-600",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-gray-300 bg-white hover:bg-gray-100",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-blue-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? 'div' : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// --- Calendar Component (from shadcn/ui components/ui/calendar.jsx) ---
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-blue-500 text-white hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white",
        day_today: "bg-gray-100 text-gray-900",
        day_outside:
          "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-100/50 aria-selected:text-gray-500 aria-selected:opacity-30",
        day_disabled: "text-gray-500 opacity-50",
        day_range_middle:
          "aria-selected:bg-gray-100 aria-selected:text-gray-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";


// --- Time Slot Generation ---
const generateTimeSlots = () => {
  const slots = [];
  const startHour = 6; // 6 AM
  const endHour = 22; // 10 PM (slots will go up to 10 PM - 11 PM)
  for (let hour = startHour; hour < endHour; hour++) {
    const startPeriod = hour < 12 ? "AM" : "PM";
    const endPeriod = (hour + 1) < 12 ? "AM" : "PM";

    const displayStartHour = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
    const displayEndHour = (hour + 1) === 0 ? 12 : ((hour + 1) > 12 ? (hour + 1) - 12 : (hour + 1));

    const slot = `${displayStartHour.toString().padStart(2, '0')}:00 ${startPeriod} - ${displayEndHour.toString().padStart(2, '0')}:00 ${endPeriod}`;
    slots.push(slot);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

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


// --- TeacherOnboarding Component ---
const TeacherOnboarding = ({ step, onNext, onBack, onComplete, onSetStep }) => {
  // Use the real useAuth hook from your AuthContext
  const { api, user: authUser, loading: authLoading, fetchUser, updateGeneralProfile, updateTeachingSkills, updateAvailability } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    bio: "",
  });
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [date, setDate] = useState(new Date()); // Currently selected date in calendar
  // selectedSlots stores strings like "YYYY-MM-DD|HH:MM AM - HH:MM PM"
  const [selectedSlots, setSelectedSlots] = useState([]);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data and skills from authUser when component mounts or authUser changes
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (authUser && step === "info") {
      setFormData((prev) => ({
        ...prev,
        fullName: authUser.name || "",
        phone: authUser.phoneNumber || "",
        bio: authUser.bio || "",
      }));
    }

    if (authUser && step === "expertise") {
      setTeachingSkills(authUser.teachingSkills || []);
    }

    // Initialize selectedSlots for availability step
    if (authUser && step === "availability") {
      const initialSelected = [];
      authUser.availability?.forEach(day => {
        day.slots.forEach(slot => {
          initialSelected.push(`${day.date}|${slot}`);
        });
      });
      setSelectedSlots(initialSelected);
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
    // Check if the skill already exists (case-insensitive)
    if (teachingSkills.some(skill => skill.toLowerCase() === trimmedSkill.toLowerCase())) {
      toast.error("This skill has already been added.");
      return;
    }

    setTeachingSkills((prev) => {
      const newState = [...prev, trimmedSkill]; // Store as entered, or normalize to lowercase if preferred
      return newState;
    });
    setCustomSkillInput("");
    setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" }));
  }, [customSkillInput, teachingSkills]);


  // Handler for toggling a single time slot for the currently selected date
  const handleSlotToggle = useCallback((slotStringWithDate) => {
    setSelectedSlots(prev => {
      if (prev.includes(slotStringWithDate)) {
        return prev.filter(s => s !== slotStringWithDate);
      } else {
        return [...prev, slotStringWithDate].sort();
      }
    });
    setErrors(prev => ({ ...prev, selectedSlots: "" }));
  }, []);

  // Handler for toggling a slot for the whole week
  const handleWholeWeekToggle = useCallback((slot) => {
    const currentDate = new Date(date);
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - getDay(currentDate)); // Set to Sunday of the current week

    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return format(d, 'yyyy-MM-dd'); // Format to 'YYYY-MM-DD'
    });

    const slotsToToggle = weekDates.map(d => `${d}|${slot}`);

    setSelectedSlots(prev => {
      const updated = new Set(prev);
      const allSelectedInWeek = slotsToToggle.every(s => prev.includes(s));

      slotsToToggle.forEach(s => {
        if (allSelectedInWeek) {
          updated.delete(s); // Deselect if all were selected
        } else {
          updated.add(s); // Select if not all were selected
        }
      });
      return Array.from(updated).sort();
    });
    setErrors(prev => ({ ...prev, selectedSlots: "" }));
  }, [date]);


  // Handler for date selection in the calendar
  const handleDateSelect = useCallback((selectedDate) => {
    if (selectedDate instanceof Date) {
      setDate(selectedDate);
      setErrors(prev => ({ ...prev, date: "" }));
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
        // For availability, we check if any slots are selected across all days
        // The `selectedSlots` state already holds all selected slots regardless of the current date
        if (selectedSlots.length === 0) {
            newErrors.selectedSlots = "Please select at least one time slot for any day.";
            isValid = false;
        }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Generic handleSubmit for all steps, dispatches to specific handlers
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
        const response = await updateGeneralProfile({
          name: formData.fullName,
          phoneNumber: formData.phone,
          bio: formData.bio,
        });
        if (!response.success) throw new Error(response.error);
      } else if (currentStep === "expertise") {
        const response = await updateTeachingSkills(teachingSkills);
        if (!response.success) throw new Error(response.error);
      } else if (currentStep === "availability") {
        // Transform selectedSlots into the backend's expected availability format
        // Group slots by date: { "YYYY-MM-DD": ["HH:MM-HH:MM", ...], ... }
        const groupedAvailability = new Map();

        selectedSlots.forEach(item => {
          const [dateStr, slotStr] = item.split('|');
          if (!groupedAvailability.has(dateStr)) {
            groupedAvailability.set(dateStr, new Set());
          }
          groupedAvailability.get(dateStr).add(slotStr);
        });

        // Send updates for each date individually
        const updatePromises = [];
        // Iterate through the grouped availability, sending only dates with selected slots
        groupedAvailability.forEach((slotsSet, dateStr) => {
            // Only push if there are slots for this date
            if (slotsSet.size > 0) {
                updatePromises.push(updateAvailability(dateStr, Array.from(slotsSet).sort()));
            }
        });

        // Also, for any dates that previously had availability but now have none
        // due to user deselecting all slots, we need to send an empty array for that date.
        // This requires comparing current selectedSlots with authUser.availability
        const existingDatesWithSlots = new Set(authUser.availability?.map(a => a.date));
        const datesWithCurrentSelections = new Set(Array.from(groupedAvailability.keys()));

        existingDatesWithSlots.forEach(existingDateStr => {
            if (!datesWithCurrentSelections.has(existingDateStr)) {
                // If an existing date no longer has any selected slots, send an empty array
                updatePromises.push(updateAvailability(existingDateStr, []));
            }
        });


        // Await all update promises
        const results = await Promise.all(updatePromises);

        // Check if all updates were successful
        const allSuccessful = results.every(result => result.success);
        if (!allSuccessful) {
            // Find the first error and throw it
            const firstError = results.find(result => !result.success)?.error || "Some availability updates failed.";
            throw new Error(firstError);
        }
      }

      toast.success("Information saved successfully!");
      onNext(); // Proceed to the next onboarding step

    } catch (error) {
      console.error("Onboarding step failed:", error.message, error);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      await fetchUser(); // Re-fetch user to ensure latest state is reflected
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsLoading(true);
    try {
      const response = await api.patch("/auth/profile", { teacherOnboardingComplete: true });
      if (!response.success) throw new Error(response.error);

      await fetchUser(); // Ensure user state is updated after completion

      toast.success("Onboarding complete! Welcome to the teacher community.");
      onComplete();
    } catch (error) {
      console.error("Finalizing onboarding failed:", error.message, error);
      toast.error(error.message || "Failed to finalize onboarding. Please try again.");
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
    const currentDateString = format(date, 'yyyy-MM-dd'); // GetYYYY-MM-DD for current selected date

    return (
      <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-white font-inter">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Set Your Availability</h2>
        <p className="text-sm text-gray-600 mb-4">
          Select dates and time slots when you're available to teach.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">Select Date</h3>
            <div className="rounded-md border border-gray-300 overflow-hidden">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(day) => day < startOfDay(new Date())} // Disable past dates
              />
            </div>
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">Available Time Slots for {format(date, 'PPP')}</h3>
            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {timeSlots.map((slot) => {
                const slotKey = `${currentDateString}|${slot}`;
                const isSelected = selectedSlots.includes(slotKey);
                return (
                  <div key={slot} className="flex items-center gap-2">
                    <div
                      onClick={() => handleSlotToggle(slotKey)}
                      className={`flex-1 p-3 border rounded-md transition-colors duration-200 ease-in-out cursor-pointer
                        ${isSelected ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50 border-gray-300"}
                        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{slot}</span>
                        {isSelected && <CheckIcon className="h-4 w-4 text-blue-600" />}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleWholeWeekToggle(slot)}
                      className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading || authLoading}
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
        <div className="flex justify-between pt-6 gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isLoading || authLoading}
            className="flex-1 bg-transparent text-gray-700 py-2.5 px-5 rounded-md border border-gray-300 cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || authLoading || selectedSlots.length === 0}
            className="flex-1 bg-blue-500 text-white py-2.5 px-5 rounded-md border-none cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Continue"}
          </button>
        </div>
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
