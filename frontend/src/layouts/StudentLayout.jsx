
// import { useState, useEffect } from "react"; // Added useEffect
// import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Home, Star, Settings, LogOut, Menu, X, Search } from "lucide-react"; // Added Search icon
// import { // Ensure these imports are correct based on your project setup
//   Tooltip,
//   TooltipProvider,
//   TooltipTrigger,
//   TooltipContent,
// } from "@/components/ui/tooltip";
// import { toast } from "@/hooks/use-toast";
// import { useAuth } from "../contexts/AuthContext"; // Import useAuth hook

// export default function StudentLayout() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const { user, logout: authLogout } = useAuth(); // Destructure user and rename logout from context

//   // State to hold the displayed name and initials, dynamic from AuthContext
//   const [displayedUserName, setDisplayedUserName] = useState("Guest");
//   const [avatarInitials, setAvatarInitials] = useState("?");

//   // Effect to update user name and initials when auth context user changes
//   useEffect(() => {
//     if (user && user.name) {
//       setDisplayedUserName(user.name);
//       // Generate initials from user's name
//       const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
//       setAvatarInitials(initials.length > 0 ? initials : user.name[0].toUpperCase());
//     } else {
//       // Default placeholder if user is not logged in or name is missing
//       setDisplayedUserName("Student");
//       setAvatarInitials("S");
//     }
//   }, [user]);

//   const navItems = [
//     { name: "Overview", to: "/student/overview", icon: Home },
//     { name: "Find Teacher", to: "/student/find-teacher", icon: Search }, // Changed icon to Search
//     { name: "Favorites", to: "/student/favorites", icon: Star },
//     { name: "Settings", to: "/student/settings", icon: Settings },
//   ];

//   const handleLogout = async () => {
//     try {
//       await authLogout(); // Use the logout function from AuthContext
//       toast({ title: "Logged out successfully" });
//       // authLogout function handles redirection, so no need to navigate here
//     } catch (error) {
//       console.error("Logout failed in StudentLayout:", error);
//       toast({ title: "Logout failed", description: "Please try again.", variant: "destructive" });
//     }
//   };

//   const getPageTitle = () => {
//     const path = location.pathname;
//     if (path === "/student" || path === "/student/overview") return "Overview";
//     if (path.startsWith("/student/find-teacher")) return "Find Teacher";
//     if (path.startsWith("/student/favorites")) return "Favorites";
//     if (path.startsWith("/student/settings")) return "Settings";
//     if (path.startsWith("/student/chat")) return "Chat";
//     if (
//       path.match(/^\/student\/teacher-profile\/.+/) ||
//       path.match(/^\/student\/teacher\/.+/)
//     )
//       return "Teacher Profile";
//     if (path.match(/^\/student\/book-session\/.+/)) return "Book Session";
//     return "Dashboard";
//   };

//   return (
//     <TooltipProvider>
//       <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans antialiased">
//         {/* Sidebar */}
//         <motion.aside
//           initial={false}
//           animate={{ width: sidebarOpen ? 288 : 80 }}
//           transition={{ duration: 0.3, ease: "easeInOut" }}
//           className="flex flex-col bg-white border-r border-gray-200 shadow-xl overflow-hidden fixed md:relative h-screen z-30"
//         >
//           {/* Header (Logo and Toggle Button) */}
//           <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 h-20 flex-shrink-0">
//             <Link to="/" className="flex items-center gap-2 overflow-hidden min-w-0" aria-label="VidyaPaalam Home">
//               <span className="text-3xl font-extrabold text-orange-600 whitespace-nowrap flex-shrink-0">
//                 {sidebarOpen ? "VidyaPaalam" : "VP"}
//               </span>
//             </Link>
//             <button
//               onClick={() => setSidebarOpen((o) => !o)}
//               className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md p-1 transition-colors duration-200"
//               aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
//             >
//               {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>

//           {/* User Info (Avatar and Name) */}
//           <div className="flex flex-col items-center px-6 py-6 border-b border-gray-100 pb-8 flex-shrink-0">
//             {/* User Avatar - dynamically sized */}
//             <div className={`relative flex items-center justify-center bg-orange-100 text-orange-600 rounded-full font-bold border-2 border-orange-300 shadow-md flex-shrink-0
//               ${sidebarOpen ? "h-20 w-20 text-3xl" : "h-10 w-10 text-lg"}`}>
//               {avatarInitials} {/* Display dynamic initials */}
//               <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
//             </div>
            
//             {/* User Name and Role - Conditionally rendered for smooth animation */}
//             {sidebarOpen && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1, duration: 0.2 }}
//                 className="mt-4 text-center overflow-hidden"
//               >
//                 <div className="text-xl font-bold text-gray-900 truncate">{displayedUserName}</div>
//                 <div className="text-sm text-gray-500">Student</div>
//               </motion.div>
//             )}
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-2 custom-scrollbar">
//             {navItems.map(({ name, to, icon: Icon }) => {
//               const active = location.pathname === to;
//               return (
//                 <Tooltip key={name} placement="right">
//                   <TooltipTrigger asChild>
//                     <Link
//                       to={to}
//                       className={`
//                         flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ease-in-out
//                         ${active ? "bg-orange-50 text-orange-700 font-semibold shadow-sm" : "text-gray-700 hover:bg-gray-100"}
//                         hover:text-orange-600 group relative
//                       `}
//                       aria-current={active ? "page" : undefined}
//                     >
//                       <Icon className={`h-6 w-6 ${active ? "text-orange-600" : "text-gray-500 group-hover:text-orange-500"}`} />
//                       {sidebarOpen && (
//                         <motion.span
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.1, duration: 0.2 }}
//                           className="text-lg whitespace-nowrap"
//                         >
//                           {name}
//                         </motion.span>
//                       )}
//                       {!sidebarOpen && (
//                         <span className="sr-only">{name}</span>
//                       )}
//                     </Link>
//                   </TooltipTrigger>
//                   {!sidebarOpen && (
//                     <TooltipContent side="right" className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md shadow-lg">
//                       <span>{name}</span>
//                     </TooltipContent>
//                   )}
//                 </Tooltip>
//               );
//             })}
//           </nav>

//           {/* Logout Section */}
//           <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
//             <Tooltip placement="right">
//               <TooltipTrigger asChild>
//                 <button
//                   onClick={handleLogout}
//                   className="
//                     flex items-center gap-4 w-full p-3 rounded-xl text-gray-700
//                     hover:text-orange-600 hover:bg-orange-50 font-medium transition-colors duration-200
//                   "
//                 >
//                   <LogOut className="h-6 w-6 text-gray-500 group-hover:text-orange-500" />
//                   {sidebarOpen && (
//                     <motion.span
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: 0.1, duration: 0.2 }}
//                       className="text-lg whitespace-nowrap"
//                     >
//                       Logout
//                     </motion.span>
//                   )}
//                   {!sidebarOpen && (
//                     <span className="sr-only">Logout</span>
//                   )}
//                 </button>
//               </TooltipTrigger>
//               {!sidebarOpen && (
//                 <TooltipContent side="right" className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md shadow-lg">
//                   <span>Logout</span>
//                 </TooltipContent>
//               )}
//             </Tooltip>
//           </div>
//         </motion.aside>

//         {/* Main Content Area */}
//         <div className="flex-1 flex flex-col relative md:static">
//           {/* Header for main content */}
//           <header className="flex items-center gap-4 p-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20 h-20">
//             {!sidebarOpen && (
//               <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="text-gray-600 md:hidden text-2xl p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 aria-label="Open sidebar"
//               >
//                 <Menu className="h-6 w-6" />
//               </button>
//             )}
//             <h1 className="text-2xl font-bold text-gray-900 flex-grow truncate">{getPageTitle()}</h1>
//             {/* Removed the redundant "JD" avatar from the header, as the main one in the sidebar is now dynamic and handles this */}
//           </header>

//           <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="max-w-full mx-auto"
//             >
//               <Outlet />
//             </motion.div>
//           </main>
//         </div>

//         {/* Overlay for mobile when sidebar is open */}
//         {sidebarOpen && (
//           <div
//             onClick={() => setSidebarOpen(false)}
//             className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
//             aria-hidden="true"
//           ></div>
//         )}
//       </div>
//     </TooltipProvider>
//   );
// }




import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Star, Settings, LogOut, Menu, X, Search } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  // Initialize sidebarOpen: always true for desktop, false for mobile
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const { user, logout: authLogout } = useAuth();

  const [displayedUserName, setDisplayedUserName] = useState("Guest");
  const [avatarInitials, setAvatarInitials] = useState("?");

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
      setDisplayedUserName("Student");
      setAvatarInitials("S");
    }
  }, [user]);

  // Handle window resize for responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // Always open sidebar on desktop
      } else {
        setSidebarOpen(false); // Always close sidebar by default on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  const navItems = [
    { name: "Overview", to: "/student/overview", icon: Home },
    { name: "Find Teacher", to: "/student/find-teacher", icon: Search },
    { name: "Favorites", to: "/student/favorites", icon: Star },
    { name: "Settings", to: "/student/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await authLogout();
      toast({ title: "Logged out successfully" });
      navigate("/"); // Redirect to home or login after logout
    } catch (error) {
      console.error("Logout failed in StudentLayout:", error);
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/student" || path === "/student/overview") return "Overview";
    if (path.startsWith("/student/find-teacher")) return "Find Teacher";
    if (path.startsWith("/student/favorites")) return "Favorites";
    if (path.startsWith("/student/settings")) return "Settings";
    if (path.startsWith("/student/chat")) return "Chat";
    if (path.match(/^\/student\/teacher-profile\/.+/) || path.match(/^\/student\/teacher\/.+/))
      return "Teacher Profile";
    if (path.match(/^\/student\/book-session\/.+/)) return "Book Session";
    return "Dashboard";
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans antialiased">
        {/* Mobile Overlay (Only visible when sidebar is open on small screens) */}
        <AnimatePresence>
          {sidebarOpen && window.innerWidth < 768 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              aria-hidden="true"
            ></motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          // On desktop, width is always 288. On mobile, it slides in/out.
          animate={{
            width: sidebarOpen ? 288 : (window.innerWidth >= 768 ? 288 : 0),
            x: sidebarOpen ? 0 : (window.innerWidth < 768 ? -288 : 0),
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`
            flex flex-col bg-white border-r border-gray-200 shadow-xl overflow-hidden
            fixed h-screen z-50
            md:relative md:translate-x-0 // Ensure it's relative on desktop, no translation
            ${!sidebarOpen && window.innerWidth < 768 ? 'hidden' : 'flex'} // Hide completely on mobile when closed
          `}
        >
          {/* Header (Logo) */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100 h-20 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 overflow-hidden min-w-0" aria-label="VidyaPaalam Home">
              <span className="text-3xl font-extrabold text-orange-600 whitespace-nowrap flex-shrink-0">
                VidyaPaalam
              </span>
            </Link>
            {/* Removed toggle button from here as it's now only in main header for mobile */}
          </div>

          {/* User Info (Avatar and Name) */}
          <div className="flex flex-col items-center px-6 py-6 border-b border-gray-100 pb-8 flex-shrink-0">
            {/* User Avatar */}
            <div className={`relative flex items-center justify-center bg-orange-100 text-orange-600 rounded-full font-bold border-2 border-orange-300 shadow-md flex-shrink-0
              h-20 w-20 text-3xl`}> {/* Always large on sidebar */}
              {avatarInitials}
              <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            
            {/* User Name and Role - Always visible in open sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="mt-4 text-center overflow-hidden"
            >
              <div className="text-xl font-bold text-gray-900 truncate">{displayedUserName}</div>
              <div className="text-sm text-gray-500">Student</div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-2 custom-scrollbar">
            {navItems.map(({ name, to, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={name}
                  to={to}
                  className={`
                    flex items-center p-3 rounded-xl transition-all duration-200 ease-in-out
                    ${active ? "bg-orange-50 text-orange-700 font-semibold shadow-sm" : "text-gray-700 hover:bg-gray-100"}
                    hover:text-orange-600 group relative gap-4 // Always gap-4 as sidebar is always open
                  `}
                  aria-current={active ? "page" : undefined}
                  onClick={() => window.innerWidth < 768 && setSidebarOpen(false)} // Close sidebar on mobile after clicking a link
                >
                  <Icon className={`h-6 w-6 ${active ? "text-orange-600" : "text-gray-500 group-hover:text-orange-500"}`} />
                  <span className="text-lg whitespace-nowrap">
                    {name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Section */}
          <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              onClick={handleLogout}
              className={`
                flex items-center w-full p-3 rounded-xl text-gray-700
                hover:text-orange-600 hover:bg-orange-50 font-medium transition-colors duration-200 gap-4 // Always gap-4 as sidebar is always open
              `}
            >
              <LogOut className="h-6 w-6 text-gray-500 group-hover:text-orange-500" />
              <span className="text-lg whitespace-nowrap">
                Logout
              </span>
            </button>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative md:static">
          {/* Header for main content */}
          <header className="flex items-center gap-4 p-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30 h-20">
            {/* Mobile menu button: Only appears on mobile (md breakpoint and below) */}
            {window.innerWidth < 768 && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 text-2xl p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900 flex-grow truncate">{getPageTitle()}</h1>
            {/* User Avatar in main header: Only on mobile when sidebar is closed */}
            {!sidebarOpen && window.innerWidth < 768 && (
                <div className="h-10 w-10 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full text-lg font-bold flex-shrink-0">
                    {avatarInitials}
                </div>
            )}
          </header>

          <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-full mx-auto"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
