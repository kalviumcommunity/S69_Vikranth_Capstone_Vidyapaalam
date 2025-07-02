// // src/components/onboarding/RoleSelection.jsx

// import { motion } from "framer-motion";
// import { useState } from "react";
// import { useAuth } from "../../contexts/AuthContext";

// const RoleSelection = ({ onSelectRole }) => {
//   const { user, api, loading: authLoading } = useAuth(); // get authLoading
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleRoleSelect = async (role) => {
//     if (authLoading || !user) {
//       setError("Please wait, loading user information...");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       // PATCH to the new endpoint
//       const response = await api.patch("/auth/profile/role", { role });

//       if (response.status === 200) {
//         onSelectRole(role);
//       } else {
//         setError("Failed to save role. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error saving role:", err);
//       setError("Could not save role. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-8">
//       <h2 className="text-3xl font-semibold text-center text-gray-900">Choose Your Role</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="transition-transform duration-200"
//         >
//           <button
//             className="w-full h-auto p-8 flex flex-col items-center justify-center gap-6 border border-gray-300 rounded-2xl shadow-md hover:shadow-lg hover:border-blue-500 transition-all duration-300"
//             onClick={() => handleRoleSelect("student")}
//             disabled={loading}
//           >
//             <div className="p-6 bg-blue-100 rounded-full">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="40"
//                 height="40"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="text-blue-600"
//               >
//                 <path d="M8 10h.01"></path>
//                 <path d="M12 10h.01"></path>
//                 <path d="M16 10h.01"></path>
//                 <path d="M2 19h20"></path>
//                 <path d="M18 19V7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12"></path>
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800">I want to Learn</h3>
//             <p className="text-lg text-gray-600 text-center leading-relaxed">
//               Find skilled mentors and learn various skills.
//             </p>
//           </button>
//         </motion.div>

//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="transition-transform duration-200"
//         >
//           <button
//             className="w-full h-auto p-8 flex flex-col items-center justify-center gap-6 border border-gray-300 rounded-2xl shadow-md hover:shadow-lg hover:border-blue-500 transition-all duration-300"
//             onClick={() => handleRoleSelect("teacher")}
//             disabled={loading}
//           >
//             <div className="p-6 bg-blue-100 rounded-full">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="40"
//                 height="40"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="text-blue-600"
//               >
//                 <path d="M18 10L14 2H10L6 10Z"></path>
//                 <path d="M12 10V20"></path>
//                 <path d="M8 20H16"></path>
//               </svg>
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800">I want to Teach</h3>
//             <p className="text-lg text-gray-600 text-center leading-relaxed">
//               Share your skills and knowledge with eager learners.
//             </p>
//           </button>
//         </motion.div>
//       </div>

//       {error && <p className="text-red-500 text-center">{error}</p>}
//     </div>
//   );
// };

// export default RoleSelection;



// src/components/onboarding/RoleSelection.jsx

import { motion } from "framer-motion";
import { useState, useEffect } from "react"; 
import { useAuth } from "../../contexts/AuthContext";

const RoleSelection = ({ onSelectRole }) => {
  const { user, api, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Log auth state when component renders or auth state changes
  useEffect(() => {
    console.log("RoleSelection Component Render/Auth State Change:");
    console.log("  authLoading:", authLoading);
    console.log("  user:", user);
    if (authLoading) {
      setError("Loading user information...");
    } else if (!user) {
      setError("User not authenticated. Please log in again.");
    } else {
      setError(""); // Clear error if user is loaded
    }
  }, [authLoading, user]);

  const handleRoleSelect = async (role) => {
    console.log("handleRoleSelect triggered for role:", role); // Confirm click is registered

    if (authLoading) {
      console.log("handleRoleSelect: authLoading is TRUE. Returning early.");
      setError("Please wait, user information is still loading.");
      return;
    }
    if (!user) {
      console.log("handleRoleSelect: user is NULL. Returning early.");
      setError("User not authenticated. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Attempting to PATCH /auth/profile/role with role:", role);
      const response = await api.patch("/auth/profile/role", { role });

      if (response.status === 200) {
        console.log("Role saved successfully via API. Calling onSelectRole.");
        onSelectRole(role);
      } else {
        console.error("API response status not 200:", response.status, response.data);
        setError("Failed to save role. Please try again.");
      }
    } catch (err) {
      console.error("Error saving role in handleRoleSelect:", err.response?.data || err.message, err);
      setError(err.response?.data?.message || "Could not save role. An unexpected error occurred.");
    } finally {
      setLoading(false);
      console.log("handleRoleSelect finished. Loading state:", loading);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold text-center text-gray-900">Choose Your Role</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="transition-transform duration-200"
        >
          <button
            className="w-full h-auto p-8 flex flex-col items-center justify-center gap-6 border border-gray-300 rounded-2xl shadow-md hover:shadow-lg hover:border-blue-500 transition-all duration-300"
            onClick={() => handleRoleSelect("student")}
            disabled={loading || authLoading || !user} // Disable if auth is loading or user is null
          >
            <div className="p-6 bg-blue-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M8 10h.01"></path>
                <path d="M12 10h.01"></path>
                <path d="M16 10h.01"></path>
                <path d="M2 19h20"></path>
                <path d="M18 19V7a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">I want to Learn</h3>
            <p className="text-lg text-gray-600 text-center leading-relaxed">
              Find skilled mentors and learn various skills.
            </p>
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="transition-transform duration-200"
        >
          <button
            className="w-full h-auto p-8 flex flex-col items-center justify-center gap-6 border border-gray-300 rounded-2xl shadow-md hover:shadow-lg hover:border-blue-500 transition-all duration-300"
            onClick={() => handleRoleSelect("teacher")}
            disabled={loading || authLoading || !user} // Disable if auth is loading or user is null
          >
            <div className="p-6 bg-blue-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M18 10L14 2H10L6 10Z"></path>
                <path d="M12 10V20"></path>
                <path d="M8 20H16"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">I want to Teach</h3>
            <p className="text-lg text-gray-600 text-center leading-relaxed">
              Share your skills and knowledge with eager learners.
            </p>
          </button>
        </motion.div>
      </div>

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {loading && <p className="text-center text-blue-500 mt-4">Saving role...</p>}
    </div>
  );
};

export default RoleSelection;
