
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc"; // Import Google icon

// const SignInForm = ({ onSwitchToSignUp }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: ""
//   });
//   const [errors, setErrors] = useState({
//     email: "",
//     password: ""
//   });
//   const navigate = useNavigate();

//   const validateForm = () => {
//     let valid = true;
//     const newErrors = {
//       email: "",
//       password: ""
//     };

//     if (!formData.email) {
//       newErrors.email = "Email is required";
//       valid = false;
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address";
//       valid = false;
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//       valid = false;
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   const showToast = (message, type = "success") => {
//     const toast = document.createElement("div");
//     toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
//       type === "success" ? "bg-green-500" : "bg-red-500"
//     } text-white animate-fade-in`;
//     toast.textContent = message;
//     document.body.appendChild(toast);

//     setTimeout(() => {
//       toast.classList.remove("animate-fade-in");
//       toast.classList.add("animate-fade-out");
//       setTimeout(() => {
//         document.body.removeChild(toast);
//       }, 300);
//     }, 3000);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setIsLoading(true);

//     try {
//       console.log("Sign in data:", formData);
//       showToast("Sign in successful!");
//       navigate("/onboarding");
//     } catch (error) {
//       showToast("Sign in failed. Please check your credentials and try again.", "error");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSignIn = () => {
//     // Implement Google sign-in logic here
//     console.log("Google sign-in initiated");
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="space-y-6 py-4"
//     >
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             placeholder="your@email.com"
//             value={formData.email}
//             onChange={handleChange}
//             className={`w-full px-4 py-3 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
//           />
//           {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
//         </div>

//         <div>
//           <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             placeholder="******"
//             value={formData.password}
//             onChange={handleChange}
//             className={`w-full px-4 py-3 border rounded-lg ${errors.password ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
//           />
//           {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
//         </div>

//         <button
//           type="submit"
//           className={`w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
//           disabled={isLoading}
//         >
//           {isLoading ? "Signing in..." : "Sign In"}
//         </button>
//       </form>

//       <div className="mt-6">
//         <button
//           onClick={handleGoogleSignIn}
//           className="w-full py-3 px-6 border rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors"
//         >
//           <FcGoogle className="text-2xl" />
//           <span>Sign In with Google</span>
//         </button>
//       </div>

//       <div className="text-center mt-6">
//         <p className="text-sm text-gray-500">
//           Don't have an account?{" "}
//           <button
//             type="button"
//             className="text-blue-600 hover:underline"
//             onClick={onSwitchToSignUp}
//           >
//             Sign Up
//           </button>
//         </p>
//       </div>

//       <style dangerouslySetInnerHTML={{ __html: `
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         @keyframes fadeOut {
//           from { opacity: 1; transform: translateY(0); }
//           to { opacity: 0; transform: translateY(10px); }
//         }

//         .animate-fade-in {
//           animation: fadeIn 0.3s ease-out forwards;
//         }

//         .animate-fade-out {
//           animation: fadeOut 0.3s ease-out forwards;
//         }
//       `}} />
//     </motion.div>
//   );
// };

// export default SignInForm;





import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { FcGoogle } from "react-icons/fc";

export default function SignInForm({ onSwitchToSignUp, onClose }) {
  const { login } = useAuth();      // login(email, password)
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    let ok = true;
    if (!formData.email)           { e.email = "Email is required"; ok = false; }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      e.email = "Enter a valid email"; ok = false;
    }
    if (!formData.password)        { e.password = "Password is required"; ok = false; }
    setErrors(e);
    return ok;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      onClose();
      navigate("/onboarding");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    // TODO: integrate Google Identity Services and then:
    // get credential → call context.api.post('/auth/google-login', { credential }) and fetch profile
    console.log("Google sign-in initiated");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 py-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-2 border rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            className={`w-full px-4 py-2 border rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
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

      <button
        onClick={handleGoogle}
        className="w-full mt-4 flex items-center justify-center border py-2 rounded hover:bg-gray-100 transition"
      >
        <FcGoogle className="text-2xl" />
        <span>Sign In with Google</span>
      </button>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button onClick={onSwitchToSignUp} className="text-blue-600 hover:underline">
          Sign Up
        </button>
      </p>
    </motion.div>
  );
}
