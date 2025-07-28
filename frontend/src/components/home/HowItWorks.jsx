import React from "react";
import { BookOpen, UserCheck, ChevronLeft, ChevronRight, Users, GraduationCap, DollarSign, Star, Video, Settings, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const studentSteps = [
  {
    icon: <BookOpen className="h-12 w-12 text-indigo-600" />,
    title: "Discover Skills",
    description: "Explore a vast library of skills taught by verified mentors from across the globe.",
    color: "from-indigo-500/20 to-indigo-200/10",
    bgColor: "bg-indigo-50/80"
  },
  {
    icon: <UserCheck className="h-12 w-12 text-emerald-600" />,
    title: "Find Your Mentor",
    description: "Leverage AI-powered matching to connect with mentors tailored to your learning style and goals.",
    color: "from-emerald-500/20 to-emerald-200/10",
    bgColor: "bg-emerald-50/80"
  },
  {
    icon: <Video className="h-12 w-12 text-indigo-600" />,
    title: "Book & Learn",
    description: "Schedule interactive video sessions, join live classes, and receive personalized guidance.",
    color: "from-indigo-500/20 to-indigo-200/10",
    bgColor: "bg-indigo-50/80"
  },
  {
    icon: <Star className="h-12 w-12 text-emerald-600" />,
    title: "Track Progress",
    description: "Monitor your learning journey, earn certificates, and provide feedback on your mentors.",
    color: "from-emerald-500/20 to-emerald-200/10",
    bgColor: "bg-emerald-50/80"
  },
];

const mentorSteps = [
  {
    icon: <Settings className="h-12 w-12 text-indigo-600" />,
    title: "Create Profile",
    description: "Build a professional mentor profile showcasing your skills, experience, and teaching approach.",
    color: "from-indigo-500/20 to-indigo-200/10",
    bgColor: "bg-indigo-50/80"
  },
  {
    icon: <Calendar className="h-12 w-12 text-emerald-600" />,
    title: "Set Availability",
    description: "Define your schedule, set hourly rates, and choose your teaching methods.",
    color: "from-emerald-500/20 to-emerald-200/10",
    bgColor: "bg-emerald-50/80"
  },
  {
    icon: <Users className="h-12 w-12 text-indigo-600" />,
    title: "Connect with Students",
    description: "Get matched with eager learners, conduct engaging video sessions, and share your expertise.",
    color: "from-indigo-500/20 to-indigo-200/10",
    bgColor: "bg-indigo-50/80"
  },
  {
    icon: <DollarSign className="h-12 w-12 text-emerald-600" />,
    title: "Earn & Grow",
    description: "Securely receive payments, build your reputation, and grow your student community.",
    color: "from-emerald-500/20 to-emerald-200/10",
    bgColor: "bg-emerald-50/80"
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

  const goToStep = (index: number) => {
    setDirection(index > currentStep ? 1 : -1);
    setCurrentStep(index);
    setIsAutoPlaying(false);
  };

  const handleUserTypeChange = (type: 'student' | 'mentor') => {
    setUserType(type);
    setCurrentStep(0);
    setIsAutoPlaying(true);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction < 0 ? 45 : -45,
      scale: 0.8
    })
  };

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header with User Type Toggle */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8 tracking-tight">
          How It Works
        </h2>
        
        {/* User Type Selector */}
        <div className="inline-flex bg-white/80 backdrop-blur-lg p-2 rounded-full border border-gray-200 shadow-sm mb-8">
          <button
            onClick={() => handleUserTypeChange('student')}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 text-sm md:text-base ${
              userType === 'student'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
            aria-label="View steps for students"
          >
            <GraduationCap className="w-5 h-5" />
            For Students
          </button>
          <button
            onClick={() => handleUserTypeChange('mentor')}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 text-sm md:text-base ${
              userType === 'mentor'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            aria-label="View steps for mentors"
          >
            <Users className="w-5 h-5" />
            For Mentors
          </button>
        </div>
      </motion.div>

      {/* Main Carousel */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Large Card Carousel */}
        <div className="relative min-h-[450px] md:min-h-[500px] lg:min-h-[550px]" style={{ perspective: '1200px' }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={`${userType}-${currentStep}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                rotateY: { duration: 0.5 },
                scale: { duration: 0.4 }
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-full max-w-3xl">
                <div className={`${currentSteps[currentStep].bgColor} backdrop-blur-lg rounded-3xl p-8 md:p-12 lg:p-14 border border-gray-100/50 shadow-xl ring-1 ring-gray-100/20`}>
                  <div className="text-center">
                    {/* Step Indicator */}
                    <div className="inline-flex items-center gap-2 bg-white/90 rounded-full px-4 py-2 mb-8 shadow-sm">
                      <span className="text-sm font-medium text-gray-600">
                        Step {currentStep + 1} of {currentSteps.length}
                      </span>
                    </div>

                    {/* Icon */}
                    <motion.div
                      className={`w-20 h-20 mx-auto mb-8 p-5 bg-gradient-to-br ${currentSteps[currentStep].color} rounded-2xl shadow-md`}
                      whileHover={{ scale: 1.1, rotate: 8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    >
                      {currentSteps[currentStep].icon}
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                      {currentSteps[currentStep].title}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                      {currentSteps[currentStep].description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={prevStep}
            className="absolute left-2 md:left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-lg hover:bg-white border border-gray-200 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
            aria-label="Previous step"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={nextStep}
            className="absolute right-2 md:right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-lg hover:bg-white border border-gray-200 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
            aria-label="Next step"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-3 mt-10">
          {currentSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentStep
                  ? `w-10 h-3 ${userType === 'student' ? 'bg-indigo-600' : 'bg-emerald-600'}`
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        {/* Auto-play Controls */}
        <motion.div 
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="px-5 py-2.5 border border-gray-200 rounded-full bg-white/80 hover:bg-indigo-50/80 backdrop-blur-lg text-gray-700 font-medium text-sm md:text-base transition-all duration-300 hover:shadow-md"
            aria-label={isAutoPlaying ? "Pause auto-play" : "Resume auto-play"}
          >
            {isAutoPlaying ? (
              <>⏸️ Pause Auto-play</>
            ) : (
              <>▶️ Resume Auto-play</>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;
