import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

// Ensure this is the correct GoogleSignInButton that calls `onSuccess({ isNewUser })`
import GoogleSignInButton from "./GoogleSignInButton";

export default function SignInForm({ onSwitchToSignUp, onClose }) {
  const { login, fetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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

  const handleLoginSuccess = async ({ isNewUser }) => {
    try {
      console.log("Google login success. isNewUser:", isNewUser);

      const user = await fetchUser();
      console.log("Fetched user after Google login:", user);

      let targetPath = "/onboarding";

      if (!isNewUser && user && user.role) {
        if (user.role === "student") {
          targetPath = "/student/overview";
        } else if (user.role === "teacher") {
          targetPath = "/teacher/overview";
        } else {
          console.warn("Unrecognized user role:", user.role);
        }
      }

      navigate(targetPath); // First: navigate
      onClose(); // Then close modal
    } catch (err) {
      console.error("Error in handleLoginSuccess:", err);
      alert("Login succeeded, but user data could not be fetched.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      const user = await fetchUser();

      let targetPath = "/onboarding";

      if (user && user.role) {
        if (user.role === "student") {
          targetPath = "/student/overview";
        } else if (user.role === "teacher") {
          targetPath = "/teacher/overview";
        }
      }

      navigate(targetPath);
      onClose();
    } catch (err) {
      console.error("Email/password login error:", err);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginError = (errorMessage) => {
    console.error("Google Sign-In Error:", errorMessage);
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

      <GoogleSignInButton
        onSuccess={handleLoginSuccess}
        onError={handleGoogleLoginError}
      />

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button onClick={onSwitchToSignUp} className="text-blue-600 hover:underline">
          Sign Up
        </button>
      </p>
    </motion.div>
  );
}
