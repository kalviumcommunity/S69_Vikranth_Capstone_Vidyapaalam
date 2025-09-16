import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star, Calendar, User, Settings, LogOut, PanelRightOpen, PanelLeftClose } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from "../contexts/AuthContext";

export default function TeacherLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user, logout: authLogout } = useAuth();
  const [displayedUserName, setDisplayedUserName] = useState("Guest");
  const [avatarInitials, setAvatarInitials] = useState("??");

  useEffect(() => {
    if (user && user.name) {
      setDisplayedUserName(user.name);
      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
      setAvatarInitials(initials.length > 0 ? initials : user.name[0].toUpperCase());
    } else {
      setDisplayedUserName("Teacher");
      setAvatarInitials("T");
    }
  }, [user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // On desktop, always keep sidebar open by default
      setSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Overview", to: "/teacher/overview", icon: Home },
    { name: "Ratings", to: "/teacher/ratings", icon: Star },
    { name: "Availability", to: "/teacher/availability", icon: Calendar },
    { name: "Profile", to: "/teacher/profile", icon: User },
    { name: "Settings", to: "/teacher/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await authLogout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout failed in TeacherLayout:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/teacher" || path === "/teacher/overview") return "Teacher Dashboard";
    if (path.includes("/ratings")) return "Your Ratings";
    if (path.includes("/availability")) return "Manage Availability";
    if (path === "/teacher/profile") return "Profile Overview";
    if (path === "/teacher/profile/edit") return "Edit Profile";
    if (path.includes("/settings")) return "Account Settings";
    return "Dashboard";
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans antialiased">
        {/* Mobile Overlay */}
        <AnimatePresence>
          {sidebarOpen && isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            x: isMobile && !sidebarOpen ? -288 : 0,
            width: sidebarOpen ? 288 : 64,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col overflow-hidden"
        >
          {/* Header (Logo) */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 h-16 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2" aria-label="VidyaPaalam Home">
              <span className="text-2xl font-extrabold text-orange-600">
                {sidebarOpen ? "VidyaPaalam" : "VP"}
              </span>
            </Link>
            {isMobile && sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Close sidebar"
              >
                <PanelLeftClose className="h-5 w-5 text-gray-600" />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center px-4 py-6 border-b border-gray-100 flex-shrink-0">
            <div className={`relative flex items-center justify-center bg-orange-100 text-orange-600 rounded-full font-bold border-2 border-orange-300 shadow-md transition-all duration-200
              ${sidebarOpen ? "h-16 w-16 text-2xl" : "h-10 w-10 text-lg"}`}>
              {avatarInitials}
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="mt-3 text-center"
              >
                <div className="text-lg font-semibold text-gray-900 truncate max-w-[200px]">{displayedUserName}</div>
                <div className="text-sm text-gray-500">Teacher</div>
              </motion.div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2 flex flex-col custom-scrollbar">
            {navItems.map(({ name, to, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Tooltip key={name}>
                  <TooltipTrigger asChild>
                    <Link
                      to={to}
                      className={`
                        flex items-center p-3 rounded-lg transition-all duration-200
                        ${active ? "bg-orange-100 text-orange-700 font-semibold" : "text-gray-700 hover:bg-orange-50"}
                        ${sidebarOpen ? "gap-3" : "justify-center"}
                      `}
                      aria-current={active ? "page" : undefined}
                      onClick={() => isMobile && setSidebarOpen(false)}
                    >
                      <Icon className={`${sidebarOpen ? "h-5 w-5" : "h-6 w-6"} ${active ? "text-orange-600" : "text-gray-500"}`} />
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="text-base"
                        >
                          {name}
                        </motion.span>
                      )}
                      {!sidebarOpen && <span className="sr-only">{name}</span>}
                    </Link>
                  </TooltipTrigger>
                  {!sidebarOpen && (
                    <TooltipContent side="right" className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md shadow-lg">
                      {name}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>

          {/* Logout Section */}
          <div className="px-4 py-4 border-t border-gray-100 flex-shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className={`
                    flex items-center w-full p-3 rounded-lg text-gray-700
                    hover:bg-orange-50 hover:text-orange-600 transition-all duration-200
                    ${sidebarOpen ? "gap-3" : "justify-center"}
                  `}
                >
                  <LogOut className={`${sidebarOpen ? "h-5 w-5" : "h-6 w-6"} text-gray-500`} />
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-base"
                    >
                      Logout
                    </motion.span>
                  )}
                  {!sidebarOpen && <span className="sr-only">Logout</span>}
                </button>
              </TooltipTrigger>
              {!sidebarOpen && (
                <TooltipContent side="right" className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md shadow-lg">
                  Logout
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col ml-0 ${sidebarOpen ? "md:ml-72" : "md:ml-16"}`}>
          {/* Header */}
          <header className="flex items-center gap-4 p-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30 h-16">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
            </button>
            <h1 className="text-xl font-bold text-gray-900 flex-grow truncate">{getPageTitle()}</h1>
            {!sidebarOpen && (
              <div className="h-10 w-10 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full text-lg font-bold">
                {avatarInitials}
              </div>
            )}
          </header>

          <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </TooltipProvider>
  );
}
