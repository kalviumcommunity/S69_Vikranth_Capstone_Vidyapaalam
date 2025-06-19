// import { Link } from "react-router-dom";
// import AuthModals from "@/components/auth/AuthModals";
// import { useState } from "react";
// import { motion } from "framer-motion";

// const HeroSection = () => {
//   const [authModalOpen, setAuthModalOpen] = useState(false);
//   const [authModalType, setAuthModalType] = useState(null);

//   const openAuthModal = (type) => {
//     setAuthModalType(type);
//     setAuthModalOpen(true);
//   };

//   const closeAuthModal = () => {
//     setAuthModalOpen(false);
//   };

//   const switchAuthModal = (type) => {
//     setAuthModalType(type);
//   };

//   const fadeIn = {
//     initial: { opacity: 0 },
//     animate: { opacity: 1 },
//     transition: { duration: 0.8, ease: "easeInOut" },
//   };

//   const slideInLeft = {
//     initial: { x: -50, opacity: 0 },
//     animate: { x: 0, opacity: 1 },
//     transition: { duration: 0.7, ease: "easeInOut" },
//   };

//   const slideInRight = {
//     initial: { x: 50, opacity: 0 },
//     animate: { x: 0, opacity: 1 },
//     transition: { duration: 0.7, ease: "easeInOut" },
//   };

//   const pulseAnimation = {
//     animate: {
//       scale: [1, 1.1, 1],
//       opacity: [1, 0.8, 1],
//       transition: {
//         duration: 1.5,
//         repeat: Infinity,
//         ease: "easeInOut",
//       },
//     },
//   };

//   return (
//     <motion.div
//       className="relative overflow-hidden bg-gradient-to-b from-white to-gray-100 py-24 md:py-32"
//       {...fadeIn}
//     >
//       <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
//         <motion.div className="md:w-1/2 space-y-8" {...slideInLeft}>
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
//             <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
//               Connect
//             </span>
//             ,{" "}
//             <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
//               Learn
//             </span>{" "}
//             &{" "}
//             <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
//               Grow
//             </span>{" "}
//             Together
//           </h1>
//           <p className="text-lg md:text-2xl text-gray-700 leading-snug">
//             VidyaPaalam bridges the gap between skilled mentors and eager
//             learners. Share your expertise or master a new skill in our
//             collaborative community.
//           </p>
//           <div className="hidden md:flex items-center gap-4">
//             <Link
//               to="/about"
//               className="hover:shadow-md px-6 py-4 rounded-md border border-gray-300 text-lg text-black hover:bg-blue-100 transition-colors font-semibold"
//             >
//               Learn More
//             </Link>
//             <motion.button
//               className="hover:shadow-md px-6 py-4 rounded-md bg-orange-500 text-lg text-white hover:bg-orange-600 transition-colors font-semibold"
//               onClick={() => openAuthModal("signin")}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               Try Now
//             </motion.button>
//           </div>
//         </motion.div>

//         <motion.div className="md:w-1/2 relative" {...slideInRight}>
//           <div className="relative rounded-xl overflow-hidden shadow-3xl">
//             <img
//               src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000"
//               alt="People sharing knowledge"
//               className="w-full h-auto object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
//           </div>

//           <motion.div
//             className="absolute -bottom-6 -right-6 bg-white rounded-lg p-5 shadow-md"
//             {...pulseAnimation}
//           >
//             <div className="flex items-center gap-3">
//               <div className="bg-green-500 h-4 w-4 rounded-full"></div>
//               <span className="font-medium text-lg text-gray-800">
//                 1,240+ active mentors
//               </span>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* <div className="hidden md:block absolute -bottom-20 -left-20 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl"></div> */}
//       <motion.div
//         className="hidden md:block absolute top-20 -right-20 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl"
//         initial={{ opacity: 0, y: -50, x: 50 }}
//         animate={{ opacity: 1, y: 0, x: 0 }}
//         transition={{ duration: 1, ease: "easeInOut" }}
//       ></motion.div>

//       <AuthModals
//         isOpen={authModalOpen}
//         modalType={authModalType}
//         onClose={closeAuthModal}
//         onSwitchModal={switchAuthModal}
//       />
//     </motion.div>
//   );
// };

// export default HeroSection;

import { Link } from "react-router-dom";
import AuthModals from "@/components/auth/AuthModals";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState(null);

  const openAuthModal = (type) => {
    setAuthModalType(type);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthModalType(null); // Reset modal type when closed
  };

  const switchAuthModal = (type) => {
    setAuthModalType(type);
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, ease: "easeInOut" },
  };

  const slideInLeft = {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.7, ease: "easeInOut" },
  };

  const slideInRight = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.7, ease: "easeInOut" },
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const location = useLocation();
  const navigate = useNavigate();

  // --- CORRECTED useEffect BLOCK ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const googleAuthSuccess = params.get('googleAuthSuccess');
    const isNewUser = params.get('isNewUser');
    const error = params.get('error');

    if (googleAuthSuccess !== null) {
      setAuthModalOpen(true);
      setAuthModalType("signin");

      if (googleAuthSuccess === 'true') {
        console.log("HeroSection: Google Auth successful! New user:", isNewUser);
      } else {
        console.error("HeroSection: Google Auth failed:", decodeURIComponent(error || 'Unknown error'));
      }

      // location.pathname is used here, so it needs to be in the dependency array
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, navigate, location.pathname]); // <--- ADDED location.pathname HERE

  return (
    <motion.div
      className="relative overflow-hidden bg-gradient-to-b from-white to-gray-100 py-24 md:py-32"
      {...fadeIn}
    >
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        <motion.div className="md:w-1/2 space-y-8" {...slideInLeft}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
              Connect
            </span>
            ,{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
              Learn
            </span>{" "}
            &{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">
              Grow
            </span>{" "}
            Together
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 leading-snug">
            VidyaPaalam bridges the gap between skilled mentors and eager
            learners. Share your expertise or master a new skill in our
            collaborative community.
          </p>
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/about"
              className="hover:shadow-md px-6 py-4 rounded-md border border-gray-300 text-lg text-black hover:bg-blue-100 transition-colors font-semibold"
            >
              Learn More
            </Link>
            <motion.button
              className="hover:shadow-md px-6 py-4 rounded-md bg-orange-500 text-lg text-white hover:bg-orange-600 transition-colors font-semibold"
              onClick={() => openAuthModal("signin")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Now
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="md:w-1/2 relative" {...slideInRight}>
          <div className="relative rounded-xl overflow-hidden shadow-3xl">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000"
              alt="People sharing knowledge"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          <motion.div
            className="absolute -bottom-6 -right-6 bg-white rounded-lg p-5 shadow-md"
            {...pulseAnimation}
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-500 h-4 w-4 rounded-full"></div>
              <span className="font-medium text-lg text-gray-800">
                1,240+ active mentors
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="hidden md:block absolute top-20 -right-20 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl"
        initial={{ opacity: 0, y: -50, x: 50 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      ></motion.div>

      <AuthModals
        isOpen={authModalOpen}
        modalType={authModalType}
        onClose={closeAuthModal}
        onSwitchModal={switchAuthModal}
      />
    </motion.div>
  );
};

export default HeroSection;