// src/pages/student/StudentSettingsCombined.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

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
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Avid learner",
  });
  const [security, setSecurity] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [notify, setNotify] = useState({
    email: true,
    sessions: true,
    messages: true,
    marketing: false,
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast({ title: "Profile saved!" });
  };

  const handlePassSave = (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirm) {
      toast({ title: "Passwords must match", variant: "destructive" });
      return;
    }
    toast({ title: "Password updated!" });
    setSecurity({ current: "", newPassword: "", confirm: "" });
  };

  const toggleNotify = (key) => {
    setNotify((n) => ({ ...n, [key]: !n[key] }));
    toast({ title: "Preference updated" });
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-6 space-y-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* Title */}
      <motion.h2
        variants={item}
        className="text-3xl sm:text-4xl font-bold text-center text-orange-600"
      >
        Account Settings
      </motion.h2>

      {/* Tabs */}
      <motion.nav
        variants={item}
        className="flex justify-center space-x-4"
      >
        {[
          { id: "profile", label: "Profile" },
          { id: "security", label: "Security" },
          { id: "notifications", label: "Notifications" },
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

      {/* Profile Form */}
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
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
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
              className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition-shadow shadow"
            >
              Save Profile
            </button>
          </div>
        </motion.form>
      )}

      {/* Security Form */}
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
              className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition-shadow shadow"
            >
              Update Password
            </button>
          </div>
        </motion.form>
      )}

      {/* Notifications */}
      {tab === "notifications" && (
        <motion.div
          variants={item}
          className="bg-white shadow rounded-lg p-6 space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-800">Notifications</h3>
          <div className="space-y-4">
            {[
              { key: "email", label: "Email Alerts" },
              { key: "sessions", label: "Session Reminders" },
              { key: "messages", label: "Message Notifications" },
              { key: "marketing", label: "Marketing Emails" },
            ].map((n) => (
              <div
                key={n.key}
                className="flex justify-between items-center"
              >
                <span className="text-sm text-gray-700">{n.label}</span>
                {/* Toggle Switch */}
                <label className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    checked={notify[n.key]}
                    onChange={() => toggleNotify(n.key)}
                    className="peer sr-only"
                  />
                  <span className="block w-full h-full bg-gray-300 rounded-full transition-colors peer-checked:bg-orange-500" />
                  <span className="absolute top-1 left-1 w-4 h-4 bg-white border border-gray-200 rounded-full transition-transform peer-checked:translate-x-6" />
                </label>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
