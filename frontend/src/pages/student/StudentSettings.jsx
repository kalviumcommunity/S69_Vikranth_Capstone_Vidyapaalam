import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../../contexts/AuthContext.jsx"; // Import useAuth

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function StudentSettingsCombined() {
  const { toast } = useToast();
  const { user, api, fetchUser, loading: authLoading } = useAuth();

  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [security, setSecurity] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [saving, setSaving] = useState(false); 

  useEffect(() => {
    
    if (!authLoading) {
      if (user) {
        setProfile({
          name: user.name || "", 
          email: user.email || "", 
          bio: user.bio || "",   
        });
      } else {
  
        setProfile({ name: "", email: "", bio: "" });
       
        console.warn("No user found in AuthContext. Please ensure user is logged in.");
      }
    }
  }, [user, authLoading]); 

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true); // Start saving
    try {
      
      await api.put("/user/profile", profile); 
      await fetchUser();
      toast({ title: "Profile saved successfully!" });
    } catch (err) {
      console.error("Error saving profile:", err.response?.data || err.message);
      toast({
        title: "Failed to save profile",
        description: err.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false); 
    }
  };

  const handlePassSave = async (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirm) {
      toast({ title: "Passwords must match", variant: "destructive" });
      return;
    }
    setSaving(true); 
    try {
      
      await api.post("/user/change-password", {
        currentPassword: security.current,
        newPassword: security.newPassword,
      }); 
      toast({ title: "Password updated successfully!" });
      setSecurity({ current: "", newPassword: "", confirm: "" }); 
    } catch (err) {
      console.error("Error updating password:", err.response?.data || err.message);
      toast({
        title: "Failed to update password",
        description: err.response?.data?.message || "Please try again. Check your current password.",
        variant: "destructive",
      });
    } finally {
      setSaving(false); 
    }
  };

  if (authLoading) {
    return (
      <motion.div
        className="max-w-3xl mx-auto p-6 text-center text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading settings...
      </motion.div>
    );
  }

  if (!user && !authLoading) {
    return (
      <motion.div
        className="max-w-3xl mx-auto p-6 text-center text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Please log in to view your account settings.
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 space-y-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <motion.h2
        variants={item}
        className="text-3xl sm:text-4xl font-bold text-center text-orange-600"
      >
        Account Settings
      </motion.h2>

      <motion.nav
        variants={item}
        className="flex justify-center space-x-4"
      >
        {[
          { id: "profile", label: "Profile" },
          { id: "security", label: "Security" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`
              px-4 py-2 font-medium rounded-lg transition
              ${tab === t.id
                ? "bg-orange-500 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
            `}
          >
            {t.label}
          </button>
        ))}
      </motion.nav>

      {tab === "profile" && (
        <motion.form
          variants={item}
          onSubmit={handleProfileSave}
          className="bg-white shadow rounded-lg p-6 space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800">Personal Info</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed from here.</p>
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                value={profile.bio}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, bio: e.target.value }))
                }
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition-shadow shadow disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </motion.form>
      )}

      {tab === "security" && (
        <motion.form
          variants={item}
          onSubmit={handlePassSave}
          className="bg-white shadow rounded-lg p-6 space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800">Change Password</h3>
          <div className="space-y-4">
            {[
              { id: "current", label: "Current Password" },
              { id: "newPassword", label: "New Password" },
              { id: "confirm", label: "Confirm Password" },
            ].map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="block text-sm font-medium text-gray-700">
                  {f.label}
                </label>
                <input
                  id={f.id}
                  type="password"
                  value={security[f.id]}
                  onChange={(e) =>
                    setSecurity((s) => ({ ...s, [f.id]: e.target.value }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition-shadow shadow disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
}