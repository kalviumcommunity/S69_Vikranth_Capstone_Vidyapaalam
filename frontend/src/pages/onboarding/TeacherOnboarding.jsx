

// import React, { useState, useCallback, useEffect } from "react";
// import { Calendar } from "@/components/ui/calendar";
// import { CheckIcon } from "lucide-react";
// import { toast } from "sonner";
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from "../../contexts/AuthContext";

// const timeSlots = [
//   "09:00 AM - 10:00 AM",
//   "10:00 AM - 11:00 AM",
//   "11:00 AM - 12:00 PM",
//   "01:00 PM - 02:00 PM",
//   "02:00 PM - 03:00 PM",
//   "03:00 PM - 04:00 PM",
//   "04:00 PM - 05:00 PM",
//   "05:00 PM - 06:00 PM",
//   "06:00 PM - 07:00 PM",
// ];

// const skills = [
//   { id: "painting", label: "Painting" },
//   { id: "music", label: "Music" },
//   { id: "cooking", label: "Cooking" },
//   { id: "programming", label: "Programming" },
//   { id: "yoga", label: "Yoga" },
//   { id: "dancing", label: "Dancing" },
//   { id: "photography", label: "Photography" },
//   { id: "writing", label: "Creative Writing" },
//   { id: "languages", label: "Languages" },
//   { id: "crafts", label: "Arts & Crafts" },
//   { id: "gardening", label: "Gardening" },
//   { id: "fitness", label: "Fitness & Exercise" },
// ];

// const TeacherOnboarding = ({ step, onNext, onBack, onComplete, onSetStep }) => {
//   const { api, user: authUser, loading: authLoading, fetchUser } = useAuth(); 

//   const [formData, setFormData] = useState({
//     fullName: "",
//     phone: "",
//     bio: "",
//   });
//   const [teachingSkills, setTeachingSkills] = useState([]);
//   const [customSkillInput, setCustomSkillInput] = useState("");
//   const [date, setDate] = useState(new Date());
//   const [selectedSlots, setSelectedSlots] = useState([]);
//   const [busyTimes, setBusyTimes] = useState([]);

//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   // REMOVED: Local isCalendarConnected state. We will rely directly on authUser.googleCalendar.connected

//   const location = useLocation();
//   const navigate = useNavigate();

//   // Primary useEffect for initial form data and handling Google Calendar redirect
//   useEffect(() => {
//     // If authUser data is still loading, wait.
//     if (authLoading) {
//       return;
//     }

//     // Pre-fill form data if on 'info' step and authUser is available
//     if (authUser && step === "info") { // Removed !authLoading as it's checked at the start
//       setFormData((prev) => ({
//         ...prev,
//         fullName: authUser.name || "",
//         phone: authUser.phoneNumber || "",
//         bio: authUser.bio || "",
//       }));
//       setTeachingSkills(authUser.teachingSkills || []);
//     }

//     const params = new URLSearchParams(location.search);
//     const calendarAuthStatus = params.get('calendarAuthStatus');
//     const calendarAuthError = params.get('error');
//     const nextStepParam = params.get('nextStep');

//     // Handle Google Calendar OAuth callback parameters
//     if (calendarAuthStatus) {
//       if (calendarAuthStatus === 'success') {
//         toast.success("Google Calendar connected successfully!");

//         // IMPORTANT LOGIC CORRECTION:
//         // Instead of setting local state, we rely on fetchUser to update authUser
//         // and then potentially re-render based on that.
//         // We add a retry logic here in case the backend's update
//         // for googleCalendar.connected isn't instantaneous or AuthContext refreshes too slowly.
//         const checkAndRefetchProfile = async (retries = 3) => {
//           if (!authUser?.googleCalendar?.connected && retries > 0) {
//             try {
//               console.log(`Attempting to refetch profile, retries left: ${retries}`);
//               await fetchUser(); // Force a re-fetch of the AuthContext user data
//               // After fetchUser, authUser will update, triggering a re-render
//               // and the main useEffect in OnboardingPage will pick up the new authUser.role
//               // and authUser.googleCalendar.connected status.
//             } catch (err) {
//               console.error("Error during refetch in TeacherOnboarding:", err);
//             }
//             // If still not connected, wait a bit and retry
//             if (!authUser?.googleCalendar?.connected && retries > 1) { // Only retry if still not connected
//                 setTimeout(() => checkAndRefetchProfile(retries - 1), 1000); // Wait 1 second
//             }
//           }
//         };

//         // Trigger the re-fetch logic immediately
//         checkAndRefetchProfile();
        
//         // This onSetStep informs the parent (OnboardingPage) to explicitly move to 'availability'
//         // which helps align the parent's `step` state even if `authUser` update is delayed.
//         if (nextStepParam === 'availability' && typeof onSetStep === 'function') {
//           onSetStep('availability');
//         }

//       } else {
//         toast.error(`Failed to connect Google Calendar: ${decodeURIComponent(calendarAuthError || 'Unknown error.')}`);
//         // If connection failed, ensure we refetch in case authUser was partially updated or cleared
//         fetchUser(); 
//       }

//       // Clean up URL parameters to prevent re-triggering this logic on subsequent renders/refreshes
//       const newSearchParams = new URLSearchParams(location.search);
//       newSearchParams.delete('calendarAuthStatus');
//       newSearchParams.delete('error');
//       newSearchParams.delete('nextStep');
//       navigate({ search: newSearchParams.toString() }, { replace: true });
//     } 
//   }, [authUser, authLoading, step, api, location.search, navigate, onSetStep, fetchUser]);

//   // Effect to fetch busy times when on 'availability' step and calendar is connected
//   useEffect(() => {
//     // Rely directly on authUser?.googleCalendar?.connected for conditional fetching
//     if (!date || !authUser?.googleCalendar?.connected || !api) { 
//       setBusyTimes([]);
//       return;
//     }

//     setIsLoading(true);
//     // Moved try/catch outside to directly await the promise
//     const fetchEvents = async () => {
//       try {
//         const formattedDate = date.toISOString().split('T')[0];
//         const response = await api.get(`/api/calendar/busy-times?date=${formattedDate}`);
//         setBusyTimes(response.data.busyTimes || []);
//       } catch (error) {
//         console.error("Failed to fetch busy times:", error.response?.data || error.message);
//         toast.error(error.response?.data?.message || "Failed to fetch busy times from Google Calendar.");
//         setBusyTimes([]);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchEvents(); // Call the async function
//   }, [date, authUser?.googleCalendar?.connected, api, step]); // Depend on authUser.googleCalendar.connected directly

//   const isSlotBusy = useCallback((slot) => {
//     if (!busyTimes || busyTimes.length === 0) return false;

//     const [startTimeStr, endTimeStr] = slot.split(' - ');
//     const selectedDateISO = date.toISOString().split('T')[0];

//     const parseTime = (timeStr) => {
//       const [time, period] = timeStr.split(' ');
//       let [hours, minutes] = time.split(':').map(Number);
//       if (period === 'PM' && hours !== 12) hours += 12;
//       if (period === 'AM' && hours === 12) hours = 0;

//       const d = new Date(selectedDateISO);
//       d.setHours(hours, minutes, 0, 0);
//       return d;
//     };

//     const slotStart = parseTime(startTimeStr);
//     const slotEnd = parseTime(endTimeStr);

//     for (const busyEvent of busyTimes) {
//       const busyStart = new Date(busyEvent.start);
//       const busyEnd = new Date(busyEvent.end);

//       if (slotStart < busyEnd && slotEnd > busyStart) {
//         return true;
//       }
//     }
//     return false;
//   }, [busyTimes, date]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//   };

//   const handleCustomSkillInputChange = (e) => {
//     setCustomSkillInput(e.target.value);
//   };

//   const handleSkillToggle = useCallback((skillId) => {
//     setTeachingSkills((prev) => {
//       const newState = prev.includes(skillId)
//         ? prev.filter((id) => id !== skillId)
//         : [...prev, skillId];
//       return newState;
//     });
//     setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" }));
//   }, []);

//   const handleRemoveSkill = useCallback((skillToRemove) => {
//     setTeachingSkills((prev) => {
//       const newState = prev.filter((skill) => skill !== skillToRemove);
//       return newState;
//     });
//     setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" }));
//   }, []);

//   const handleAddCustomSkill = useCallback(() => {
//     const trimmedSkill = customSkillInput.trim();
//     if (!trimmedSkill) {
//       toast.error("Custom skill cannot be empty.");
//       return;
//     }
//     if (teachingSkills.includes(trimmedSkill.toLowerCase())) {
//       toast.error("This skill has already been added.");
//       return;
//     }

//     setTeachingSkills((prev) => {
//       const newState = [...prev, trimmedSkill.toLowerCase()];
//       return newState;
//     });
//     setCustomSkillInput("");
//     setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" }));
//   }, [customSkillInput, teachingSkills]);

//   const handleSlotToggle = useCallback((slot) => {
//     setSelectedSlots((prev) => {
//       const newState = prev.includes(slot)
//         ? prev.filter((s) => s !== slot)
//         : [...prev, slot];
//       return newState;
//     });
//     setErrors((prevErrors) => ({ ...prevErrors, selectedSlots: "" }));
//   }, []);

//   const handleDateSelect = useCallback((selectedDate) => {
//     if (selectedDate instanceof Date) {
//       setDate(selectedDate);
//       setErrors((prevErrors) => ({ ...prevErrors, date: "" }));
//     }
//   }, []);

//   const handleConnectGoogleCalendar = async () => {
//     setIsLoading(true);
//     try {
//       const response = await api.get("/auth/calendar/auth-url");
//       const { authUrl } = response.data;
//       window.location.href = authUrl; 
//     } catch (error) {
//       console.error("Error connecting Google Calendar:", error.response?.data || error.message);
//       toast.error(error.response?.data?.message || "Failed to initiate Google Calendar connection.");
//       setIsLoading(false); 
//     }
//   };

//   const validateForm = (currentStep) => {
//     let isValid = true;
//     const newErrors = {};

//     if (currentStep === "info") {
//       if (!formData.fullName.trim()) {
//         newErrors.fullName = "Full Name is required";
//         isValid = false;
//       }
//       if (!formData.phone.trim()) {
//         newErrors.phone = "Phone Number is required";
//         isValid = false;
//       } else if (!/^\+?\d{10,15}$/.test(formData.phone)) {
//         newErrors.phone = "Invalid phone number format. Use +CountryCode and 10-15 digits.";
//         isValid = false;
//       }
//       if (!formData.bio.trim()) {
//         newErrors.bio = "A short bio is required";
//         isValid = false;
//       }
//     } else if (currentStep === "expertise") {
//       if (teachingSkills.length === 0) {
//         newErrors.teachingSkills = "Please select or add at least one skill.";
//         isValid = false;
//       }
//     } else if (currentStep === "availability") {
//       // Use authUser?.googleCalendar?.connected directly for validation
//       if (!authUser?.googleCalendar?.connected) { 
//         newErrors.googleCalendar = "Please connect your Google Calendar to proceed.";
//         isValid = false;
//       } else {
//         if (!date) {
//           newErrors.date = "Please select a date for your availability.";
//           isValid = false;
//         }
//         if (selectedSlots.length === 0) {
//           newErrors.selectedSlots = "Please select at least one time slot.";
//           isValid = false;
//         }
//       }
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const currentStep = step;

//     if (!validateForm(currentStep)) {
//       toast.error("Please correct the errors in the form before continuing.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       let dataToSend = {};
//       let endpoint = "";

//       if (currentStep === "info") {
//         dataToSend = {
//           name: formData.fullName,
//           phoneNumber: formData.phone,
//           bio: formData.bio,
//         };
//         endpoint = "/auth/profile";
//       } else if (currentStep === "expertise") {
//         dataToSend = {
//           teachingSkills: teachingSkills,
//         };
//         endpoint = "/auth/profile/teaching-skills";
//       } else if (currentStep === "availability") {
//         dataToSend = {
//           date: date.toISOString(),
//           slots: selectedSlots,
//         };
//         endpoint = "/auth/profile/availability";
//       }

//       await api.patch(endpoint, dataToSend);

//       toast.success("Information saved successfully!");
//       onNext();

//     } catch (error) {
//       console.error("Onboarding step failed:", error.response?.data || error.message, error);
//       toast.error(error.response?.data?.message || "An unexpected error occurred. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCompleteOnboarding = async () => {
//     setIsLoading(true);
//     try {
//       await api.patch("/auth/profile", { teacherOnboardingComplete: true });

//       toast.success("Onboarding complete! Welcome to the teacher community.");
//       onComplete();
//     } catch (error) {
//       console.error("Finalizing onboarding failed:", error.response?.data || error.message, error);
//       toast.error(error.response?.data?.message || "Failed to finalize onboarding. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (authLoading) {
//     return <div className="text-center p-12 text-lg text-gray-600 font-inter">Loading User Data...</div>;
//   }

//   if (step === "info") {
//     return (
//       <div className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-white font-inter">
//         <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Information</h2>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <div className="mb-2">
//             <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//             <input
//               type="text"
//               id="fullName"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleInputChange}
//               placeholder="John Doe"
//               className={`block w-full p-2.5 rounded-md border shadow-sm text-base outline-none transition-all duration-200 ease-in-out
//                 ${errors.fullName ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
//             />
//             {errors.fullName && (
//               <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
//             )}
//           </div>
//           <div className="mb-2">
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//             <input
//               type="text"
//               id="phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleInputChange}
//               placeholder="+1 (555) 123-4567"
//               className={`block w-full p-2.5 rounded-md border shadow-sm text-base outline-none transition-all duration-200 ease-in-out
//                 ${errors.phone ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
//             />
//             {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
//           </div>
//           <div className="mb-2">
//             <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">About You</label>
//             <textarea
//               id="bio"
//               name="bio"
//               value={formData.bio}
//               onChange={handleInputChange}
//               placeholder="Share information about your background and teaching style"
//               className={`block w-full p-2.5 rounded-md border shadow-sm text-base min-h-[80px] outline-none resize-y transition-all duration-200 ease-in-out
//                 ${errors.bio ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
//             />
//             {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
//           </div>

//           <div className="flex justify-between pt-4 gap-4">
//             <button type="button" onClick={onBack} disabled={isLoading || authLoading}
//               className="flex-1 bg-transparent text-gray-700 py-2.5 px-5 rounded-md border border-gray-300 cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
//               Back
//             </button>
//             <button type="submit" disabled={isLoading || authLoading}
//               className="flex-1 bg-blue-500 text-white py-2.5 px-5 rounded-md border-none cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
//               {isLoading ? "Saving..." : "Continue"}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   if (step === "expertise") {
//     return (
//       <div className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-white font-inter">
//         <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Expertise</h2>
//         <div className="mb-6">
//           <h3 className="text-lg font-medium text-gray-800 mb-2">Skills You Can Teach</h3>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
//             {skills.map((skill) => (
//               <div key={skill.id} className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id={skill.id}
//                   checked={teachingSkills.includes(skill.id)}
//                   onChange={() => handleSkillToggle(skill.id)}
//                   className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
//                 />
//                 <label htmlFor={skill.id} className="text-sm font-medium text-gray-700 cursor-pointer">
//                   {skill.label}
//                 </label>
//               </div>
//             ))}
//           </div>
//           {errors.teachingSkills && (
//             <p className="text-red-500 text-sm mt-1">{errors.teachingSkills}</p>
//           )}

//           <div className="mt-5 mb-2">
//             <label htmlFor="customSkill" className="block text-sm font-medium text-gray-700 mb-1">Add Custom Skill</label>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 id="customSkill"
//                 value={customSkillInput}
//                 onChange={handleCustomSkillInputChange}
//                 placeholder="e.g., Chess Coaching"
//                 className="block w-full p-2 rounded-md border shadow-sm text-base outline-none transition-all duration-200 ease-in-out
//                   border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//               />
//               <button
//                 type="button"
//                 onClick={handleAddCustomSkill}
//                 disabled={isLoading}
//                 className="bg-blue-500 text-white py-2 px-3 rounded-md border-none cursor-pointer text-sm font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Add
//               </button>
//             </div>
//           </div>

//           {teachingSkills.length > 0 && (
//             <div className="mt-5 pt-4 border-t border-gray-200">
//               <h4 className="text-base font-medium text-gray-800 mb-2">Selected Skills:</h4>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {teachingSkills.map((skill, index) => (
//                   <div key={index} className="inline-flex items-center bg-blue-50 text-blue-800 py-1.5 px-3 rounded-full text-sm font-medium shadow-sm">
//                     <span>{skill}</span>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveSkill(skill)}
//                       disabled={isLoading}
//                       className="ml-1.5 text-blue-800 hover:text-red-600 focus:outline-none text-xl leading-none bg-transparent border-none cursor-pointer"
//                     >
//                       &times;
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <div className="flex justify-between pt-4 gap-4">
//             <button type="button" onClick={onBack} disabled={isLoading || authLoading}
//               className="flex-1 bg-transparent text-gray-700 py-2.5 px-5 rounded-md border border-gray-300 cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
//               Back
//             </button>
//             <button type="submit" disabled={isLoading || authLoading}
//               className="flex-1 bg-blue-500 text-white py-2.5 px-5 rounded-md border-none cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
//               {isLoading ? "Saving..." : "Continue"}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   if (step === "availability") {
//     return (
//       <div className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-white font-inter">
//         <h2 className="text-2xl font-semibold text-gray-900 mb-6">Set Your Availability</h2>
//         {errors.googleCalendar && (
//           <p className="text-red-500 text-sm mb-4">{errors.googleCalendar}</p>
//         )}

//         {/* Conditional rendering based directly on authUser.googleCalendar.connected */}
//         {authUser?.googleCalendar?.connected ? ( 
//           <>
//             <p className="text-sm text-gray-600 mb-6">
//               Select dates and time slots when you're available to teach. Your Google Calendar busy times will be highlighted.
//             </p>
//             <div className="flex items-center text-green-600 text-sm mb-4">
//               <CheckIcon className="h-4 w-4 mr-2" />
//               Google Calendar connected. Automatically fetching busy times.
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h3 className="text-base font-medium text-gray-800 mb-2">Select Date</h3>
//                 <div className="rounded-md border border-gray-300 overflow-hidden">
//                   <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
//                 </div>
//                 {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
//               </div>
//               <div>
//                 <h3 className="text-base font-medium text-gray-800 mb-2">Available Time Slots</h3>
//                 <div className="grid grid-cols-1 gap-2">
//                   {timeSlots.map((slot) => (
//                     <div
//                       key={slot}
//                       onClick={() => {
//                         if (!isSlotBusy(slot) && !isLoading) {
//                           handleSlotToggle(slot);
//                         } else if (isSlotBusy(slot)) {
//                           toast.info("This slot is unavailable due to your Google Calendar.");
//                         }
//                       }}
//                       className={`p-2 border rounded-md transition-colors duration-200 ease-in-out
//                         ${selectedSlots.includes(slot) ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50 border-gray-300"}
//                         ${isSlotBusy(slot) ? "bg-red-100 border-red-300 text-gray-500 cursor-not-allowed opacity-70" : "cursor-pointer"}
//                         ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <span>{slot}</span>
//                         {selectedSlots.includes(slot) && !isSlotBusy(slot) && (
//                           <CheckIcon className="h-4 w-4 text-blue-600" />
//                         )}
//                         {isSlotBusy(slot) && (
//                           <span className="text-red-500 text-xs font-semibold">BUSY</span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 {errors.selectedSlots && <p className="text-red-500 text-sm mt-1">{errors.selectedSlots}</p>}
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="text-center py-8">
//             <p className="mb-4 text-gray-700">
//               Connect your Google Calendar to automatically sync your availability and avoid booking conflicts. This is a required step to set your availability.
//             </p>
//             <button
//               type="button"
//               onClick={handleConnectGoogleCalendar}
//               disabled={isLoading || authLoading}
//               className="bg-red-500 text-white py-2.5 px-6 rounded-md border-none cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
//             >
//               {isLoading ? "Connecting..." : "Connect Google Calendar"}
//             </button>
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <div className="flex justify-between pt-4 gap-4">
//             <button type="button" onClick={onBack} disabled={isLoading || authLoading}
//               className="flex-1 bg-transparent text-gray-700 py-2.5 px-5 rounded-md border border-gray-300 cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
//               Back
//             </button>
//             <button type="submit" disabled={isLoading || authLoading || !authUser?.googleCalendar?.connected} // Use authUser.googleCalendar.connected directly
//               className="flex-1 bg-blue-500 text-white py-2.5 px-5 rounded-md border-none cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
//               {isLoading ? "Saving..." : "Continue"}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   if (step === "complete") {
//     return (
//       <div className="max-w-md mx-auto text-center p-6 space-y-8 font-inter">
//         <div className="flex justify-center">
//           <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center shadow-lg">
//             <CheckIcon className="h-12 w-12 text-green-600" />
//           </div>
//         </div>
//         <div>
//           <h2 className="text-2xl font-semibold text-gray-900 mb-2">You're All Set!</h2>
//           <p className="text-sm text-gray-600">
//             Your teacher profile has been created. Start sharing your knowledge with eager students!
//           </p>
//         </div>
//         <button
//           onClick={handleCompleteOnboarding}
//           disabled={isLoading || authLoading}
//           className="w-full bg-blue-500 text-white py-3 px-6 rounded-md border-none cursor-pointer text-lg font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isLoading ? "Loading..." : "Go to Dashboard"}
//         </button>
//       </div>
//     );
//   }

//   return null;
// };

// export default TeacherOnboarding;


// import React, { useState, useCallback, useEffect } from "react";
// import { Calendar } from "@/components/ui/calendar";
// import { CheckIcon } from "lucide-react";
// import { toast } from "sonner";
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useAuth } from "../../contexts/AuthContext";

// const timeSlots = [
//   "09:00 AM - 10:00 AM",
//   "10:00 AM - 11:00 AM",
//   "11:00 AM - 12:00 PM",
//   "01:00 PM - 02:00 PM",
//   "02:00 PM - 03:00 PM",
//   "03:00 PM - 04:00 PM",
//   "04:00 PM - 05:00 PM",
//   "05:00 PM - 06:00 PM",
//   "06:00 PM - 07:00 PM",
// ];

// const skills = [
//   { id: "painting", label: "Painting" },
//   { id: "music", label: "Music" },
//   { id: "cooking", label: "Cooking" },
//   { id: "programming", label: "Programming" },
//   { id: "yoga", label: "Yoga" },
//   { id: "dancing", label: "Dancing" },
//   { id: "photography", label: "Photography" },
//   { id: "writing", label: "Creative Writing" },
//   { id: "languages", label: "Languages" },
//   { id: "crafts", label: "Arts & Crafts" },
//   { id: "gardening", label: "Gardening" },
//   { id: "fitness", label: "Fitness & Exercise" },
// ];

// const TeacherOnboarding = ({ step, onNext, onBack, onComplete, onSetStep }) => {
//   const { api, user: authUser, loading: authLoading, fetchUser } = useAuth(); 

//   const [formData, setFormData] = useState({
//     fullName: "",
//     phone: "",
//     bio: "",
//   });
//   const [teachingSkills, setTeachingSkills] = useState([]);
//   const [customSkillInput, setCustomSkillInput] = useState("");
//   const [date, setDate] = useState(new Date());
//   const [selectedSlots, setSelectedSlots] = useState([]);
//   const [busyTimes, setBusyTimes] = useState([]);

//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const location = useLocation();
//   const navigate = useNavigate();

//   // Primary useEffect for initial form data and handling Google Calendar redirect
//   useEffect(() => {
//     if (authLoading) {
//       return;
//     }

//     if (authUser && step === "info") {
//       setFormData((prev) => ({
//         ...prev,
//         fullName: authUser.name || "",
//         phone: authUser.phoneNumber || "",
//         bio: authUser.bio || "",
//       }));
//       setTeachingSkills(authUser.teachingSkills || []);
//     }

//     const params = new URLSearchParams(location.search);
//     const calendarAuthStatus = params.get('calendarAuthStatus');
//     const calendarAuthError = params.get('error');
//     const nextStepParam = params.get('nextStep');

//     if (calendarAuthStatus) {
//       if (calendarAuthStatus === 'success') {
//         toast.success("Google Calendar connected successfully!");

//         const checkAndRefetchProfile = async (retries = 3) => {
//           // Now checking the correct property: authUser?.googleCalendarConnected
//           if (!authUser?.googleCalendarConnected && retries > 0) { 
//             try {
//               await fetchUser();
//             } catch (err) {
//               console.error("Error during refetch in TeacherOnboarding:", err);
//             }
//             if (!authUser?.googleCalendarConnected && retries > 1) {
//                 setTimeout(() => checkAndRefetchProfile(retries - 1), 1000);
//             }
//           }
//         };
//         checkAndRefetchProfile();
        
//         if (nextStepParam === 'availability' && typeof onSetStep === 'function') {
//           onSetStep('availability');
//         }

//       } else {
//         toast.error(`Failed to connect Google Calendar: ${decodeURIComponent(calendarAuthError || 'Unknown error.')}`);
//         fetchUser(); 
//       }

//       const newSearchParams = new URLSearchParams(location.search);
//       newSearchParams.delete('calendarAuthStatus');
//       newSearchParams.delete('error');
//       newSearchParams.delete('nextStep');
//       navigate({ search: newSearchParams.toString() }, { replace: true });
//     } 
//   }, [authUser, authLoading, step, api, location.search, navigate, onSetStep, fetchUser]);

//   // Effect to fetch busy times when on 'availability' step and calendar is connected
//   useEffect(() => {
//     // Now checking the correct property: authUser?.googleCalendarConnected
//     if (!date || !authUser?.googleCalendarConnected || !api) { 
//       setBusyTimes([]);
//       return;
//     }

//     setIsLoading(true);
//     const fetchEvents = async () => {
//       try {
//         const formattedDate = date.toISOString().split('T')[0];
//         const response = await api.get(`/api/calendar/busy-times?date=${formattedDate}`);
//         setBusyTimes(response.data.busyTimes || []);
//       } catch (error) {
//         console.error("Failed to fetch busy times:", error.response?.data || error.message);
//         toast.error(error.response?.data?.message || "Failed to fetch busy times from Google Calendar.");
//         setBusyTimes([]);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     fetchEvents();
//   }, [date, authUser?.googleCalendarConnected, api, step]); // Depend on authUser.googleCalendarConnected directly

//   const isSlotBusy = useCallback((slot) => {
//     if (!busyTimes || busyTimes.length === 0) return false;

//     const [startTimeStr, endTimeStr] = slot.split(' - ');
//     const selectedDateISO = date.toISOString().split('T')[0];

//     const parseTime = (timeStr) => {
//       const [time, period] = timeStr.split(' ');
//       let [hours, minutes] = time.split(':').map(Number);
//       if (period === 'PM' && hours !== 12) hours += 12;
//       if (period === 'AM' && hours === 12) hours = 0;

//       const d = new Date(selectedDateISO);
//       d.setHours(hours, minutes, 0, 0);
//       return d;
//     };

//     const slotStart = parseTime(startTimeStr);
//     const slotEnd = parseTime(endTimeStr);

//     for (const busyEvent of busyTimes) {
//       const busyStart = new Date(busyEvent.start);
//       const busyEnd = new Date(busyEvent.end);

//       if (slotStart < busyEnd && slotEnd > busyStart) {
//         return true;
//       }
//     }
//     return false;
//   }, [busyTimes, date]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
//   };

//   const handleCustomSkillInputChange = (e) => {
//     setCustomSkillInput(e.target.value);
//   };

//   const handleSkillToggle = useCallback((skillId) => {
//     setTeachingSkills((prev) => {
//       const newState = prev.includes(skillId)
//         ? prev.filter((id) => id !== skillId)
//         : [...prev, skillId];
//       return newState;
//     });
//     setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" }));
//   }, []);

//   const handleRemoveSkill = useCallback((skillToRemove) => {
//     setTeachingSkills((prev) => {
//       const newState = prev.filter((skill) => skill !== skillToRemove);
//       return newState;
//     });
//     setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" }));
//   }, []);

//   const handleAddCustomSkill = useCallback(() => {
//     const trimmedSkill = customSkillInput.trim();
//     if (!trimmedSkill) {
//       toast.error("Custom skill cannot be empty.");
//       return;
//     }
//     if (teachingSkills.includes(trimmedSkill.toLowerCase())) {
//       toast.error("This skill has already been added.");
//       return;
//     }

//     setTeachingSkills((prev) => {
//       const newState = [...prev, trimmedSkill.toLowerCase()];
//       return newState;
//     });
//     setCustomSkillInput("");
//     setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" }));
//   }, [customSkillInput, teachingSkills]);

//   const handleSlotToggle = useCallback((slot) => {
//     setSelectedSlots((prev) => {
//       const newState = prev.includes(slot)
//         ? prev.filter((s) => s !== slot)
//         : [...prev, slot];
//       return newState;
//     });
//     setErrors((prevErrors) => ({ ...prevErrors, selectedSlots: "" }));
//   }, []);

//   const handleDateSelect = useCallback((selectedDate) => {
//     if (selectedDate instanceof Date) {
//       setDate(selectedDate);
//       setErrors((prevErrors) => ({ ...prevErrors, date: "" }));
//     }
//   }, []);

//   const handleConnectGoogleCalendar = async () => {
//     setIsLoading(true);
//     try {
//       const response = await api.get("/auth/calendar/auth-url");
//       const { authUrl } = response.data;
//       window.location.href = authUrl; 
//     } catch (error) {
//       console.error("Error connecting Google Calendar:", error.response?.data || error.message);
//       toast.error(error.response?.data?.message || "Failed to initiate Google Calendar connection.");
//       setIsLoading(false); 
//     }
//   };

//   const validateForm = (currentStep) => {
//     let isValid = true;
//     const newErrors = {};

//     if (currentStep === "info") {
//       if (!formData.fullName.trim()) {
//         newErrors.fullName = "Full Name is required";
//         isValid = false;
//       }
//       if (!formData.phone.trim()) {
//         newErrors.phone = "Phone Number is required";
//         isValid = false;
//       } else if (!/^\+?\d{10,15}$/.test(formData.phone)) {
//         newErrors.phone = "Invalid phone number format. Use +CountryCode and 10-15 digits.";
//         isValid = false;
//       }
//       if (!formData.bio.trim()) {
//         newErrors.bio = "A short bio is required";
//         isValid = false;
//       }
//     } else if (currentStep === "expertise") {
//       if (teachingSkills.length === 0) {
//         newErrors.teachingSkills = "Please select or add at least one skill.";
//         isValid = false;
//       }
//     } else if (currentStep === "availability") {
//       // Now checking the correct property: authUser?.googleCalendarConnected
//       if (!authUser?.googleCalendarConnected) { 
//         newErrors.googleCalendar = "Please connect your Google Calendar to proceed.";
//         isValid = false;
//       } else {
//         if (!date) {
//           newErrors.date = "Please select a date for your availability.";
//           isValid = false;
//         }
//         if (selectedSlots.length === 0) {
//           newErrors.selectedSlots = "Please select at least one time slot.";
//           isValid = false;
//         }
//       }
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const currentStep = step;

//     if (!validateForm(currentStep)) {
//       toast.error("Please correct the errors in the form before continuing.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       let dataToSend = {};
//       let endpoint = "";

//       if (currentStep === "info") {
//         dataToSend = {
//           name: formData.fullName,
//           phoneNumber: formData.phone,
//           bio: formData.bio,
//         };
//         endpoint = "/auth/profile";
//       } else if (currentStep === "expertise") {
//         dataToSend = {
//           teachingSkills: teachingSkills,
//         };
//         endpoint = "/auth/profile/teaching-skills";
//       } else if (currentStep === "availability") {
//         dataToSend = {
//           date: date.toISOString(),
//           slots: selectedSlots,
//         };
//         endpoint = "/auth/profile/availability";
//       }

//       await api.patch(endpoint, dataToSend);

//       toast.success("Information saved successfully!");
//       onNext();

//     } catch (error) {
//       console.error("Onboarding step failed:", error.response?.data || error.message, error);
//       toast.error(error.response?.data?.message || "An unexpected error occurred. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCompleteOnboarding = async () => {
//     setIsLoading(true);
//     try {
//       await api.patch("/auth/profile", { teacherOnboardingComplete: true });

//       toast.success("Onboarding complete! Welcome to the teacher community.");
//       onComplete();
//     } catch (error) {
//       console.error("Finalizing onboarding failed:", error.response?.data || error.message, error);
//       toast.error(error.response?.data?.message || "Failed to finalize onboarding. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (authLoading) {
//     return <div className="text-center p-12 text-lg text-gray-600 font-inter">Loading User Data...</div>;
//   }

//   if (step === "info") {
//     return (
//       <div className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-white font-inter">
//         <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Information</h2>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <div className="mb-2">
//             <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//             <input
//               type="text"
//               id="fullName"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleInputChange}
//               placeholder="John Doe"
//               className={`block w-full p-2.5 rounded-md border shadow-sm text-base outline-none transition-all duration-200 ease-in-out
//                 ${errors.fullName ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
//             />
//             {errors.fullName && (
//               <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
//             )}
//           </div>
//           <div className="mb-2">
//             <label htmlFor="phone" className className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//             <input
//               type="text"
//               id="phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleInputChange}
//               placeholder="+1 (555) 123-4567"
//               className={`block w-full p-2.5 rounded-md border shadow-sm text-base outline-none transition-all duration-200 ease-in-out
//                 ${errors.phone ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
//             />
//             {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
//           </div>
//           <div className="mb-2">
//             <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">About You</label>
//             <textarea
//               id="bio"
//               name="bio"
//               value={formData.bio}
//               onChange={handleInputChange}
//               placeholder="Share information about your background and teaching style"
//               className={`block w-full p-2.5 rounded-md border shadow-sm text-base min-h-[80px] outline-none resize-y transition-all duration-200 ease-in-out
//                 ${errors.bio ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
//             />
//             {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
//           </div>

//           <div className="flex justify-between pt-4 gap-4">
//             <button type="button" onClick={onBack} disabled={isLoading || authLoading}
//               className="flex-1 bg-transparent text-gray-700 py-2.5 px-5 rounded-md border border-gray-300 cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
//               Back
//             </button>
//             <button type="submit" disabled={isLoading || authLoading}
//               className="flex-1 bg-blue-500 text-white py-2.5 px-5 rounded-md border-none cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
//               {isLoading ? "Saving..." : "Continue"}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   if (step === "expertise") {
//     return (
//       <div className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-white font-inter">
//         <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Expertise</h2>
//         <div className="mb-6">
//           <h3 className="text-lg font-medium text-gray-800 mb-2">Skills You Can Teach</h3>
//           <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2">
//             {skills.map((skill) => (
//               <div key={skill.id} className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id={skill.id}
//                   checked={teachingSkills.includes(skill.id)}
//                   onChange={() => handleSkillToggle(skill.id)}
//                   className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
//                 />
//                 <label htmlFor={skill.id} className="text-sm font-medium text-gray-700 cursor-pointer">
//                   {skill.label}
//                 </label>
//               </div>
//             ))}
//           </div>
//           {errors.teachingSkills && (
//             <p className="text-red-500 text-sm mt-1">{errors.teachingSkills}</p>
//           )}

//           <div className="mt-5 mb-2">
//             <label htmlFor="customSkill" className="block text-sm font-medium text-gray-700 mb-1">Add Custom Skill</label>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 id="customSkill"
//                 value={customSkillInput}
//                 onChange={handleCustomSkillInputChange}
//                 placeholder="e.g., Chess Coaching"
//                 className="block w-full p-2 rounded-md border shadow-sm text-base outline-none transition-all duration-200 ease-in-out
//                   border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//               />
//               <button
//                 type="button"
//                 onClick={handleAddCustomSkill}
//                 disabled={isLoading}
//                 className="bg-blue-500 text-white py-2 px-3 rounded-md border-none cursor-pointer text-sm font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Add
//               </button>
//             </div>
//           </div>

//           {teachingSkills.length > 0 && (
//             <div className="mt-5 pt-4 border-t border-gray-200">
//               <h4 className="text-base font-medium text-gray-800 mb-2">Selected Skills:</h4>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 {teachingSkills.map((skill, index) => (
//                   <div key={index} className="inline-flex items-center bg-blue-50 text-blue-800 py-1.5 px-3 rounded-full text-sm font-medium shadow-sm">
//                     <span>{skill}</span>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveSkill(skill)}
//                       disabled={isLoading}
//                       className="ml-1.5 text-blue-800 hover:text-red-600 focus:outline-none text-xl leading-none bg-transparent border-none cursor-pointer"
//                     >
//                       &times;
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <div className="flex justify-between pt-4 gap-4">
//             <button type="button" onClick={onBack} disabled={isLoading || authLoading}
//               className="flex-1 bg-transparent text-gray-700 py-2.5 px-5 rounded-md border border-gray-300 cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
//               Back
//             </button>
//             <button type="submit" disabled={isLoading || authLoading}
//               className="flex-1 bg-blue-500 text-white py-2.5 px-5 rounded-md border-none cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
//               {isLoading ? "Saving..." : "Continue"}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   if (step === "availability") {
//     return (
//       <div className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-white font-inter">
//         <h2 className="text-2xl font-semibold text-gray-900 mb-6">Set Your Availability</h2>
//         {errors.googleCalendar && (
//           <p className="text-red-500 text-sm mb-4">{errors.googleCalendar}</p>
//         )}

//         {/* Conditional rendering based on authUser?.googleCalendarConnected */}
//         {authUser?.googleCalendarConnected ? ( 
//           <>
//             <p className="text-sm text-gray-600 mb-6">
//               Select dates and time slots when you're available to teach. Your Google Calendar busy times will be highlighted.
//             </p>
//             <div className="flex items-center text-green-600 text-sm mb-4">
//               <CheckIcon className="h-4 w-4 mr-2" />
//               Google Calendar connected. Automatically fetching busy times.
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h3 className="text-base font-medium text-gray-800 mb-2">Select Date</h3>
//                 <div className="rounded-md border border-gray-300 overflow-hidden">
//                   <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
//                 </div>
//                 {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
//               </div>
//               <div>
//                 <h3 className="text-base font-medium text-gray-800 mb-2">Available Time Slots</h3>
//                 <div className="grid grid-cols-1 gap-2">
//                   {timeSlots.map((slot) => (
//                     <div
//                       key={slot}
//                       onClick={() => {
//                         if (!isSlotBusy(slot) && !isLoading) {
//                           handleSlotToggle(slot);
//                         } else if (isSlotBusy(slot)) {
//                           toast.info("This slot is unavailable due to your Google Calendar.");
//                         }
//                       }}
//                       className={`p-2 border rounded-md transition-colors duration-200 ease-in-out
//                         ${selectedSlots.includes(slot) ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50 border-gray-300"}
//                         ${isSlotBusy(slot) ? "bg-red-100 border-red-300 text-gray-500 cursor-not-allowed opacity-70" : "cursor-pointer"}
//                         ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
//                     >
//                       <div className="flex items-center justify-between">
//                         <span>{slot}</span>
//                         {selectedSlots.includes(slot) && !isSlotBusy(slot) && (
//                           <CheckIcon className="h-4 w-4 text-blue-600" />
//                         )}
//                         {isSlotBusy(slot) && (
//                           <span className="text-red-500 text-xs font-semibold">BUSY</span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 {errors.selectedSlots && <p className="text-red-500 text-sm mt-1">{errors.selectedSlots}</p>}
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="text-center py-8">
//             <p className="mb-4 text-gray-700">
//               Connect your Google Calendar to automatically sync your availability and avoid booking conflicts. This is a required step to set your availability.
//             </p>
//             <button
//               type="button"
//               onClick={handleConnectGoogleCalendar}
//               disabled={isLoading || authLoading}
//               className="bg-red-500 text-white py-2.5 px-6 rounded-md border-none cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
//             >
//               {isLoading ? "Connecting..." : "Connect Google Calendar"}
//             </button>
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <div className="flex justify-between pt-4 gap-4">
//             <button type="button" onClick={onBack} disabled={isLoading || authLoading}
//               className="flex-1 bg-transparent text-gray-700 py-2.5 px-5 rounded-md border border-gray-300 cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
//               Back
//             </button>
//             <button type="submit" disabled={isLoading || authLoading || !authUser?.googleCalendarConnected}
//               className="flex-1 bg-blue-500 text-white py-2.5 px-5 rounded-md border-none cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
//               {isLoading ? "Saving..." : "Continue"}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   if (step === "complete") {
//     return (
//       <div className="max-w-md mx-auto text-center p-6 space-y-8 font-inter">
//         <div className="flex justify-center">
//           <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center shadow-lg">
//             <CheckIcon className="h-12 w-12 text-green-600" />
//           </div>
//         </div>
//         <div>
//           <h2 className="text-2xl font-semibold text-gray-900 mb-2">You're All Set!</h2>
//           <p className="text-sm text-gray-600">
//             Your teacher profile has been created. Start sharing your knowledge with eager students!
//           </p>
//         </div>
//         <button
//           onClick={handleCompleteOnboarding}
//           disabled={isLoading || authLoading}
//           className="w-full bg-blue-500 text-white py-3 px-6 rounded-md border-none cursor-pointer text-lg font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isLoading ? "Loading..." : "Go to Dashboard"}
//         </button>
//       </div>
//     );
//   }

//   return null;
// };

// export default TeacherOnboarding;


import React, { useState, useCallback, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";

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

const TeacherOnboarding = ({ step, onNext, onBack, onComplete, onSetStep }) => {
  const { api, user: authUser, loading: authLoading, fetchUser, updateGeneralProfile, updateTeachingSkills, updateAvailability, connectGoogleCalendar } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    bio: "",
  });
  const [teachingSkills, setTeachingSkills] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [date, setDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [busyTimes, setBusyTimes] = useState([]);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

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

    const params = new URLSearchParams(location.search);
    const calendarAuthStatus = params.get('calendarAuthStatus');
    const calendarAuthError = params.get('error');
    const nextStepParam = params.get('nextStep');

    if (calendarAuthStatus) {
      if (calendarAuthStatus === 'success') {
        toast.success("Google Calendar connected successfully!");

        const checkAndRefetchProfile = async (retries = 3) => {
          if (!authUser?.googleCalendarConnected && retries > 0) {
            try {
              await fetchUser();
            } catch (err) {
              console.error("Error during refetch in TeacherOnboarding:", err);
            }
            if (!authUser?.googleCalendarConnected && retries > 1) {
                setTimeout(() => checkAndRefetchProfile(retries - 1), 1000);
            }
          }
        };
        checkAndRefetchProfile();

        if (nextStepParam === 'availability' && typeof onSetStep === 'function') {
          onSetStep('availability');
        }

      } else {
        toast.error(`Failed to connect Google Calendar: ${decodeURIComponent(calendarAuthError || 'Unknown error.')}`);
        fetchUser();
      }

      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.delete('calendarAuthStatus');
      newSearchParams.delete('error');
      newSearchParams.delete('nextStep');
      navigate({ search: newSearchParams.toString() }, { replace: true });
    }
  }, [authUser, authLoading, step, api, location.search, navigate, onSetStep, fetchUser]);

  useEffect(() => {
    if (!date || !authUser?.googleCalendarConnected || !api || step !== 'availability') {
      setBusyTimes([]);
      return;
    }

    setIsLoading(true);
    const fetchEvents = async () => {
      try {
        const formattedDate = date.toISOString().split('T')[0];
        const response = await api.get(`/api/calendar/busy-times?date=${formattedDate}`);
        setBusyTimes(response.data.busyTimes || []);
      } catch (error) {
        console.error("Failed to fetch busy times:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Failed to fetch busy times from Google Calendar.");
        setBusyTimes([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, [date, authUser?.googleCalendarConnected, api, step]);

  const isSlotBusy = useCallback((slot) => {
    if (!busyTimes || busyTimes.length === 0) return false;

    const [startTimeStr, endTimeStr] = slot.split(' - ');
    const selectedDateISO = date.toISOString().split('T')[0];

    const parseTime = (timeStr) => {
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      const d = new Date(selectedDateISO);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    const slotStart = parseTime(startTimeStr);
    const slotEnd = parseTime(endTimeStr);

    for (const busyEvent of busyTimes) {
      const busyStart = new Date(busyEvent.start);
      const busyEnd = new Date(busyEvent.end);

      if (slotStart < busyEnd && slotEnd > busyStart) {
        return true;
      }
    }
    return false;
  }, [busyTimes, date]);

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

  const handleSlotToggle = useCallback((slot) => {
    setSelectedSlots((prev) => {
      const newState = prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot];
      return newState;
    });
    setErrors((prevErrors) => ({ ...prevErrors, selectedSlots: "" }));
  }, []);

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
      if (!authUser?.googleCalendarConnected) {
        newErrors.googleCalendar = "Please connect your Google Calendar to proceed.";
        isValid = false;
      } else {
        if (!date) {
          newErrors.date = "Please select a date for your availability.";
          isValid = false;
        }
        if (selectedSlots.length === 0) {
          newErrors.selectedSlots = "Please select at least one time slot.";
          isValid = false;
        }
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
      await fetchUser(); // Ensure user state is refreshed after any profile update
    }
  };

  const handleCompleteOnboarding = async () => {
    setIsLoading(true);
    try {
      await api.patch("/auth/profile", { teacherOnboardingComplete: true });
      await fetchUser(); // Fetch user again to ensure the onboardingComplete flag is updated in context

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
    return (
      <div className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-white font-inter">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Set Your Availability</h2>
        {errors.googleCalendar && (
          <p className="text-red-500 text-sm mb-4">{errors.googleCalendar}</p>
        )}

        {authUser?.googleCalendarConnected ? (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Select dates and time slots when you're available to teach. Your Google Calendar busy times will be highlighted.
            </p>
            <div className="flex items-center text-green-600 text-sm mb-4">
              <CheckIcon className="h-4 w-4 mr-2" />
              Google Calendar connected. Automatically fetching busy times.
            </div>

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
                  {timeSlots.map((slot) => (
                    <div
                      key={slot}
                      onClick={() => {
                        if (!isSlotBusy(slot) && !isLoading) {
                          handleSlotToggle(slot);
                        } else if (isSlotBusy(slot)) {
                          toast.info("This slot is unavailable due to your Google Calendar.");
                        }
                      }}
                      className={`p-2 border rounded-md transition-colors duration-200 ease-in-out
                        ${selectedSlots.includes(slot) ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50 border-gray-300"}
                        ${isSlotBusy(slot) ? "bg-red-100 border-red-300 text-gray-500 cursor-not-allowed opacity-70" : "cursor-pointer"}
                        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{slot}</span>
                        {selectedSlots.includes(slot) && !isSlotBusy(slot) && (
                          <CheckIcon className="h-4 w-4 text-blue-600" />
                        )}
                        {isSlotBusy(slot) && (
                          <span className="text-red-500 text-xs font-semibold">BUSY</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.selectedSlots && <p className="text-red-500 text-sm mt-1">{errors.selectedSlots}</p>}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="mb-4 text-gray-700">
              Connect your Google Calendar to automatically sync your availability and avoid booking conflicts. This is a required step to set your availability.
            </p>
            <button
              type="button"
              onClick={connectGoogleCalendar} // Using the new function directly
              disabled={isLoading || authLoading}
              className="bg-red-500 text-white py-2.5 px-6 rounded-md border-none cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
            >
              {isLoading ? "Connecting..." : "Connect Google Calendar"}
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-between pt-4 gap-4">
            <button type="button" onClick={onBack} disabled={isLoading || authLoading}
              className="flex-1 bg-transparent text-gray-700 py-2.5 px-5 rounded-md border border-gray-300 cursor-pointer text-base font-medium transition-all duration-200 ease-in-out hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Back
            </button>
            <button type="submit" disabled={isLoading || authLoading || !authUser?.googleCalendarConnected}
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