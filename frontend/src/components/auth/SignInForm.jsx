// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext.jsx";

// import GoogleSignInButton from './GoogleSignInButton'; // Ensure this path is correct


// export default function SignInForm({ onSwitchToSignUp, onClose }) {
//   const { login, fetchUser } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const validate = () => {
//     const e = {};
//     let ok = true;
//     if (!formData.email) {
//       e.email = "Email is required";
//       ok = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       e.email = "Enter a valid email";
//       ok = false;
//     }
//     if (!formData.password) {
//       e.password = "Password is required";
//       ok = false;
//     }
//     setErrors(e);
//     return ok;
//   };

//   const handleLoginSuccess = async ({ isNewUser }) => {
//     // --- START DEBUG LOGS ---
//     console.log("handleLoginSuccess called. isNewUser:", isNewUser);
    
//     const user = await fetchUser(); // Always fetch the latest user data
//     console.log("User data after fetchUser:", user); // IMPORTANT: Check what 'user' contains here

//     let targetPath;

//     if (isNewUser) {
//       console.log("New Google user detected. Setting target path to /onboarding.");
//       targetPath = "/onboarding";
//     } else if (user && user.role) {
//       // Existing user: navigate based on role
//       if (user.role === "student") {
//         targetPath = "/student/overview";
//         console.log("Existing student. Setting target path to /student/overview.");
//       } else if (user.role === "teacher") {
//         targetPath = "/teacher/overview";
//         console.log("Existing teacher. Setting target path to /teacher/overview.");
//       } else {
//         // Fallback for existing user with unrecognized/unset role
//         console.warn("User logged in with an unrecognized role:", user.role);
//         targetPath = "/onboarding"; // Direct to onboarding to set up role
//         console.log("Existing user with unrecognized role. Setting target path to /onboarding.");
//       }
//     } else {
//       // Fallback for existing user if user data or role is missing (unexpected state or fetchUser failed)
//       console.warn("User data or role missing after Google login (not a new user). Setting target path to /onboarding as fallback.");
//       targetPath = "/onboarding";
//     }

//     console.log("Final targetPath determined:", targetPath);
//     // --- END DEBUG LOGS ---

//     // 1. Perform the navigation first
//     navigate(targetPath);
//     console.log("Navigation command issued for:", targetPath); // Log after navigate call

//     // 2. Then, call onClose() to close the modal/form.
//     // This ensures navigation is initiated before any potential component unmounting.
//     onClose();
//     console.log("onClose() called."); // Log after onClose call
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     setLoading(true);
//     try {
//       await login(formData.email, formData.password); 
//       // If regular login successful, fetch user and handle navigation
//       handleLoginSuccess({ isNewUser: false }); // Assume not new for manual login
//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLoginError = (errorMessage) => {
//     alert(errorMessage || "Google login failed.");
//   };

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 py-4">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="email" className="block text-sm font-semibold mb-1">
//             Email
//           </label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             className={`w-full px-4 py-2 border rounded ${
//               errors.email ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
//         </div>

//         <div>
//           <label htmlFor="password" className="block text-sm font-semibold mb-1">
//             Password
//           </label>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             className={`w-full px-4 py-2 border rounded ${
//               errors.password ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
//         >
//           {loading ? "Signing in…" : "Sign In"}
//         </button>
//       </form>

//       <div className="flex items-center justify-between my-4">
//         <hr className="flex-grow border-t border-gray-300" />
//         <span className="px-3 text-gray-500 text-sm">OR</span>
//         <hr className="flex-grow border-t border-gray-300" />
//       </div>

//       <GoogleSignInButton onSuccess={handleLoginSuccess} onError={handleGoogleLoginError} />

//       <p className="mt-6 text-center text-sm text-gray-600">
//         Don't have an account?{" "}
//         <button onClick={onSwitchToSignUp} className="text-blue-600 hover:underline">
//           Sign Up
//         </button>
//       </p>
//     </motion.div>
//   );
// }




import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import GoogleSignInButton from "./GoogleSignInButton";

export default function SignInForm({ onSwitchToSignUp, onClose }) {
  const { login, fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ✅ Check for error in query string from Google callback
    const params = new URLSearchParams(location.search);
    const error = params.get("error");
    if (error) {
      alert(decodeURIComponent(error));
      navigate("/signin", { replace: true }); // Remove query from URL
    }
  }, [location, navigate]);

  const validate = () => {
    const e = {};
    let ok = true;
    if (!formData.email) {
      e.email = "Email is required";
      ok = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      e.email = "Enter a valid email";
      ok = false;
    }
    if (!formData.password) {
      e.password = "Password is required";
      ok = false;
    }
    setErrors(e);
    return ok;
  };

  const handleLoginSuccess = async () => {
    try {
      await fetchUser(); // update context
    } catch (e) {
      console.error("Failed to fetch user after Google login");
    }
    onClose(); // just close modal — redirection already happened server-side
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      const user = await fetchUser();
      onClose();

      if (user?.role === "student") {
        navigate("/student/overview");
      } else if (user?.role === "teacher") {
        navigate("/teacher/overview");
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = (errorMessage) => {
    alert(errorMessage || "Google login failed.");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 py-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-2 border rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={`w-full px-4 py-2 border rounded ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="flex items-center justify-between my-4">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="px-3 text-gray-500 text-sm">OR</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <GoogleSignInButton onSuccess={handleLoginSuccess} onError={handleGoogleLoginError} />

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button onClick={onSwitchToSignUp} className="text-blue-600 hover:underline">
          Sign Up
        </button>
      </p>
    </motion.div>
  );
}
