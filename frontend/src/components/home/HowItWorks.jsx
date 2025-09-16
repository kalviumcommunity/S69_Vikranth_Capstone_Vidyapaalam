import React from "react";
import { BookOpen, UserCheck, ChevronLeft, ChevronRight, Users, GraduationCap, IndianRupee, Star, Video, Settings, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const studentSteps = [
  {
    icon: <BookOpen className="h-12 w-12 text-indigo-600" />,
    title: "Discover Skills",
    description: "Explore a vast library of skills taught by verified mentors from across the globe.",
    color: "from-indigo-600/20 to-indigo-300/10",
    bgColor: "bg-indigo-50/90"
  },
  {
    icon: <UserCheck className="h-12 w-12 text-teal-600" />,
    title: "Find Your Mentor",
    description: "Leverage AI-powered matching to connect with mentors tailored to your learning style and goals.",
    color: "from-teal-600/20 to-teal-300/10",
    bgColor: "bg-teal-50/90"
  },
  {
    icon: <Video className="h-12 w-12 text-indigo-600" />,
    title: "Book & Learn",
    description: "Schedule interactive video sessions, join live classes, and receive personalized guidance.",
    color: "from-indigo-600/20 to-indigo-300/10",
    bgColor: "bg-indigo-50/90"
  },
  {
    icon: <Star className="h-12 w-12 text-teal-600" />,
    title: "Track Progress",
    description: "Monitor your learning journey, earn certificates, and provide feedback on your mentors.",
    color: "from-teal-600/20 to-teal-300/10",
    bgColor: "bg-teal-50/90"
  },
];

const mentorSteps = [
  {
    icon: <Settings className="h-12 w-12 text-indigo-600" />,
    title: "Create Profile",
    description: "Build a professional mentor profile showcasing your skills, experience, and teaching approach.",
    color: "from-indigo-600/20 to-indigo-300/10",
    bgColor: "bg-indigo-50/90"
  },
  {
    icon: <Calendar className="h-12 w-12 text-teal-600" />,
    title: "Set Availability",
    description: "Define your schedule, set hourly rates, and choose your teaching methods.",
    color: "from-teal-600/20 to-teal-300/10",
    bgColor: "bg-teal-50/90"
  },
  {
    icon: <Users className="h-12 w-12 text-indigo-600" />,
    title: "Connect with Students",
    description: "Get matched with eager learners, conduct engaging video sessions, and share your expertise.",
    color: "from-indigo-600/20 to-indigo-300/10",
    bgColor: "bg-indigo-50/90"
  },
  {
    icon: <IndianRupee className="h-12 w-12 text-teal-600" />,
    title: "Earn & Grow",
    description: "Securely receive payments, build your reputation, and grow your student community.",
    color: "from-teal-600/20 to-teal-300/10",
    bgColor: "bg-teal-50/90"
  },
];

const HowItWorks = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState('student');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const currentSteps = userType === 'student' ? studentSteps : mentorSteps;

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentStep((prev) => (prev + 1) % currentSteps.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSteps.length]);

  const nextStep = () => {
    setDirection(1);
    setCurrentStep((prev) => (prev + 1) % currentSteps.length);
    setIsAutoPlaying(false);
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => (prev - 1 + currentSteps.length) % currentSteps.length);
    setIsAutoPlaying(false);
  };

  const goToStep = (index) => {
    setDirection(index > currentStep ? 1 : -1);
    setCurrentStep(index);
    setIsAutoPlaying(false);
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setCurrentStep(0);
    setIsAutoPlaying(true);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 800 : -800,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 800 : -800,
      opacity: 0,
      scale: 0.9
    })
  };

  return (
    <div className="py-16 sm:py-24 bg-white relative overflow-hidden min-h-screen">
      {/* Decorative background bubbles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-orange-100 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>

      {/* Header with User Type Toggle */}
      <motion.div 
        className="text-center mb-12 sm:mb-16 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 sm:mb-8 tracking-tight">
          How It Works
        </h2>
        
        {/* User Type Selector */}
        <div className="inline-flex bg-white/90 backdrop-blur-lg p-2 rounded-full border border-gray-200 shadow-sm mb-8">
          <button
            onClick={() => handleUserTypeChange('student')}
            className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 text-sm sm:text-base ${
              userType === 'student'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-100/50'
            }`}
            aria-label="View steps for students"
          >
            <GraduationCap className="w-5 h-5" />
            For Students
          </button>
          <button
            onClick={() => handleUserTypeChange('mentor')}
            className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 text-sm sm:text-base ${
              userType === 'mentor'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20'
                : 'text-gray-600 hover:text-teal-600 hover:bg-teal-100/50'
            }`}
            aria-label="View steps for mentors"
          >
            <Users className="w-5 h-5" />
            For Mentors
          </button>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">

        <div className="relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px]" style={{ perspective: '1000px' }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={`${userType}-${currentStep}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 25 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 }
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-full max-w-2xl sm:max-w-3xl">
                <div className={`${currentSteps[currentStep].bgColor} bg-white/95 backdrop-blur-lg rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-100/50 shadow-lg ring-1 ring-gray-100/20`}>
                  <div className="text-center">
                    {/* Step Indicator */}
                    <div className="inline-flex items-center gap-2 bg-white/90 rounded-full px-3 py-1 sm:px-4 sm:py-2 mb-6 sm:mb-8 shadow-sm">
                      <span className="text-sm font-medium text-gray-600">
                        Step {currentStep + 1} of {currentSteps.length}
                      </span>
                    </div>

                    
                    <motion.div
                      className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 p-4 sm:p-5 bg-gradient-to-br ${currentSteps[currentStep].color} rounded-xl shadow-md`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {currentSteps[currentStep].icon}
                    </motion.div>

                    
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
                      {currentSteps[currentStep].title}
                    </h3>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto">
                      {currentSteps[currentStep].description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

         
          <button
            onClick={prevStep}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-lg hover:bg-white border border-gray-200 rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            aria-label="Previous step"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
          </button>
          <button
            onClick={nextStep}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-lg hover:bg-white border border-gray-200 rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            aria-label="Next step"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
          </button>
        </div>

        
        <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-10">
          {currentSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentStep
                  ? `w-8 sm:w-10 h-2 sm:h-3 ${userType === 'student' ? 'bg-indigo-600' : 'bg-teal-600'}`
                  : 'w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        
        <motion.div 
          className="text-center mt-8 sm:mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="px-4 sm:px-5 py-2 border border-gray-200 rounded-full bg-white/90 hover:bg-indigo-100/50 backdrop-blur-lg text-gray-700 font-medium text-sm sm:text-base transition-all duration-300 hover:shadow-md"
            aria-label={isAutoPlaying ? "Pause auto-play" : "Resume auto-play"}
          >
            {isAutoPlaying ? (
              <> Pause Auto-play</>
            ) : (
              <> Resume Auto-play</>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;
