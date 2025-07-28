import { useState, useEffect } from "react";
import { BookOpen, Calendar, MessageCircle, UserCheck, IndianRupee, ChevronLeft, ChevronRight, Users, GraduationCap, DollarSign, Star, Video, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const studentSteps = [
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: "Discover Skills",
    description: "Browse through hundreds of skills taught by verified mentors from around the globe",
    color: "from-primary/30 to-primary/10",
    bgColor: "bg-primary/5"
  },
  {
    icon: <UserCheck className="h-10 w-10 text-tertiary" />,
    title: "Find Your Mentor",
    description: "Use AI-powered matching to find mentors that align with your learning style and goals",
    color: "from-tertiary/30 to-tertiary/10",
    bgColor: "bg-tertiary/5"
  },
  {
    icon: <Video className="h-10 w-10 text-primary" />,
    title: "Book & Learn",
    description: "Schedule video sessions, join live classes, and get personalized guidance",
    color: "from-primary/30 to-primary/10",
    bgColor: "bg-primary/5"
  },
  {
    icon: <Star className="h-10 w-10 text-tertiary" />,
    title: "Track Progress",
    description: "Monitor your learning journey, earn certificates, and rate your mentors",
    color: "from-tertiary/30 to-tertiary/10",
    bgColor: "bg-tertiary/5"
  },
];

const mentorSteps = [
  {
    icon: <Settings className="h-10 w-10 text-primary" />,
    title: "Create Profile",
    description: "Set up your mentor profile with skills, experience, and teaching preferences",
    color: "from-primary/30 to-primary/10",
    bgColor: "bg-primary/5"
  },
  {
    icon: <Calendar className="h-10 w-10 text-tertiary" />,
    title: "Set Availability",
    description: "Define your schedule, set hourly rates, and choose your teaching methods",
    color: "from-tertiary/30 to-tertiary/10",
    bgColor: "bg-tertiary/5"
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Connect with Students",
    description: "Get matched with students, conduct video sessions, and share your expertise",
    color: "from-primary/30 to-primary/10",
    bgColor: "bg-primary/5"
  },
  {
    icon: <IndianRupee className="h-10 w-10 text-tertiary" />,
    title: "Earn & Grow",
    description: "Receive payments securely, build your reputation, and expand your student base",
    color: "from-tertiary/30 to-tertiary/10",
    bgColor: "bg-tertiary/5"
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
    }, 5000);

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
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction < 0 ? 45 : -45,
      scale: 0.8
    })
  };

  return (
    <div className="py-16 relative">
      {/* Header with User Type Toggle */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-8">
          How It Works
        </h2>
        
        {/* User Type Selector */}
        <div className="inline-flex bg-card/50 backdrop-blur-sm p-2 rounded-2xl border border-border/30 mb-8">
          <button
            onClick={() => handleUserTypeChange('student')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              userType === 'student'
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            For Students
          </button>
          <button
            onClick={() => handleUserTypeChange('mentor')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
              userType === 'mentor'
                ? 'bg-tertiary text-white shadow-lg shadow-tertiary/25'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-5 h-5" />
            For Mentors
          </button>
        </div>
      </motion.div>

      {/* Main Carousel */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Large Card Carousel */}
        <div className="relative h-[600px]" style={{ perspective: '1000px' }}>
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
                opacity: { duration: 0.2 },
                rotateY: { duration: 0.6 },
                scale: { duration: 0.4 }
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-full max-w-4xl">
                <div className={`${currentSteps[currentStep].bgColor} backdrop-blur-sm rounded-3xl p-12 border border-border/30 shadow-2xl`}>
                  <div className="text-center">
                    {/* Step Indicator */}
                    <div className="inline-flex items-center gap-2 bg-background/80 rounded-full px-4 py-2 mb-8">
                      <span className="text-sm font-medium text-muted-foreground">
                        Step {currentStep + 1} of {currentSteps.length}
                      </span>
                    </div>

                    {/* Icon */}
                    <motion.div
                      className={`w-24 h-24 mx-auto mb-8 p-6 bg-gradient-to-br ${currentSteps[currentStep].color} rounded-3xl`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {currentSteps[currentStep].icon}
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-4xl md:text-5xl font-bold mb-6">
                      {currentSteps[currentStep].title}
                    </h3>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
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
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextStep}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-4 mt-12">
          {currentSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentStep
                  ? `w-12 h-4 ${userType === 'student' ? 'bg-primary' : 'bg-tertiary'}`
                  : 'w-4 h-4 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        {/* Thumbnail Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
          {currentSteps.map((step, index) => (
            <motion.button
              key={index}
              onClick={() => goToStep(index)}
              className={`p-4 rounded-2xl border transition-all duration-300 text-left ${
                index === currentStep
                  ? `border-${userType === 'student' ? 'primary' : 'tertiary'}/50 bg-${userType === 'student' ? 'primary' : 'tertiary'}/5 shadow-lg`
                  : 'border-border/30 bg-card/30 hover:bg-card/50 hover:border-border/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-12 h-12 p-3 bg-gradient-to-br ${step.color} rounded-xl mb-3`}>
                {React.cloneElement(step.icon, { className: "h-6 w-6" })}
              </div>
              <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
              <p className="text-xs text-muted-foreground" style={{ 
                display: '-webkit-box', 
                WebkitLineClamp: 2, 
                WebkitBoxOrient: 'vertical', 
                overflow: 'hidden' 
              }}>
                {step.description}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Auto-play Controls */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="px-4 py-2 border border-border/50 rounded-lg bg-transparent hover:bg-primary/10 backdrop-blur-sm text-foreground font-medium transition-all duration-300"
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
