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
