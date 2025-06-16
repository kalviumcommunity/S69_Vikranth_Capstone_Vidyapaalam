

// import React, { useState, useCallback, useEffect } from "react";
// import { Calendar } from "@/components/ui/calendar";
// import { CheckIcon } from "lucide-react";
// import { toast } from "sonner";

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

// const TeacherOnboarding = ({ step, onNext, onBack, onComplete }) => {
//   const { api, user: authUser, loading: authLoading } = useAuth();

//   const [formData, setFormData] = useState({
//     fullName: "",
//     phone: "",
//     bio: "",
//   });
//   const [teachingSkills, setTeachingSkills] = useState([]);
//   const [customSkillInput, setCustomSkillInput] = useState(""); // New state for custom skill input
//   const [date, setDate] = useState(new Date());
//   const [selectedSlots, setSelectedSlots] = useState([]);

//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     console.log("TeacherOnboarding mounted or re-rendered. Current step:", step);
//     console.log("Current teachingSkills state in useEffect:", teachingSkills);
//     console.log("Current formData state in useEffect:", formData);

//     if (authUser && step === "info" && !authLoading) {
//       console.log("Pre-filling form with authUser data:", authUser);
//       setFormData((prev) => ({
//         ...prev,
//         fullName: authUser.name || "",
//         phone: authUser.phoneNumber || "",
//         bio: authUser.bio || "",
//       }));
//       setTeachingSkills(authUser.teachingSkills || []);
//     }
//   }, [authUser, authLoading, step]);

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
//       console.log("Skill Toggled. New teachingSkills state:", newState);
//       return newState;
//     });
//     setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" }));
//   }, []);

//   const handleRemoveSkill = useCallback((skillToRemove) => {
//     setTeachingSkills((prev) => {
//       const newState = prev.filter((skill) => skill !== skillToRemove);
//       console.log("Skill Removed. New teachingSkills state:", newState);
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
//     if (teachingSkills.includes(trimmedSkill.toLowerCase())) { // Case-insensitive check for duplicates
//       toast.error("This skill has already been added.");
//       return;
//     }

//     setTeachingSkills((prev) => {
//       const newState = [...prev, trimmedSkill.toLowerCase()]; // Add in lowercase for consistency
//       console.log("Custom Skill Added. New teachingSkills state:", newState);
//       return newState;
//     });
//     setCustomSkillInput(""); // Clear the input field
//     setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" }));
//   }, [customSkillInput, teachingSkills]);

//   const handleSlotToggle = useCallback((slot) => {
//     setSelectedSlots((prev) => {
//       const newState = prev.includes(slot)
//         ? prev.filter((s) => s !== slot)
//         : [...prev, slot];
//       console.log("Slot Toggled. New selectedSlots state:", newState);
//       return newState;
//     });
//     setErrors((prevErrors) => ({ ...prevErrors, selectedSlots: "" }));
//   }, []);

//   const handleDateSelect = useCallback((selectedDate) => {
//     if (selectedDate instanceof Date) {
//       setDate(selectedDate);
//       console.log("Date Selected. New date state:", selectedDate);
//       setErrors((prevErrors) => ({ ...prevErrors, date: "" }));
//     }
//   }, []);

//   const validateForm = (currentStep) => {
//     let isValid = true;
//     const newErrors = {};

//     console.group(`--- validateForm called for step: ${currentStep} ---`);
//     console.log("Initial isValid:", isValid);
//     console.log("Current teachingSkills (inside validateForm):", teachingSkills);
//     console.log("Length of teachingSkills (inside validateForm):", teachingSkills.length);
//     console.log("Current formData (inside validateForm):", formData);
//     console.log("Current date (inside validateForm):", date);
//     console.log("Current selectedSlots (inside validateForm):", selectedSlots);


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
//       console.log("Entering expertise validation block.");
//       if (teachingSkills.length === 0) {
//         newErrors.teachingSkills = "Please select or add at least one skill.";
//         isValid = false;
//         console.log("Validation: teachingSkills length is 0. Setting isValid to false.");
//       } else {
//         console.log("Validation: teachingSkills length is NOT 0. Proceeding.");
//       }
//     } else if (currentStep === "availability") {
//         if (!date) {
//             newErrors.date = "Please select a date for your availability.";
//             isValid = false;
//         }
//         if (selectedSlots.length === 0) {
//             newErrors.selectedSlots = "Please select at least one time slot.";
//             isValid = false;
//         }
//     }

//     setErrors(newErrors);
//     console.log("Errors after setErrors (inside validateForm):", newErrors);
//     console.log("Final isValid for step", currentStep, ":", isValid);
//     console.groupEnd();
//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const currentStep = step;

//     console.log(`--- handleSubmit called for step: ${currentStep} ---`);

//     if (!validateForm(currentStep)) {
//         console.log("handleSubmit: validateForm returned FALSE. Stopping submission.");
//         toast.error("Please correct the errors in the form before continuing.");
//         return;
//     }

//     console.log("handleSubmit: validateForm returned TRUE. Proceeding to API call.");
//     setIsLoading(true);

//     try {
//       let dataToSend = {};
//       let endpoint = "";

//       if (currentStep === "info") {
//         dataToSend = {
//           name: formData.fullName,
//           phone: formData.phone,
//           bio: formData.bio,
//         };
//         endpoint = "/auth/profile";
//       } else if (currentStep === "expertise") {
//         dataToSend = {
//           teachingSkills: teachingSkills,
//         };
//         endpoint = "/auth/profile/teaching-skills";
//         console.log("handleSubmit: Data to send for expertise:", dataToSend);
//       } else if (currentStep === "availability") {
//         dataToSend = {
//           date: date.toISOString(),
//           slots: selectedSlots,
//         };
//         endpoint = "/auth/profile/availability";
//       }

//       console.log(`handleSubmit: Making API call to ${endpoint} with data:`, dataToSend);
//       const response = await api.patch(endpoint, dataToSend);
//       console.log("handleSubmit: API call successful! Response data:", response.data);

//       toast.success("Information saved successfully!");
//       onNext();

//     } catch (error) {
//       console.error("handleSubmit: Onboarding step failed in try/catch block:", error.response?.data || error.message, error);
//       toast.error(error.response?.data?.message || "An unexpected error occurred. Please try again.");
//     } finally {
//       setIsLoading(false);
//       console.log("handleSubmit: Exiting finally block.");
//     }
//   };

//   const handleCompleteOnboarding = async () => {
//       setIsLoading(true);
//       try {
//           await api.patch("/auth/profile", { teacherOnboardingComplete: true });

//           toast.success("Onboarding complete! Welcome to the teacher community.");
//           onComplete();
//       } catch (error) {
//           console.error("Finalizing onboarding failed:", error.response?.data || error.message, error);
//           toast.error(error.response?.data?.message || "Failed to finalize onboarding. Please try again.");
//       } finally {
//           setIsLoading(false);
//       }
//   };

//   if (authLoading) {
//       return <div style={styles.loadingContainer}>Loading User Data...</div>;
//   }

//   if (step === "info") {
//     return (
//       <div style={styles.container}>
//         <h2 style={styles.heading}>Basic Information</h2>
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <div style={styles.formGroup}>
//             <label htmlFor="fullName" style={styles.label}>Full Name</label>
//             <input
//               type="text"
//               id="fullName"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleInputChange}
//               placeholder=""
//               style={{ ...styles.input, ...(errors.fullName ? styles.inputError : {}) }}
//             />
//             {errors.fullName && (
//               <p style={styles.errorText}>{errors.fullName}</p>
//             )}
//           </div>
//           <div style={styles.formGroup}>
//             <label htmlFor="phone" style={styles.label}>Phone Number</label>
//             <input
//               type="text"
//               id="phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleInputChange}
//               placeholder="+1 (555) 123-4567"
//               style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }}
//             />
//             {errors.phone && <p style={styles.errorText}>{errors.phone}</p>}
//           </div>
//           <div style={styles.formGroup}>
//             <label htmlFor="bio" style={styles.label}>About You</label>
//             <textarea
//               id="bio"
//               name="bio"
//               value={formData.bio}
//               onChange={handleInputChange}
//               placeholder="Share information about your background and teaching style"
//               style={{ ...styles.textarea, ...(errors.bio ? styles.inputError : {}) }}
//             />
//             {errors.bio && <p style={styles.errorText}>{errors.bio}</p>}
//           </div>
//           <div style={styles.buttonGroup}>
//             <button type="button" onClick={onBack} disabled={isLoading || authLoading} style={styles.buttonOutline}>
//               Back
//             </button>
//             <button type="submit" disabled={isLoading || authLoading} style={styles.buttonPrimary}>
//               {isLoading ? "Saving..." : "Continue"}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   if (step === "expertise") {
//     return (
//       <div style={styles.container}>
//         <h2 style={styles.heading}>Your Expertise</h2>
//         <div style={styles.section}>
//           <h3 style={styles.subheading}>Skills You Can Teach</h3>
//           <div style={styles.skillsGrid}>
//             {skills.map((skill) => (
//               <div key={skill.id} style={styles.skillItem}>
//                 <input
//                   type="checkbox"
//                   id={skill.id}
//                   checked={teachingSkills.includes(skill.id)}
//                   onChange={() => handleSkillToggle(skill.id)}
//                   style={styles.checkbox}
//                 />
//                 <label htmlFor={skill.id} style={styles.skillLabel}>
//                   {skill.label}
//                 </label>
//               </div>
//             ))}
//           </div>
//           {errors.teachingSkills && (
//             <p style={styles.errorText}>{errors.teachingSkills}</p>
//           )}

//           {/* Custom Skill Input */}
//           <div style={{ ...styles.formGroup, marginTop: '20px' }}>
//             <label htmlFor="customSkill" style={styles.label}>Add Custom Skill</label>
//             <div style={{ display: 'flex', gap: '8px' }}>
//                 <input
//                     type="text"
//                     id="customSkill"
//                     value={customSkillInput}
//                     onChange={handleCustomSkillInputChange}
//                     placeholder="e.g., Chess Coaching"
//                     style={{ ...styles.input, flexGrow: 1 }}
//                 />
//                 <button
//                     type="button"
//                     onClick={handleAddCustomSkill}
//                     style={{ ...styles.buttonPrimary, padding: '8px 12px', fontSize: '0.9rem' }}
//                 >
//                     Add
//                 </button>
//             </div>
//           </div>

//           {/* Display Selected Skills (Tags) */}
//           {teachingSkills.length > 0 && (
//             <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
//               <h4 style={{ ...styles.subheading, fontSize: '1rem', marginBottom: '10px' }}>Selected Skills:</h4>
//               <div style={styles.selectedSkillsContainer}>
//                 {teachingSkills.map((skill, index) => (
//                   <div key={index} style={styles.skillTag}>
//                     <span>{skill}</span>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveSkill(skill)}
//                       style={styles.removeSkillButton}
//                     >
//                       &times;
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//         </div>
//         <form onSubmit={handleSubmit} style={styles.form}>
//             <div style={styles.buttonGroup}>
//                 <button type="button" onClick={onBack} disabled={isLoading || authLoading} style={styles.buttonOutline}>
//                 Back
//                 </button>
//                 <button type="submit" disabled={isLoading || authLoading} style={styles.buttonPrimary}>
//                 {isLoading ? "Saving..." : "Continue"}
//                 </button>
//             </div>
//         </form>
//       </div>
//     );
//   }

//   if (step === "availability") {
//     return (
//       <div style={styles.container}>
//         <h2 style={styles.heading}>Set Your Availability</h2>
//         <p style={styles.description}>
//           Select dates and time slots when you're available to teach.
//         </p>
//         <div style={styles.gridColumns}>
//           <div>
//             <h3 style={styles.subheading}>Select Dates</h3>
//             <div style={styles.calendarContainer}>
//               <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
//             </div>
//             {errors.date && <p style={styles.errorText}>{errors.date}</p>}
//           </div>
//           <div>
//             <h3 style={styles.subheading}>Available Time Slots</h3>
//             <div style={styles.timeSlotsGrid}>
//               {timeSlots.map((slot) => (
//                 <div
//                   key={slot}
//                   style={{
//                     ...styles.timeSlotItem,
//                     ...(selectedSlots.includes(slot) ? styles.timeSlotItemSelected : {})
//                   }}
//                   onClick={() => handleSlotToggle(slot)}
//                 >
//                   <div style={styles.timeSlotContent}>
//                     <span>{slot}</span>
//                     {selectedSlots.includes(slot) && (
//                       <CheckIcon style={styles.checkIcon} />
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {errors.selectedSlots && <p style={styles.errorText}>{errors.selectedSlots}</p>}
//           </div>
//         </div>
//         <form onSubmit={handleSubmit} style={styles.form}>
//             <div style={styles.buttonGroup}>
//                 <button type="button" onClick={onBack} disabled={isLoading || authLoading} style={styles.buttonOutline}>
//                 Back
//                 </button>
//                 <button type="submit" disabled={isLoading || authLoading} style={styles.buttonPrimary}>
//                 {isLoading ? "Saving..." : "Continue"}
//                 </button>
//             </div>
//         </form>
//       </div>
//     );
//   }

//   if (step === "complete") {
//     return (
//       <div style={styles.completeContainer}>
//         <div style={styles.checkIconContainer}>
//           <div style={styles.checkIconCircle}>
//             <CheckIcon style={styles.checkIconLarge} />
//           </div>
//         </div>
//         <div>
//           <h2 style={styles.heading}>You're All Set!</h2>
//           <p style={styles.description}>
//             Your teacher profile has been created. Start sharing your knowledge with eager students!
//           </p>
//         </div>
//         <button
//           onClick={handleCompleteOnboarding}
//           disabled={isLoading || authLoading}
//           style={{...styles.buttonPrimary, ...styles.buttonLarge}}
//         >
//           {isLoading ? "Loading..." : "Go to Dashboard"}
//         </button>
//       </div>
//     );
//   }

//   return null;
// };

// // --- Inline Styles Object ---
// const styles = {
//   container: {
//     maxWidth: '480px',
//     margin: '0 auto',
//     padding: '24px',
//     borderRadius: '8px',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//     backgroundColor: '#fff',
//     fontFamily: 'Inter, sans-serif',
//   },
//   completeContainer: {
//     maxWidth: '480px',
//     margin: '0 auto',
//     padding: '24px',
//     textAlign: 'center',
//     fontFamily: 'Inter, sans-serif',
//   },
//   heading: {
//     fontSize: '1.875rem',
//     fontWeight: '600',
//     color: '#1a202c',
//     marginBottom: '24px',
//   },
//   subheading: {
//     fontSize: '1.125rem',
//     fontWeight: '500',
//     color: '#2d3748',
//     marginBottom: '8px',
//   },
//   description: {
//     fontSize: '0.875rem',
//     color: '#4a5568',
//     marginTop: '8px',
//     marginBottom: '24px',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '16px',
//   },
//   formGroup: {
//     marginBottom: '10px',
//   },
//   label: {
//     display: 'block',
//     fontSize: '0.875rem',
//     fontWeight: '500',
//     color: '#4a5568',
//     marginBottom: '4px',
//   },
//   input: {
//     display: 'block',
//     width: '100%',
//     padding: '10px 12px',
//     borderRadius: '6px',
//     border: '1px solid #cbd5e0',
//     boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//     fontSize: '1rem',
//     outline: 'none',
//     transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
//   },
//   inputError: {
//     borderColor: '#ef4444',
//   },
//   textarea: {
//     display: 'block',
//     width: '100%',
//     padding: '10px 12px',
//     borderRadius: '6px',
//     border: '1px solid #cbd5e0',
//     boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//     fontSize: '1rem',
//     minHeight: '80px',
//     outline: 'none',
//     resize: 'vertical',
//     transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
//   },
//   buttonGroup: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     paddingTop: '16px',
//     gap: '16px',
//   },
//   buttonPrimary: {
//     backgroundColor: '#3b82f6',
//     color: '#fff',
//     padding: '10px 20px',
//     borderRadius: '6px',
//     border: 'none',
//     cursor: 'pointer',
//     fontSize: '1rem',
//     fontWeight: '500',
//     transition: 'background-color 0.2s ease, opacity 0.2s ease',
//     flexGrow: 1,
//   },
//   buttonOutline: {
//     backgroundColor: 'transparent',
//     color: '#4a5568',
//     padding: '10px 20px',
//     borderRadius: '6px',
//     border: '1px solid #cbd5e0',
//     cursor: 'pointer',
//     fontSize: '1rem',
//     fontWeight: '500',
//     transition: 'background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease',
//     flexGrow: 1,
//   },
//   buttonLarge: {
//     padding: '12px 24px',
//     fontSize: '1.125rem',
//     width: '100%',
//   },
//   errorText: {
//     color: '#ef4444',
//     fontSize: '0.875rem',
//     marginTop: '4px',
//   },
//   section: {
//     marginBottom: '24px',
//   },
//   skillsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
//     gap: '12px',
//   },
//   skillItem: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//   },
//   checkbox: {
//     height: '16px',
//     width: '16px',
//     borderRadius: '3px',
//     border: '1px solid #cbd5e0',
//     accentColor: '#3b82f6',
//     cursor: 'pointer',
//   },
//   skillLabel: {
//     fontSize: '0.875rem',
//     fontWeight: '500',
//     color: '#4a5568',
//   },
//   // Styles for displaying selected skills as tags
//   selectedSkillsContainer: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     gap: '8px',
//     marginTop: '10px',
//   },
//   skillTag: {
//     display: 'inline-flex',
//     alignItems: 'center',
//     backgroundColor: '#e0f2fe', // Light blue background
//     color: '#0369a1', // Darker blue text
//     padding: '6px 10px',
//     borderRadius: '16px', // Pill shape
//     fontSize: '0.85rem',
//     fontWeight: '500',
//     gap: '6px',
//     boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//   },
//   removeSkillButton: {
//     backgroundColor: 'transparent',
//     border: 'none',
//     color: '#0369a1',
//     cursor: 'pointer',
//     fontSize: '1rem',
//     lineHeight: '1',
//     padding: '0 2px',
//     marginLeft: '4px',
//     transition: 'color 0.2s ease',
//   },
//   'removeSkillButton:hover': { // This will need to be applied via a CSS file or CSS-in-JS for true hover
//     color: '#ef4444', // Red on hover
//   },
//   gridColumns: {
//     display: 'grid',
//     gridTemplateColumns: '1fr',
//     gap: '24px',
//   },
//   '@media (min-width: 768px)': {
//     gridColumns: {
//       gridTemplateColumns: '1fr 1fr',
//     },
//   },
//   calendarContainer: {
//     borderRadius: '6px',
//     border: '1px solid #cbd5e0',
//     overflow: 'hidden',
//   },
//   timeSlotsGrid: {
//     display: 'grid',
//     gridTemplateColumns: '1fr',
//     gap: '8px',
//   },
//   timeSlotItem: {
//     padding: '8px',
//     border: '1px solid #cbd5e0',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     transition: 'background-color 0.2s ease, border-color 0.2s ease',
//   },
//   timeSlotItemSelected: {
//     backgroundColor: '#eff6ff',
//     borderColor: '#3b82f6',
//   },
//   timeSlotContent: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   checkIcon: {
//     height: '16px',
//     width: '16px',
//     color: '#2563eb',
//   },
//   checkIconContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     marginBottom: '32px',
//   },
//   checkIconCircle: {
//     height: '96px',
//     width: '96px',
//     borderRadius: '9999px',
//     backgroundColor: '#d1fae5',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkIconLarge: {
//     height: '48px',
//     width: '48px',
//     color: '#047857',
//   },
//   loadingContainer: {
//       textAlign: 'center',
//       padding: '50px',
//       fontSize: '1.2rem',
//       color: '#4a5568',
//       fontFamily: 'Inter, sans-serif',
//   }
// };

// export default TeacherOnboarding;

import React, { useState, useCallback, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar"; // Assuming this component uses Tailwind internally or is styled separately
import { CheckIcon } from "lucide-react"; // Icon component
import { toast } from "sonner"; // Toast notification library

import { useAuth } from "../../contexts/AuthContext"; // Auth context hook

// --- Static Data for Time Slots and Skills ---
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

// --- TeacherOnboarding Component ---
const TeacherOnboarding = ({ step, onNext, onBack, onComplete }) => {
  // Destructure `api` (Axios instance), `user` (authenticated user data),
  // and `loading` (auth context loading state) from AuthContext.
  const { api, user: authUser, loading: authLoading } = useAuth();

  // State for form data
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    bio: "",
  });
  // State for teaching skills (array of strings)
  const [teachingSkills, setTeachingSkills] = useState([]);
  // State for custom skill input field
  const [customSkillInput, setCustomSkillInput] = useState("");
  // State for availability date
  const [date, setDate] = useState(new Date());
  // State for selected time slots (array of strings)
  const [selectedSlots, setSelectedSlots] = useState([]);

  // State for form validation errors
  const [errors, setErrors] = useState({});
  // State for loading/submission status
  const [isLoading, setIsLoading] = useState(false);

  // Effect to pre-fill form data if authUser exists and is loaded
  useEffect(() => {
    console.log("TeacherOnboarding mounted or re-rendered. Current step:", step);
    console.log("Current teachingSkills state in useEffect:", teachingSkills);
    console.log("Current formData state in useEffect:", formData);

    if (authUser && step === "info" && !authLoading) {
      console.log("Pre-filling form with authUser data:", authUser);
      setFormData((prev) => ({
        ...prev,
        fullName: authUser.name || "",
        phone: authUser.phoneNumber || "",
        bio: authUser.bio || "",
      }));
      setTeachingSkills(authUser.teachingSkills || []);
    }
  }, [authUser, authLoading, step]);

  // Handler for standard input changes (fullName, phone, bio)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // Clear error for this field
  };

  // Handler for custom skill input field changes
  const handleCustomSkillInputChange = (e) => {
    setCustomSkillInput(e.target.value);
  };

  // Handler for toggling predefined skill selection (checkboxes)
  const handleSkillToggle = useCallback((skillId) => {
    setTeachingSkills((prev) => {
      const newState = prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId];
      console.log("Skill Toggled. New teachingSkills state:", newState);
      return newState;
    });
    setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" })); // Clear skill error
  }, []);

  // Handler for removing a skill from the selected skills (tags)
  const handleRemoveSkill = useCallback((skillToRemove) => {
    setTeachingSkills((prev) => {
      const newState = prev.filter((skill) => skill !== skillToRemove);
      console.log("Skill Removed. New teachingSkills state:", newState);
      return newState;
    });
    setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" })); // Clear skill error
  }, []);

  // Handler for adding a custom skill
  const handleAddCustomSkill = useCallback(() => {
    const trimmedSkill = customSkillInput.trim();
    if (!trimmedSkill) {
      toast.error("Custom skill cannot be empty.");
      return;
    }
    // Check for duplicates (case-insensitive) among existing skills
    if (teachingSkills.includes(trimmedSkill.toLowerCase())) {
      toast.error("This skill has already been added.");
      return;
    }

    setTeachingSkills((prev) => {
      const newState = [...prev, trimmedSkill.toLowerCase()]; // Add in lowercase for consistency
      console.log("Custom Skill Added. New teachingSkills state:", newState);
      return newState;
    });
    setCustomSkillInput(""); // Clear the input field after adding
    setErrors((prevErrors) => ({ ...prevErrors, teachingSkills: "" })); // Clear skill error
  }, [customSkillInput, teachingSkills]);

  // Handler for toggling time slot selection
  const handleSlotToggle = useCallback((slot) => {
    setSelectedSlots((prev) => {
      const newState = prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot];
      console.log("Slot Toggled. New selectedSlots state:", newState);
      return newState;
    });
    setErrors((prevErrors) => ({ ...prevErrors, selectedSlots: "" })); // Clear slot error
  }, []);

  // Handler for calendar date selection
  const handleDateSelect = useCallback((selectedDate) => {
    if (selectedDate instanceof Date) {
      setDate(selectedDate);
      console.log("Date Selected. New date state:", selectedDate);
      setErrors((prevErrors) => ({ ...prevErrors, date: "" })); // Clear date error
    }
  }, []);

  // Form validation logic based on the current step
  const validateForm = (currentStep) => {
    let isValid = true;
    const newErrors = {};

    console.group(`--- validateForm called for step: ${currentStep} ---`);
    console.log("Initial isValid:", isValid);
    console.log("Current teachingSkills (inside validateForm):", teachingSkills);
    console.log("Length of teachingSkills (inside validateForm):", teachingSkills.length);
    console.log("Current formData (inside validateForm):", formData);
    console.log("Current date (inside validateForm):", date);
    console.log("Current selectedSlots (inside validateForm):", selectedSlots);


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
      console.log("Entering expertise validation block.");
      if (teachingSkills.length === 0) { // Must select or add at least one skill
        newErrors.teachingSkills = "Please select or add at least one skill.";
        isValid = false;
        console.log("Validation: teachingSkills length is 0. Setting isValid to false.");
      } else {
        console.log("Validation: teachingSkills length is NOT 0. Proceeding.");
      }
    } else if (currentStep === "availability") {
        if (!date) { // A date must be selected
            newErrors.date = "Please select a date for your availability.";
            isValid = false;
        }
        if (selectedSlots.length === 0) { // At least one time slot must be selected
            newErrors.selectedSlots = "Please select at least one time slot.";
            isValid = false;
        }
    }

    setErrors(newErrors);
    console.log("Errors after setErrors (inside validateForm):", newErrors);
    console.log("Final isValid for step", currentStep, ":", isValid);
    console.groupEnd();
    return isValid;
  };

  // Main submission handler for each step of the onboarding
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    const currentStep = step;

    console.log(`--- handleSubmit called for step: ${currentStep} ---`);

    // First, run client-side validation
    if (!validateForm(currentStep)) {
        console.log("handleSubmit: validateForm returned FALSE. Stopping submission.");
        toast.error("Please correct the errors in the form before continuing.");
        return; // Halt execution if validation fails
    }

    console.log("handleSubmit: validateForm returned TRUE. Proceeding to API call.");
    setIsLoading(true); // Show loading indicator

    try {
      let dataToSend = {}; // Data payload for the API request
      let endpoint = "";   // API endpoint for the current step

      // Determine the data and endpoint based on the current step
      if (currentStep === "info") {
        dataToSend = {
          name: formData.fullName,
          phoneNumber: formData.phone,
          bio: formData.bio,
        };
        endpoint = "/auth/profile"; // Endpoint for general profile updates
      } else if (currentStep === "expertise") {
        dataToSend = {
          teachingSkills: teachingSkills, // Array of selected skills
        };
        endpoint = "/auth/profile/teaching-skills"; // Endpoint for teaching skills update
        console.log("handleSubmit: Data to send for expertise:", dataToSend);
      } else if (currentStep === "availability") {
        dataToSend = {
          date: date.toISOString(), // Convert Date object to ISO string
          slots: selectedSlots,    // Array of selected time slots
        };
        endpoint = "/auth/profile/availability"; // Endpoint for availability update
      }

      console.log(`handleSubmit: Making API call to ${endpoint} with data:`, dataToSend);
      // Use the `api` Axios instance from AuthContext. It handles `withCredentials: true` automatically.
      const response = await api.patch(endpoint, dataToSend);
      console.log("handleSubmit: API call successful! Response data:", response.data);

      toast.success("Information saved successfully!"); // Show success toast
      onNext(); // Advance to the next step in the onboarding process

    } catch (error) {
      // Axios errors have a `response` object containing details from the backend
      console.error("handleSubmit: Onboarding step failed in try/catch block:", error.response?.data || error.message, error);
      toast.error(error.response?.data?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Always reset loading state
      console.log("handleSubmit: Exiting finally block.");
    }
  };

  // Handler for when the entire onboarding flow is completed
  const handleCompleteOnboarding = async () => {
      setIsLoading(true); // Show loading indicator
      try {
          // Send a PATCH request to mark the teacher onboarding as complete
          // Assumes you have a `teacherOnboardingComplete` boolean field in your User schema
          await api.patch("/auth/profile", { teacherOnboardingComplete: true });

          toast.success("Onboarding complete! Welcome to the teacher community.");
          onComplete(); // Call the parent's onComplete prop to navigate to the dashboard
      } catch (error) {
          console.error("Finalizing onboarding failed:", error.response?.data || error.message, error);
          toast.error(error.response?.data?.message || "Failed to finalize onboarding. Please try again.");
      } finally {
          setIsLoading(false); // Always reset loading state
      }
  };

  // --- Render based on AuthContext loading status ---
  // If AuthContext is still loading initial user data, show a loading message
  if (authLoading) {
      return <div className="text-center p-12 text-lg text-gray-600 font-inter">Loading User Data...</div>;
  }

  // --- Conditional Rendering for Each Onboarding Step UI ---
  // Each step's UI is rendered using Tailwind CSS classes.

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

          {/* Custom Skill Input */}
          <div className="mt-5 mb-2">
            <label htmlFor="customSkill" className="block text-sm font-medium text-gray-700 mb-1">Add Custom Skill</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    id="customSkill"
                    value={customSkillInput}
                    onChange={handleCustomSkillInputChange}
                    placeholder="e.g., Chess Coaching"
                    className="block w-full p-2 rounded-md border shadow-sm text-base outline-none transition-all duration-200 ease-in-out flex-grow
                      border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="bg-blue-500 text-white py-2 px-3 rounded-md border-none cursor-pointer text-sm font-medium transition-all duration-200 ease-in-out hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add
                </button>
            </div>
          </div>

          {/* Display Selected Skills (Tags) */}
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
        <p className="text-sm text-gray-600 mb-6">
          Select dates and time slots when you're available to teach.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">Select Dates</h3>
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
                  onClick={() => handleSlotToggle(slot)}
                  className={`p-2 border rounded-md cursor-pointer transition-colors duration-200 ease-in-out
                    ${selectedSlots.includes(slot) ? "bg-blue-50 border-blue-500" : "hover:bg-gray-50 border-gray-300"}`}
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
            {errors.selectedSlots && <p className="text-red-500 text-sm mt-1">{errors.selectedSlots}</p>}
          </div>
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

  return null; // Render nothing if 'step' prop doesn't match
};

export default TeacherOnboarding;
