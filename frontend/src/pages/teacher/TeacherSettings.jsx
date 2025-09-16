import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const TeacherSettings = () => {
  const [activePage, setActivePage] = useState("security");
  const [formData, setFormData] = useState({
    email: "teacher@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    bookings: false,
    messages: true,
    reminders: false,
    marketing: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    alert("Your password has been updated.");
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const handleToggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    alert(
      `${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${
        notifications[key] ? "disabled" : "enabled"
      }.`
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-10 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto space-y-8 bg-white"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-900 mb-2">
          Account Settings
        </h2>
        <p className="text-gray-600">Manage your preferences and security.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-md font-medium transition ${
            activePage === "security"
              ? "bg-orange-500 text-white"
              : "border border-orange-500 text-orange-500"
          }`}
          onClick={() => setActivePage("security")}
        >
          Security
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium transition ${
            activePage === "notifications"
              ? "bg-orange-500 text-white"
              : "border border-orange-500 text-orange-500"
          }`}
          onClick={() => setActivePage("notifications")}
        >
          Notifications
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activePage === "security" ? (
          <motion.div
            key="security"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Password Card */}
            <Card className="shadow-md border-gray-100 rounded-lg">
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="email" className="font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500">
                      To change email, contact support.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="current-password" className="font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="new-password" className="font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="confirm-password" className="font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-semibold"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* 2FA */}
            <Card className="shadow-md border-gray-100 rounded-lg">
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-500">
                    Require a verification code on login.
                  </p>
                </div>
                <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-500 hover:text-white transition">
                  Enable
                </button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="notifications"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="shadow-md border-gray-100 rounded-lg">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose which notifications you receive.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "email", label: "Email Notifications" },
                  { key: "bookings", label: "Booking Notifications" },
                  { key: "messages", label: "Message Notifications" },
                  { key: "reminders", label: "Session Reminders" },
                  { key: "marketing", label: "Marketing Emails" },
                ].map(({ key, label }) => (
                  <div
                    className="flex items-center justify-between"
                    key={key}
                  >
                    <div>
                      <label className="text-gray-700 font-medium">
                        {label}
                      </label>
                      <p className="text-sm text-gray-500">
                        {label}.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications[key]}
                      onChange={() => handleToggleNotification(key)}
                      className="w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500 rounded"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeacherSettings;
