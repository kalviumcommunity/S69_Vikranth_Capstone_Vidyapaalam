import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { renderGoogleSignInButton } from "../../utils/googleAuth.js";

export default function SignInForm({ onSwitchToSignUp, onClose }) {
  const { login, fetchUser, api } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const googleButtonRef = useRef();

  useEffect(() => {
    renderGoogleSignInButton(
      async (credential) => {
        try {
          const { data } = await api.post("/auth/google-login", { credential });
          await fetchUser();
          onClose();

          const role = data?.user?.role;
          if (role === "student") navigate("/student/overview");
          else if (role === "teacher") navigate("/teacher/overview");
          else navigate("/onboarding");
        } catch (err) {
          alert(err?.response?.data?.message || "Google login failed");
        }
      },
      (error) => {
        console.error("Google Sign-In error:", error);
        alert("Google Sign-In failed");
      }
    );
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const loggedInUser = await login(formData.email, formData.password);
      onClose();

      if (loggedInUser && loggedInUser.role) {
        if (loggedInUser.role === "student") {
          navigate("/student/overview");
        } else if (loggedInUser.role === "teacher") {
          navigate("/teacher/overview");
        } else {
          console.warn("User logged in with an unrecognized role:", loggedInUser.role);
          navigate("/");
        }
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
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

      {/* Google Sign-In Button (Rendered via ref) */}
      <div ref={googleButtonRef} id="google-signin-button" className="w-full flex justify-center mt-4" />

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button onClick={onSwitchToSignUp} className="text-blue-600 hover:underline">
          Sign Up
        </button>
      </p>
    </motion.div>
  );
}
