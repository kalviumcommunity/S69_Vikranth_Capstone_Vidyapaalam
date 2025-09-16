import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext.jsx";
import RoleSelection from "./RoleSelection.jsx";
import StudentOnboarding from "./StudentOnboarding.jsx";
import TeacherOnboarding from "./TeacherOnboarding.jsx";
import { toast } from "sonner";

const OnboardingPage = () => {
    const { fetchUser, user: authUser, loading: authLoading, updateRole } = useAuth();
    const [role, setRole] = useState(null);
    const [step, setStep] = useState("role");
    const navigate = useNavigate();

    const roleMap = {
        student: "student",
        teacher: "teacher",
    };

    useEffect(() => {
        if (authLoading) {
            return; // Still loading auth, do nothing
        }

        if (!authUser) {
            // If no authenticated user, always go back to role selection
            if (step !== "role") {
                setStep("role");
            }
            setRole(null); // Clear local role state if no authUser
            return;
        }

        // If authUser exists, and their onboarding is complete, navigate away
        // This should happen before any step determination
        if (authUser.teacherOnboardingComplete || authUser.studentOnboardingComplete) {
            if (authUser.role === "student") {
                navigate("/student/overview", { replace: true });
            } else if (authUser.role === "teacher") {
                navigate("/teacher/overview", { replace: true });
            }
            return; // Exit if already complete and navigated
        }

        // Set local role state based on authUser.role if it's available and different
        if (authUser.role && role !== authUser.role) {
            setRole(authUser.role);
        }

        // Determine the target step based on current authUser data
        let targetStepBasedOnAuth = "role"; // Default to role selection

        if (authUser.role) {
            if (authUser.role === 'student') {
                if (!authUser.bio || !authUser.phoneNumber) {
                    targetStepBasedOnAuth = 'info';
                } else if (!authUser.interestedSkills || authUser.interestedSkills.length === 0) {
                    targetStepBasedOnAuth = 'interests';
                } else {
                    targetStepBasedOnAuth = 'complete';
                }
            } else if (authUser.role === 'teacher') {
                if (!authUser.bio || !authUser.phoneNumber) {
                    targetStepBasedOnAuth = 'info';
                } else if (!authUser.teachingSkills || authUser.teachingSkills.length === 0) {
                    targetStepBasedOnAuth = 'expertise';
                } else if (!authUser.availability || authUser.availability.length === 0) {
                    targetStepBasedOnAuth = 'availability';
                } else {
                    targetStepBasedOnAuth = 'complete';
                }
            }
        }

        // Only update the step if it needs to advance or if we are at 'role' and need to move on
        const orderedSteps = ['role', 'info', 'interests', 'expertise', 'availability', 'complete'];
        const currentIndex = orderedSteps.indexOf(step);
        const targetIndex = orderedSteps.indexOf(targetStepBasedOnAuth);

        // Advance the step if the target step is further along,
        // or if we are currently at 'role' and the target is not 'role' (meaning a role was just selected)
        if (targetIndex > currentIndex || (step === 'role' && targetStepBasedOnAuth !== 'role')) {
            setStep(targetStepBasedOnAuth);
        }

    }, [authUser, authLoading, navigate, role, fetchUser, step]); // Keep all dependencies

    // Removed the empty useEffect here as it serves no purpose.
    // useEffect(() => {}, [step]);


    const handleRoleSelect = async (selectedRole) => {
        const backendRole = roleMap[selectedRole];
        try {
            await updateRole(backendRole);
            await fetchUser(); // Re-fetch user to get the updated role and trigger useEffect
            toast.success("Role saved successfully!");
        } catch (err) {
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
        if (step === "info") {
            setStep("role");
        }
        else if (role === "student" && step === "interests") {
            setStep("info");
        }
        else if (role === "teacher") {
            if (step === "expertise") {
                setStep("info");
            }
            else if (step === "availability") {
                setStep("expertise");
            }
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
                                authUser={authUser}
                            />
                        )}

                        {step !== "role" && role === "teacher" && (
                            <TeacherOnboarding
                                step={step}
                                onNext={handleNext}
                                onBack={handleBack}
                                onComplete={handleComplete}
                                authUser={authUser}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default OnboardingPage;
