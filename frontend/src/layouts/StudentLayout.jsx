import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  Home,
  Star,
  Calendar,
  User,
  Settings,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function TeacherLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const userName = "Jane Smith";

  const handleLogout = () => {
    toast({ title: "Logged out successfully" });
    navigate("/");
  };

  const navigation = [
    { name: "Overview",     href: "/teacher/overview",     icon: Home     },
    { name: "Ratings",      href: "/teacher/ratings",      icon: Star     },
    { name: "Availability", href: "/teacher/availability", icon: Calendar },
    { name: "Profile",      href: "/teacher/profile",      icon: User     },
    { name: "Settings",     href: "/teacher/settings",     icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 224 : 64 }} // 14rem / 4rem
        transition={{ type: "tween", duration: 0.2 }}
        className="flex flex-col bg-white border-r overflow-hidden"
        aria-expanded={sidebarOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-bold text-orange-500">
              {sidebarOpen ? "VidyaPaalam" : "VP"}
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Menu className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center p-3 border-b">
          <div className="h-10 w-10 flex items-center justify-center bg-orange-100 text-orange-500 rounded-full font-semibold text-sm">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          {sidebarOpen && (
            <div className="mt-1 text-center">
              <div className="text-sm font-medium text-gray-800">
                {userName}
              </div>
              <div className="text-xs text-gray-500">Teacher</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md transition
                  ${isActive
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-700 hover:bg-orange-50"}
                `}
              >
                <item.icon className="h-4 w-4" />
                {sidebarOpen && <span className="text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-auto p-2 border-t">
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-2 w-full text-left
              text-gray-700 hover:text-orange-600 hover:bg-orange-50
              px-3 py-2 rounded-md transition
            "
          >
            <LogOut className="h-4 w-4" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-3 p-3 bg-white border-b sticky top-0 z-10">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 md:hidden"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
          )}
          <h1 className="text-md font-semibold text-gray-800">
            {location.pathname === "/teacher/overview"     && "Overview"}
            {location.pathname === "/teacher/ratings"      && "Your Ratings"}
            {location.pathname === "/teacher/availability" && "Manage Availability"}
            {location.pathname === "/teacher/profile"      && "Profile Overview"}
            {location.pathname === "/teacher/settings"     && "Account Settings"}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
