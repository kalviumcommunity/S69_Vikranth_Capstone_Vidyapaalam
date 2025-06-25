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
import { toast } from "sonner";

const OnboardingPage = () => {
  const { api, fetchUser, user: authUser, loading: authLoading } = useAuth();
  const [role, setRole] = useState(null);
  const [step, setStep] = useState("role");
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
    if (!authLoading && authUser) {
      if (authUser.role && !role) {
        setRole(authUser.role);
      }

      const params = new URLSearchParams(location.search);
      const calendarAuthStatus = params.get('calendarAuthStatus');
      const nextStepParam = params.get('nextStep');

      if (calendarAuthStatus === 'success' && nextStepParam === 'availability') {
        if (authUser.role === 'teacher' || !role) {
          if (!role) setRole('teacher');
          handleSetStep('availability');
          const newSearchParams = new URLSearchParams(location.search);
          newSearchParams.delete('calendarAuthStatus');
          newSearchParams.delete('error');
          newSearchParams.delete('nextStep');
          navigate({ search: newSearchParams.toString() }, { replace: true });
        }
      } else if (authUser.role) {
        if (authUser.role === 'student') {
            if (authUser.bio && authUser.phoneNumber && authUser.interestedSkills?.length > 0) {
                handleSetStep('complete');
            } else if (authUser.bio && authUser.phoneNumber) {
                handleSetStep('interests');
            } else {
                handleSetStep('info');
            }
        } else if (authUser.role === 'teacher') {
            if (authUser.bio && authUser.phoneNumber && authUser.teachingSkills?.length > 0 && authUser.googleCalendar?.connected) {
                handleSetStep('complete');
            } else if (authUser.bio && authUser.phoneNumber && authUser.teachingSkills?.length > 0) {
                handleSetStep('availability');
            } else if (authUser.bio && authUser.phoneNumber) {
                handleSetStep('expertise');
            } else {
                handleSetStep('info');
            }
        } else {
            handleSetStep('role');
        }
      }
    }
  }, [authUser, authLoading, location.search, navigate, role, handleSetStep]);

  const handleRoleSelect = async (selectedRole) => {
    const backendRole = roleMap[selectedRole];
    try {
      await api.patch("/auth/profile/role", { role: backendRole });
      await fetchUser();

      setRole(selectedRole);
      setStep("info");
    } catch (err) {
      console.error("Failed to save role:", err);
      // Changed from alert to toast.error
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
    if (role === "student") navigate("/student/overview");
    else navigate("/teacher/overview");
  };

  const stepLabels = {
    role: "Choose Role",
    info: "Basic Information",
    interests: "Interests",
    expertise: "Expertise",
    availability: "Availability",
    complete: "Complete",
  };
  const progressMap = {
    role: "20%",
    info: "40%",
    interests: "60%",
    expertise: "60%",
    availability: "80%",
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

            {step !== "role" && role === "student" && (
              <StudentOnboarding
                step={step}
                onNext={handleNext}
                onBack={handleBack}
                onComplete={handleComplete}
              />
            )}

            {step !== "role" && role === "teacher" && (
              <TeacherOnboarding
                step={step}
                onNext={handleNext}
                onBack={handleBack}
                onComplete={handleComplete}
                onSetStep={handleSetStep}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
