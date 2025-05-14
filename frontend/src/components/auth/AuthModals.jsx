// import { useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import SignInForm from "./SignInForm";
// import SignUpForm from "./SignUpForm";

// const AuthModals = ({ isOpen, modalType, onClose, onSwitchModal }) => {
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }

//     return () => {
//       document.body.style.overflow = 'auto';
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
//       <div className="flex min-h-screen items-center justify-center p-4">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.9 }}
//           transition={{ duration: 0.2 }}
//           className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl relative"
//         >
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold text-gray-900 mb-4">
//               {modalType === "signin" ? "Sign In" : "Create Account"}
//             </h2>
//             <button
//               onClick={onClose}
//               className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <line x1="18" y1="6" x2="6" y2="18"></line>
//                 <line x1="6" y1="6" x2="18" y2="18"></line>
//               </svg>
//               <span className="sr-only">Close</span>
//             </button>
//           </div>

//           <AnimatePresence mode="wait">
//             <motion.div
//               key={modalType}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.2 }}
//             >
//               {modalType === "signin" ? (
//                 <SignInForm onSwitchToSignUp={() => onSwitchModal("signup")} />
//               ) : (
//                 <SignUpForm onSwitchToSignIn={() => onSwitchModal("signin")} />
//               )}
//             </motion.div>
//           </AnimatePresence>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default AuthModals;

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignInForm from "./SignInForm.jsx";
import SignUpForm from "./SignUpForm.jsx";

export default function AuthModals({
  isOpen,
  modalType,
  onClose,
  onSwitchModal
}) {
  // Prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={modalType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {modalType === "signin" ? (
                <SignInForm
                  onClose={onClose}
                  onSwitchToSignUp={() => onSwitchModal("signup")}
                />
              ) : (
                <SignUpForm
                  onClose={onClose}
                  onSwitchToSignIn={() => onSwitchModal("signin")}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
