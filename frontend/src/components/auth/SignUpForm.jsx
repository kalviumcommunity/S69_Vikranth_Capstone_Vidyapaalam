import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function SignUpForm({ onSwitchToSignIn, onClose }) {
  const { signup, googleSignIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirm: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    let ok = true;
    if (!formData.name) { e.name = "Name is required"; ok = false; }
    if (!formData.email) { e.email = "Email is required"; ok = false; }
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      e.email = "Enter a valid email"; ok = false;
    }
    if (formData.password.length < 6) {
      e.password = "Password must be at least 6 characters"; ok = false;
    }
    if (formData.password !== formData.confirm) {
      e.confirm = "Passwords do not match"; ok = false;
    }
    setErrors(e);
    return ok;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password);
      onClose();
      navigate("/onboarding");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const loggedInUser = await googleSignIn();
      onClose();

      if (loggedInUser) {
        navigate("/onboarding");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error("Google Sign-Up Error:", err);
      alert(err.message || "An unexpected error occurred during Google sign-up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 py-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-1">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-2 border rounded ${errors.name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

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

        <div>
          <label htmlFor="confirm" className="block text-sm font-semibold mb-1">Confirm Password</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            value={formData.confirm}
            onChange={e => setFormData({ ...formData, confirm: e.target.value })}
            className={`w-full px-4 py-2 border rounded ${errors.confirm ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.confirm && <p className="text-red-600 text-sm mt-1">{errors.confirm}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating Account…" : "Create Account"}
        </button>
      </form>

      <div className="relative flex items-center justify-center py-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="h-5 w-5" />
        {loading ? "Signing up with Google..." : "Sign up with Google"}
      </button>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button onClick={onSwitchToSignIn} className="text-blue-600 hover:underline">
          Sign In
        </button>
      </p>
    </motion.div>
  );
}