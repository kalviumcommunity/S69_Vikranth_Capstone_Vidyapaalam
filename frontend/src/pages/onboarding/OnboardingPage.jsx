// // src/pages/onboarding/OnboardingPage.jsx

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useAuth } from "../../contexts/AuthContext.jsx";
// import RoleSelection from "./RoleSelection.jsx";
// import StudentOnboarding from "./StudentOnboarding.jsx";
// import TeacherOnboarding from "./TeacherOnboarding.jsx";

// const OnboardingPage = () => {
//   const { api, fetchUser } = useAuth();  // grab fetchUser as well
//   const [role, setRole] = useState(null);
//   const [step, setStep] = useState("role");
//   const navigate = useNavigate();

//   // Map front-end role to backend role enum
//   const roleMap = {
//     student: "student",
//     teacher: "teacher",
//   };

//   const handleRoleSelect = async (selectedRole) => {
//     const backendRole = roleMap[selectedRole];
//     try {
//     await api.patch("/auth/profile/role", { role: backendRole });
//       await fetchUser();

//       setRole(selectedRole);
//       setStep("info");
//     } catch (err) {
//       console.error("Failed to save role:", err);
//       alert("Could not save role. Please try again.");
//     }
//   };

//   const handleNext = () => {
//     if (role === "student") {
//       if (step === "info") setStep("interests");
//       else if (step === "interests") setStep("complete");
//     } else if( role === "teacher") {
//       if (step === "info") setStep("expertise");
//       else if (step === "expertise") setStep("availability");
//       else if (step === "availability") setStep("complete");
//     }
//   };

//   const handleBack = () => {
//     if (step === "info") setStep("role");
//     else if (role === "student" && step === "interests") setStep("info");
//     else if (role === "teacher") {
//       if (step === "expertise") setStep("info");
//       else if (step === "availability") setStep("expertise");
//     }
//   };

//   const handleComplete = () => {
//     if (role === "student") navigate("/student/overview");
//     else navigate("/teacher/overview");
//   };

//   const stepLabels = {
//     role: "Choose Role",
//     info: "Basic Information",
//     interests: "Interests",
//     expertise: "Expertise",
//     availability: "Availability",
//     complete: "Complete",
//   };
//   const progressMap = {
//     role: "20%",
//     info: "40%",
//     interests: "60%",
//     expertise: "60%",
//     availability: "80%",
//     complete: "100%",
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-16 px-4">
//       <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        
//         <header className="mb-12 text-center">
//           <motion.h1
//             className="text-4xl font-extrabold text-gray-900 mb-4"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             Welcome to VidyaPaalam
//           </motion.h1>
//           <motion.p
//             className="text-lg text-gray-600 leading-relaxed"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//           >
//             Let's set up your profile to get started.
//           </motion.p>
//         </header>

//         <div className="mb-10">
//           <div className="flex justify-between mb-3">
//             <span className="text-lg font-semibold text-gray-800">
//               {stepLabels[step]}
//             </span>
//             <span className="text-sm text-gray-500">
//               {step === "complete"
//                 ? ""
//                 : `Step ${Object.keys(progressMap).indexOf(step) + 1} of ${
//                     role === "teacher" ? 5 : 4
//                   }`}
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-3">
//             <motion.div
//               className="bg-blue-600 h-3 rounded-full"
//               initial={{ width: 0 }}
//               animate={{ width: progressMap[step] }}
//               transition={{ duration: 0.5 }}
//             />
//           </div>
//         </div>

//         <AnimatePresence mode="wait">
//           <motion.div
//             key={step}
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.3 }}
//           >
//             {step === "role" && (
//               <RoleSelection onSelectRole={handleRoleSelect} />
//             )}

//             {step !== "role" && role === "student" && (
//               <StudentOnboarding
//                 step={step}
//                 onNext={handleNext}
//                 onBack={handleBack}
//                 onComplete={handleComplete}
//               />
//             )}

//             {step !== "role" && role === "teacher" && (
//               <TeacherOnboarding
//                 step={step}
//                 onNext={handleNext}
//                 onBack={handleBack}
//                 onComplete={handleComplete}
//               />
//             )}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default OnboardingPage;

// src/pages/onboarding/OnboardingPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext.jsx";
import RoleSelection from "./RoleSelection.jsx";
import StudentOnboarding from "./StudentOnboarding.jsx";
import TeacherOnboarding from "./TeacherOnboarding.jsx";
import { toast } from "sonner"; // Ensure toast is imported

const OnboardingPage = () => {
  const { api, fetchUser, user: authUser, loading: authLoading } = useAuth();
  const [role, setRole] = useState(null);
  const [step, setStep] = useState("role"); // Default step is 'role'
  const navigate = useNavigate();
  const location = useLocation();

  const roleMap = {
    student: "student",
    teacher: "teacher",
  };

  const handleSetStep = useCallback((newStep) => {
    setStep(newStep);
  }, []);

  useEffect(() => {
    // This useEffect handles initial step determination based on auth status and URL params.
    // It runs on component mount and whenever its dependencies change.

    // If authUser data is still loading, do nothing and wait.
    if (authLoading) {
      return;
    }

    // --- PRIORITY 1: Handle users who have already completed onboarding ---
    // If the user object exists and their onboarding is marked complete in the backend,
    // redirect them directly to their respective dashboard.
    if (authUser && (authUser.teacherOnboardingComplete || authUser.studentOnboardingComplete)) {
      console.log("OnboardingPage: User already onboarded. Redirecting to dashboard.");
      if (authUser.role === 'student') {
        navigate("/student/overview", { replace: true });
      } else if (authUser.role === 'teacher') {
        navigate("/teacher/overview", { replace: true });
      }
      return; // Exit early as user is already onboarded
    }

    // --- PRIORITY 2: Handle Google Calendar redirect ---
    // Check if the current URL contains parameters from a Google Calendar OAuth callback.
    const params = new URLSearchParams(location.search);
    const calendarAuthStatus = params.get('calendarAuthStatus');
    const nextStepParam = params.get('nextStep');

    if (calendarAuthStatus === 'success' && nextStepParam === 'availability') {
      // If we are redirected from a successful Google Calendar connection
      // AND the `nextStep` parameter specifically indicates 'availability'.

      // Ensure the local 'role' state is explicitly set to 'teacher'.
      // This is crucial for OnboardingPage to render the TeacherOnboarding component,
      // as its rendering is conditional on `role === 'teacher'`.
      if (role !== 'teacher') {
        setRole('teacher');
      }

      // Immediately set the current step to 'availability' in the parent component's state.
      handleSetStep('availability');

      // Clean up the URL parameters to prevent this logic from re-firing
      // on subsequent renders or if the user refreshes the page.
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.delete('calendarAuthStatus');
      newSearchParams.delete('error');
      newSearchParams.delete('nextStep');
      navigate({ search: newSearchParams.toString() }, { replace: true });

      // After handling this specific redirect, exit the useEffect early.
      // This prevents the "Normal Onboarding Flow" logic from overriding the desired step.
      return;
    }
    // --- END PRIORITY 2 LOGIC ---


    // --- PRIORITY 3: Normal Onboarding Flow (runs if not a calendar redirect and not fully onboarded) ---
    // This block determines the starting step for users based on their existing profile data.
    if (authUser) {
      // If the authenticated user has a role assigned from the backend
      // and the local `role` state hasn't been set yet (e.g., initial load).
      if (authUser.role && !role) {
        setRole(authUser.role); // Set the local role state.
      }

      // Determine the current step based on the authenticated user's profile completeness.
      // This ensures that returning users don't start from the beginning.
      if (authUser.role === 'student') {
          // Student onboarding steps: info -> interests -> complete
          if (!authUser.name || !authUser.phoneNumber || !authUser.bio) {
              handleSetStep('info');
          } else if (!authUser.interestedSkills || authUser.interestedSkills.length === 0) {
              handleSetStep('interests');
          } else {
              // If all student-specific fields are filled, mark as complete.
              handleSetStep('complete');
          }
      } else if (authUser.role === 'teacher') {
          // Teacher onboarding steps: info -> expertise -> availability -> complete
          if (!authUser.name || !authUser.phoneNumber || !authUser.bio) {
              handleSetStep('info');
          } else if (!authUser.teachingSkills || authUser.teachingSkills.length === 0) {
              handleSetStep('expertise');
          } else if (!authUser.googleCalendar?.connected) { // Check for Google Calendar connection
              handleSetStep('availability');
          } else if (!authUser.availability?.slots || authUser.availability.slots.length === 0) { // Check for availability slots
              handleSetStep('availability');
          } else {
              // If all teacher-specific fields are filled, mark as complete.
              handleSetStep('complete');
          }
      } else {
          // If authUser exists but has no recognized role, or if it's a new user,
          // direct them to the role selection.
          handleSetStep('role');
      }
    }
    // Note: If authUser is null (user not logged in), the component will naturally
    // remain at the default `step` of "role" because `authUser` condition above won't be met.
  }, [authUser, authLoading, location.search, navigate, role, handleSetStep, fetchUser]);

  const handleRoleSelect = async (selectedRole) => {
    const backendRole = roleMap[selectedRole];
    try {
      await api.patch("/auth/profile/role", { role: backendRole });
      await fetchUser(); // Refetch user to update AuthContext with new role

      setRole(selectedRole);
      setStep("info"); // Always go to info after role selection
    } catch (err) {
      console.error("Failed to save role:", err);
      toast.error("Could not save role. Please try again.");
    }
  };

  const handleNext = () => {
    if (role === "student") {
      if (step === "info") setStep("interests");
      else if (step === "interests") setStep("complete");
    } else if (role === "teacher") {
      if (step === "info") setStep("expertise");
      else if (step === "expertise") setStep("availability");
      else if (step === "availability") setStep("complete");
    }
  };

  const handleBack = () => {
    if (step === "info") setStep("role");
    else if (role === "student" && step === "interests") setStep("info");
    else if (role === "teacher") {
      if (step === "expertise") setStep("info");
      else if (step === "availability") setStep("expertise");
    }
  };

  const handleComplete = () => {
    // This function is called when the final step's "Complete" button is clicked.
    // It should navigate the user to their respective dashboard.
    if (role === "student") navigate("/student/overview");
    else navigate("/teacher/overview");
  };

  const stepLabels = {
    role: "Choose Role",
    info: "Basic Information",
    interests: "Interests", // Student-specific
    expertise: "Expertise", // Teacher-specific
    availability: "Availability", // Teacher-specific
    complete: "Complete",
  };
  const progressMap = {
    role: "20%",
    info: "40%",
    interests: "60%",
    expertise: "60%", // Teacher step 2
    availability: "80%", // Teacher step 3
    complete: "100%",
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-xl text-gray-700">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        
        <header className="mb-12 text-center">
          <motion.h1
            className="text-4xl font-extrabold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to VidyaPaalam
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Let's set up your profile to get started.
          </motion.p>
        </header>

        <div className="mb-10">
          <div className="flex justify-between mb-3">
            <span className="text-lg font-semibold text-gray-800">
              {stepLabels[step]}
            </span>
            <span className="text-sm text-gray-500">
              {step === "complete"
                ? ""
                : `Step ${Object.keys(progressMap).indexOf(step) + 1} of ${
                    role === "teacher" ? 5 : 4
                  }`}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-blue-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: progressMap[step] }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === "role" && (
              <RoleSelection onSelectRole={handleRoleSelect} />
            )}

            {/* Render StudentOnboarding if role is student */}
            {step !== "role" && role === "student" && (
              <StudentOnboarding
                step={step}
                onNext={handleNext}
                onBack={handleBack}
                onComplete={handleComplete}
                onSetStep={handleSetStep} // Keep this for consistency, though student onboarding might not use it
              />
            )}

            {/* Render TeacherOnboarding if role is teacher */}
            {step !== "role" && role === "teacher" && (
              <TeacherOnboarding
                step={step}
                onNext={handleNext}
                onBack={handleBack}
                onComplete={handleComplete}
                onSetStep={handleSetStep} // THIS IS CRUCIAL FOR TEACHERONBOARDING TO JUMP STEPS
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
