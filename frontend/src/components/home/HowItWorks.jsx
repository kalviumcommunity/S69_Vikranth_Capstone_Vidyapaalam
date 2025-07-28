import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, MessageCircle, UserCheck, IndianRupee, ChevronLeft, ChevronRight, Users, GraduationCap, DollarSign, Star, Video, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const primaryColor = "orange-500";
const secondaryColor = "blue-500";
const lightBg = "white";

const studentSteps = [
  {
    icon: <BookOpen className="h-10 w-10 text-orange-500" />,
    title: "Discover Skills",
    description: "Browse through hundreds of skills taught by verified mentors from around the globe",
    color: "from-orange-200 to-orange-100",
    bgColor: "bg-orange-50"
  },
  {
    icon: <UserCheck className="h-10 w-10 text-blue-500" />,
    title: "Find Your Mentor",
    description: "Use AI-powered matching to find mentors that align with your learning style and goals",
    color: "from-blue-200 to-blue-100",
    bgColor: "bg-blue-50"
  },
  {
    icon: <Video className="h-10 w-10 text-orange-500" />,
    title: "Book & Learn",
    description: "Schedule video sessions, join live classes, and get personalized guidance",
    color: "from-orange-200 to-orange-100",
    bgColor: "bg-orange-50"
  },
  {
    icon: <Star className="h-10 w-10 text-blue-500" />,
    title: "Track Progress",
    description: "Monitor your learning journey, earn certificates, and rate your mentors",
    color: "from-blue-200 to-blue-100",
    bgColor: "bg-blue-50"
  }
];

const mentorSteps = [
  {
    icon: <Settings className="h-10 w-10 text-orange-500" />,
    title: "Create Profile",
    description: "Set up your mentor profile with skills, experience, and teaching preferences",
    color: "from-orange-200 to-orange-100",
    bgColor: "bg-orange-50"
  },
  {
    icon: <Calendar className="h-10 w-10 text-blue-500" />,
    title: "Set Availability",
    description: "Define your schedule, set hourly rates, and choose your teaching methods",
    color: "from-blue-200 to-blue-100",
    bgColor: "bg-blue-50"
  },
  {
    icon: <Users className="h-10 w-10 text-orange-500" />,
    title: "Connect with Students",
    description: "Get matched with students, conduct video sessions, and share your expertise",
    color: "from-orange-200 to-orange-100",
    bgColor: "bg-orange-50"
  },
  {
    icon: < IndianRupee className="h-10 w-10 text-blue-500" />,
    title: "Earn & Grow",
    description: "Receive payments securely, build your reputation, and expand your student base",
    color: "from-blue-200 to-blue-100",
    bgColor: "bg-blue-50"
  }
];

const HowItWorks = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState("student");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const currentSteps = userType === "student" ? studentSteps : mentorSteps;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentStep(prev => (prev + 1) % currentSteps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSteps.length]);

  const slideVariants = {
    enter: direction => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: direction => ({ x: direction < 0 ? 1000 : -1000, opacity: 0 })
  };


  return (
    <div className="py-16 bg-white">
      <motion.div className="text-center mb-16">
        <h2 className="text-5xl font-bold mb-8">How It Works</h2>
        <div className="inline-flex p-2 rounded-2xl border mb-8">
          <button
            onClick={() => setUserType("student")}
            className={`px-6 py-2 rounded-xl font-semibold ${
              userType === "student" ? "bg-orange-500 text-white" : "text-gray-500 hover:text-black"
            }`}
          >
            <GraduationCap className="w-5 h-5 inline-block mr-2" /> For Students
          </button>
          <button
            onClick={() => setUserType("mentor")}
            className={`px-6 py-2 rounded-xl font-semibold ${
              userType === "mentor" ? "bg-blue-500 text-white" : "text-gray-500 hover:text-black"
            }`}
          >
            <Users className="w-5 h-5 inline-block mr-2" /> For Mentors
          </button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="relative h-[500px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={`${userType}-${currentStep}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className={`rounded-3xl p-10 border shadow-xl ${currentSteps[currentStep].bgColor}`}>
                <div className="text-center">
                  <div className="inline-block px-4 py-2 text-sm text-gray-500 mb-6">
                    Step {currentStep + 1} of {currentSteps.length}
                  </div>
                  <div className={`w-20 h-20 mx-auto mb-6 p-5 bg-gradient-to-br ${currentSteps[currentStep].color} rounded-2xl`}> 
                    {currentSteps[currentStep].icon}
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{currentSteps[currentStep].title}</h3>
                  <p className="text-gray-600 max-w-xl mx-auto">{currentSteps[currentStep].description}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button onClick={() => setCurrentStep((currentStep - 1 + currentSteps.length) % currentSteps.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white border rounded-full shadow hover:scale-110 transition">
            <ChevronLeft />
          </button>
          <button onClick={() => setCurrentStep((currentStep + 1) % currentSteps.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white border rounded-full shadow hover:scale-110 transition">
            <ChevronRight />
          </button>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 text-sm"
          >
            {isAutoPlaying ? "⏸️ Pause Auto-play" : "▶️ Resume Auto-play"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
