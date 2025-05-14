

// // export default Navbar;
// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { MenuIcon, X } from "lucide-react";
// import AuthModals from "@/components/auth/AuthModals";
// import { motion } from "framer-motion";

// const Navbar = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

//   return (
//     <>
//       <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-gray-200">
//         <nav className="container mx-auto py-4 flex items-center justify-between">
//           <Link to="/" className="flex items-center gap-2">
//             <motion.span
//               className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text "
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               VidyaPaalam
//             </motion.span>
//             <motion.span
//               className="text-md text-gray-500 font-semibold"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//             >
//               (skill-bridge)
//             </motion.span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-4">
           
//             <button
//               className="px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-blue-200 transition-colors font-semibold text-lg"
//               onClick={() => openAuthModal("signin")}
//             >
//               Sign In
//             </button>
//             <button
//               className="px-4 py-2 rounded-md bg-orange-500 text-lg text-white hover:bg-orange-600 transition-colors font-semibold"
//               onClick={() => openAuthModal("signup")}
//             >
//               Join Now
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
//           </button>
//         </nav>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <motion.div
//             className="md:hidden bg-white border-b"
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="container py-4 flex flex-col space-y-4">
//               <div className="flex flex-col gap-2 pt-2">
//                 <button
//                   className="px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-100 transition-colors font-semibold w-full"
//                   onClick={() => {
//                     setMobileMenuOpen(false);
//                     openAuthModal("signin");
//                   }}
//                 >
//                   Sign In
//                 </button>
//                 <button
//                   className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors font-semibold w-full"
//                   onClick={() => {
//                     setMobileMenuOpen(false);
//                     openAuthModal("signup");
//                   }}
//                 >
//                   Join Now
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </header>

//       {/* Auth Modals */}
//       <AuthModals
//         isOpen={authModalOpen}
//         modalType={authModalType}
//         onClose={closeAuthModal}
//         onSwitchModal={switchAuthModal}
//       />
//     </>
//   );
// };

// export default Navbar;

import { useState } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, X } from "lucide-react";
import AuthModals from "@/components/auth/AuthModals";
import { motion } from "framer-motion";

const Navbar = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState(null);

  const openAuthModal = (type) => {
    setAuthModalType(type);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const switchAuthModal = (type) => {
    setAuthModalType(type);
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-gray-200">
        <nav className="container mx-auto py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.span
              className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              VidyaPaalam
            </motion.span>
            <motion.span
              className="text-md text-gray-500 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              (skill-bridge)
            </motion.span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <button
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-blue-200 transition-colors font-semibold text-lg"
                  onClick={() => openAuthModal("signin")}
                >
                  Sign In
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-orange-500 text-lg text-white hover:bg-orange-600 transition-colors font-semibold"
                  onClick={() => openAuthModal("signup")}
                >
                  Join Now
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-700 font-medium">
                  Welcome, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-b"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container py-4 flex flex-col space-y-4">
              <div className="flex flex-col gap-2 pt-2">
                {!user ? (
                  <>
                    <button
                      className="px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-100 transition-colors font-semibold w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal("signin");
                      }}
                    >
                      Sign In
                    </button>
                    <button
                      className="px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors font-semibold w-full"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal("signup");
                      }}
                    >
                      Join Now
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-gray-700 font-medium px-4">
                      Hello, {user.name.split(" ")[0]}
                    </span>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-semibold w-full"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Auth Modals */}
      <AuthModals
        isOpen={authModalOpen}
        modalType={authModalType}
        onClose={closeAuthModal}
        onSwitchModal={switchAuthModal}
      />
    </>
  );
};

export default Navbar;
