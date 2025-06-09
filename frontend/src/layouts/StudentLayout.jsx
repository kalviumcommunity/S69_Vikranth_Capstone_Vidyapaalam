

// import { useState } from "react";
// import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Home, Star, Calendar, User, Settings, LogOut } from "lucide-react";
// import {
//   Tooltip,
//   TooltipProvider,
//   TooltipTrigger,
//   TooltipContent,
// } from "@/components/ui/tooltip";
// import { toast } from "@/hooks/use-toast";

// export default function StudentLayout() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const userName = "John Doe";

//   const navItems = [
//     { name: "Overview", to: "/student/overview", icon: Home },
//     { name: "Find Teacher", to: "/student/find-teacher", icon: Star },
//     { name: "Favorites", to: "/student/favorites", icon: Star },
//     { name: "Settings", to: "/student/settings", icon: Settings },
//   ];

//   const handleLogout = () => {
//     toast({ title: "Logged out successfully" });
//     navigate("/");
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
//     return "";
//   };

//   return (
//     <TooltipProvider>
//       <div className="flex min-h-screen bg-gray-100">
//         {/* Sidebar */}
//         <aside
//           className={`
//             flex flex-col bg-white border-r
//             transition-all duration-300 ease-in-out
//             ${sidebarOpen ? "w-72" : "w-20"}
//             overflow-x-hidden
//           `}
//         >
//           {/* Header */}
//           <div className="flex items-center justify-between p-5 border-b">
//             <Link to="/" className="flex items-center gap-3">
//               <span className="text-3xl font-bold text-orange-500">
//                 {sidebarOpen ? "VidyaPaalam" : "VP"}
//               </span>
//             </Link>
//             <button
//               onClick={() => setSidebarOpen((o) => !o)}
//               className="text-gray-600 focus:outline-none text-2xl"
//             >
//               {sidebarOpen ? "✕" : "☰"}
//             </button>
//           </div>

//           {/* User Info */}
//           <div className="flex flex-col items-center p-6 border-b">
//             <div className="h-16 w-16 flex items-center justify-center bg-orange-100 text-orange-500 rounded-full text-2xl font-bold">
//               JD
//             </div>
//             {sidebarOpen && (
//               <div className="mt-4 text-center">
//                 <div className="text-lg font-semibold">{userName}</div>
//                 <div className="text-sm text-gray-500">Student</div>
//               </div>
//             )}
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 overflow-y-auto p-6 space-y-6">
//             {navItems.map(({ name, to, icon: Icon }) => {
//               const active = location.pathname === to;
//               return (
//                 <Tooltip key={name} placement="right">
//                   <TooltipTrigger asChild>
//                     <Link
//                       to={to}
//                       className={`
//                         flex items-center gap-5 p-4 rounded-lg transition-all
//                         ${active ? "bg-orange-100 text-orange-600" : "text-gray-700"}
//                         hover:bg-orange-50
//                       `}
//                     >
//                       <Icon className="h-7 w-7" />
//                       {sidebarOpen && (
//                         <span className="text-lg font-medium">{name}</span>
//                       )}
//                     </Link>
//                   </TooltipTrigger>
//                   {!sidebarOpen && (
//                     <TooltipContent>
//                       <span>{name}</span>
//                     </TooltipContent>
//                   )}
//                 </Tooltip>
//               );
//             })}
//           </nav>

//           {/* Logout */}
//           <div className="p-6 border-t">
//             <Tooltip placement="right">
//               <TooltipTrigger asChild>
//                 <button
//                   onClick={handleLogout}
//                   className="
//                     flex items-center gap-5 w-full text-gray-700
//                     hover:text-orange-600 hover:bg-orange-50 p-4 rounded-lg text-lg font-medium
//                   "
//                 >
//                   <LogOut className="h-7 w-7" />
//                   {sidebarOpen && <span>Logout</span>}
//                 </button>
//               </TooltipTrigger>
//               {!sidebarOpen && (
//                 <TooltipContent>
//                   <span>Logout</span>
//                 </TooltipContent>
//               )}
//             </Tooltip>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <div className="flex-1 flex flex-col">
//           <header className="flex items-center gap-4 p-4 bg-white border-b sticky top-0 z-10">
//             {!sidebarOpen && (
//               <button
//                 onClick={() => setSidebarOpen(true)}
//                 className="text-gray-600 md:hidden text-2xl"
//               >
//                 ☰
//               </button>
//             )}
//             <h1 className="text-lg font-semibold text-gray-800">{getPageTitle()}</h1>
//           </header>

//           <main className="flex-1 p-6">
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="max-w-7xl mx-auto"
//             >
//               <Outlet />
//             </motion.div>
//           </main>
//         </div>
//       </div>
//     </TooltipProvider>
//   );
// }

import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Star, Settings, LogOut, Menu, X } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const userName = "John Doe";

  const navItems = [
    { name: "Overview", to: "/student/overview", icon: Home },
    { name: "Find Teacher", to: "/student/find-teacher", icon: Star },
    { name: "Favorites", to: "/student/favorites", icon: Star },
    { name: "Settings", to: "/student/settings", icon: Settings },
  ];

  const handleLogout = () => {
    toast({ title: "Logged out successfully" });
    navigate("/");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/student" || path === "/student/overview") return "Overview";
    if (path.startsWith("/student/find-teacher")) return "Find Teacher";
    if (path.startsWith("/student/favorites")) return "Favorites";
    if (path.startsWith("/student/settings")) return "Settings";
    if (path.startsWith("/student/chat")) return "Chat";
    if (
      path.match(/^\/student\/teacher-profile\/.+/) ||
      path.match(/^\/student\/teacher\/.+/)
    )
      return "Teacher Profile";
    if (path.match(/^\/student\/book-session\/.+/)) return "Book Session";
    return "Dashboard"; 
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans antialiased">
        {/* Sidebar */}
        <motion.aside
          initial={false} 
          animate={{ width: sidebarOpen ? 288 : 80 }} 
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex flex-col bg-white border-r border-gray-200 shadow-xl overflow-hidden fixed md:relative h-screen z-30"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 h-20 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 overflow-hidden" aria-label="VidyaPaalam Home">
              <span className="text-3xl font-extrabold text-orange-600 whitespace-nowrap">
                {sidebarOpen ? "VidyaPaalam" : "VP"}
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-md p-1 transition-colors duration-200"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center p-6 border-b border-gray-100 pb-8 flex-shrink-0">
            <div className="relative h-20 w-20 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full text-3xl font-bold border-2 border-orange-300 shadow-md">
              JD
              <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="mt-4 text-center overflow-hidden"
              >
                <div className="text-xl font-bold text-gray-900 truncate">{userName}</div>
                <div className="text-sm text-gray-500">Student</div>
              </motion.div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {navItems.map(({ name, to, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Tooltip key={name} placement="right">
                  <TooltipTrigger asChild>
                    <Link
                      to={to}
                      className={`
                        flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ease-in-out
                        ${active ? "bg-orange-50 text-orange-700 font-semibold shadow-sm" : "text-gray-700 hover:bg-gray-100"}
                        hover:text-orange-600 group relative
                      `}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className={`h-6 w-6 ${active ? "text-orange-600" : "text-gray-500 group-hover:text-orange-500"}`} />
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.2 }}
                          className="text-lg whitespace-nowrap"
                        >
                          {name}
                        </motion.span>
                      )}
                      {!sidebarOpen && (
                        <span className="sr-only">{name}</span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {!sidebarOpen && (
                    <TooltipContent side="right" className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md shadow-lg">
                      <span>{name}</span>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100 flex-shrink-0">
            <Tooltip placement="right">
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="
                    flex items-center gap-4 w-full p-3 rounded-xl text-gray-700
                    hover:text-orange-600 hover:bg-orange-50 font-medium transition-colors duration-200
                  "
                >
                  <LogOut className="h-6 w-6 text-gray-500 group-hover:text-orange-500" />
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                      className="text-lg whitespace-nowrap"
                    >
                      Logout
                    </motion.span>
                  )}
                  {!sidebarOpen && (
                    <span className="sr-only">Logout</span>
                  )}
                </button>
              </TooltipTrigger>
              {!sidebarOpen && (
                <TooltipContent side="right" className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md shadow-lg">
                  <span>Logout</span>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </motion.aside>

        
        <div className="flex-1 flex flex-col relative md:static">

          <header className="flex items-center gap-4 p-4 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20 h-20">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 md:hidden text-2xl p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900 flex-grow truncate">{getPageTitle()}</h1>
            {!sidebarOpen && (
                 <div className="h-10 w-10 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full text-lg font-bold flex-shrink-0">JD</div>
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

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            aria-hidden="true"
          ></div>
        )}
      </div>
    </TooltipProvider>
  );
}