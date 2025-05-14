

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { useToast } from "@/hooks/use-toast";

// const StudentSettingsCombined = () => {
//   const { toast } = useToast();
//   const [activeTab, setActiveTab] = useState("profile");
//   const [profileData, setProfileData] = useState({
//     name: "John Doe",
//     email: "john.doe@example.com",
//     bio: "Student interested in learning yoga and guitar.",
//   });
//   const [securityData, setSecurityData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [notificationSettings, setNotificationSettings] = useState({
//     email: true,
//     sessions: true,
//     messages: true,
//     marketing: false,
//   });

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//   };

//   // Profile Settings Handlers
//   const handleProfileChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSaveProfile = (e) => {
//     e.preventDefault();
//     toast({
//       title: "Profile updated successfully",
//     });
//   };

//   // Security Settings Handlers
//   const handleSecurityChange = (e) => {
//     const { name, value } = e.target;
//     setSecurityData(prev => ({ ...prev, [name]: value }));
//   };

//   const handlePasswordChange = (e) => {
//     e.preventDefault();

//     if (securityData.newPassword !== securityData.confirmPassword) {
//       toast({
//         title: "Passwords don't match",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (securityData.newPassword.length < 8) {
//       toast({
//         title: "Password must be at least 8 characters",
//         variant: "destructive",
//       });
//       return;
//     }

//     toast({
//       title: "Password updated successfully",
//     });

//     setSecurityData({
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });
//   };

//   // Notification Settings Handlers
//   const handleToggleNotification = (key) => {
//     setNotificationSettings(prev => ({
//       ...prev,
//       [key]: !prev[key],
//     }));

//     toast({
//       title: "Notification preferences updated",
//     });
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="space-y-8 max-w-3xl mx-auto p-6"
//     >
//       <div className="text-center mb-6">
//         <h2 className="text-3xl font-bold text-orange-600 mb-2">Account Settings</h2>
//         <p className="text-lg text-gray-600">Manage your account preferences and settings.</p>
//       </div>

//       <div className="flex space-x-4 mb-4 justify-center">
//         <button
//           onClick={() => handleTabChange("profile")}
//           className={`px-4 py-2 rounded-md font-semibold transition-colors ${
//             activeTab === "profile" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//           }`}
//         >
//           Profile
//         </button>
//         <button
//           onClick={() => handleTabChange("security")}
//           className={`px-4 py-2 rounded-md font-semibold transition-colors ${
//             activeTab === "security" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//           }`}
//         >
//           Security
//         </button>
//         <button
//           onClick={() => handleTabChange("notifications")}
//           className={`px-4 py-2 rounded-md font-semibold transition-colors ${
//             activeTab === "notifications" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//           }`}
//         >
//           Notifications
//         </button>
//       </div>

//       {activeTab === "profile" && (
//         <Card className="shadow-xl rounded-lg">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg font-semibold text-gray-800">Personal Information</CardTitle>
//             <CardDescription className="text-sm text-gray-500">
//               Update your personal information and public profile.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <form onSubmit={handleSaveProfile} className="space-y-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="name" className="text-sm font-medium text-gray-700">Display Name</Label>
//                 <Input
//                   id="name"
//                   name="name"
//                   value={profileData.name}
//                   onChange={handleProfileChange}
//                   className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   value={profileData.email}
//                   onChange={handleProfileChange}
//                   className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
//                 <textarea
//                   id="bio"
//                   name="bio"
//                   className="min-h-[100px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   placeholder="Tell us about yourself..."
//                   value={profileData.bio}
//                   onChange={handleProfileChange}
//                 />
//               </div>

//               <div className="flex justify-end">
//                 <Button type="submit" className="bg-orange-600 text-white hover:bg-orange-700 rounded-md shadow">Save Changes</Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       )}

//       {activeTab === "security" && (
//         <Card className="shadow-xl rounded-lg">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg font-semibold text-gray-800">Password</CardTitle>
//             <CardDescription className="text-sm text-gray-500">
//               Change your password to protect your account.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <form onSubmit={handlePasswordChange} className="space-y-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="current-password" className="text-sm font-medium text-gray-700">Current Password</Label>
//                 <Input
//                   id="current-password"
//                   name="currentPassword"
//                   type="password"
//                   value={securityData.currentPassword}
//                   onChange={handleSecurityChange}
//                   className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">New Password</Label>
//                 <Input
//                   id="new-password"
//                   name="newPassword"
//                   type="password"
//                   value={securityData.newPassword}
//                   onChange={handleSecurityChange}
//                   className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">Confirm New Password</Label>
//                 <Input
//                   id="confirm-password"
//                   name="confirmPassword"
//                   type="password"
//                   value={securityData.confirmPassword}
//                   onChange={handleSecurityChange}
//                   className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 />
//               </div>

//               <div className="flex justify-end">
//                 <Button type="submit" className="bg-orange-600 text-white hover:bg-orange-700 rounded-md shadow">Update Password</Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       )}

//       {activeTab === "notifications" && (
//         <Card className="shadow-xl rounded-lg">
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg font-semibold text-gray-800">Notification Preferences</CardTitle>
//             <CardDescription className="text-sm text-gray-500">
//               Choose what notifications you want to receive.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label className="text-sm font-medium text-gray-700">Email Notifications</Label>
//                 <p className="text-sm text-gray-500">
//                   Receive updates via email
//                 </p>
//               </div>
//               <Switch
//                 checked={notificationSettings.email}
//                 onCheckedChange={() => handleToggleNotification("email")}
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label className="text-sm font-medium text-gray-700">Session Reminders</Label>
//                 <p className="text-sm text-gray-500">
//                   Get notified about upcoming sessions
//                 </p>
//               </div>
//               <Switch
//                 checked={notificationSettings.sessions}
//                 onCheckedChange={() => handleToggleNotification("sessions")}
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label className="text-sm font-medium text-gray-700">Message Notifications</Label>
//                 <p className="text-sm text-gray-500">
//                   Get notified when you receive a message
//                 </p>
//               </div>
//               <Switch
//                 checked={notificationSettings.messages}
//                 onCheckedChange={() => handleToggleNotification("messages")}
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label className="text-sm font-medium text-gray-700">Marketing Emails</Label>
//                 <p className="text-sm text-gray-500">
//                   Receive updates on new features and promotions
//                 </p>
//               </div>
//               <Switch
//                 checked={notificationSettings.marketing}
//                 onCheckedChange={() => handleToggleNotification("marketing")}
//               />
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </motion.div>
//   );
// };

// export default StudentSettingsCombined;


// src/pages/student/StudentSettingsCombined.jsx
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
