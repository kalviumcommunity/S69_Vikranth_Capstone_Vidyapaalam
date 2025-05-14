

// // src/layouts/TeacherLayout.jsx
// import React, { useState } from "react";
// import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   SidebarProvider,
//   Sidebar,
//   SidebarHeader,
//   SidebarContent,
//   SidebarFooter,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { Button } from "@/components/ui/button";
// import { LogOut, Home, Star, Calendar, User, Settings } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { toast } from "@/hooks/use-toast";

// const TeacherLayout = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [userName] = useState("Jane Smith");

//   const handleLogout = () => {
//     toast({ title: "Logged out successfully" });
//     navigate("/");
//   };

//   // Helper to detect profile routes
//   const isProfileActive =
//     location.pathname === "/teacher/profile" ||
//     location.pathname === "/teacher/profile/edit";

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen">
//         <Sidebar className="fixed top-0 left-0 h-full z-20">
//           <SidebarHeader className="flex flex-col items-center pb-4">
//             <Link to="/" className="flex items-center gap-2 px-4 py-2">
//               <span className="text-xl font-bold gradient-text">VidyaPaalam</span>
//             </Link>
//             <div className="flex items-center mt-4 gap-2">
//               <Avatar className="h-10 w-10">
//                 <AvatarImage src="/placeholder.svg" />
//                 <AvatarFallback>JS</AvatarFallback>
//               </Avatar>
//               <div className="flex flex-col items-start">
//                 <span className="text-sm font-medium">{userName}</span>
//                 <span className="text-xs text-muted-foreground">Teacher</span>
//               </div>
//             </div>
//           </SidebarHeader>

//           <SidebarContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton
//                   asChild
//                   isActive={location.pathname === "/teacher/overview"}
//                 >
//                   <Link to="/teacher/overview">
//                     <Home className="h-4 w-4" />
//                     <span>Overview</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>

//               <SidebarMenuItem>
//                 <SidebarMenuButton
//                   asChild
//                   isActive={location.pathname === "/teacher/ratings"}
//                 >
//                   <Link to="/teacher/ratings">
//                     <Star className="h-4 w-4" />
//                     <span>Ratings</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>

//               <SidebarMenuItem>
//                 <SidebarMenuButton
//                   asChild
//                   isActive={location.pathname === "/teacher/availability"}
//                 >
//                   <Link to="/teacher/availability">
//                     <Calendar className="h-4 w-4" />
//                     <span>Availability</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>

//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild isActive={isProfileActive}>
//                   <Link to="/teacher/profile">
//                     <User className="h-4 w-4" />
//                     <span>Profile</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>

//               <SidebarMenuItem>
//                 <SidebarMenuButton
//                   asChild
//                   isActive={location.pathname === "/teacher/settings"}
//                 >
//                   <Link to="/teacher/settings">
//                     <Settings className="h-4 w-4" />
//                     <span>Settings</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarContent>

//           <SidebarFooter className="p-4">
//             <Button
//               variant="outline"
//               className="w-full justify-start"
//               onClick={handleLogout}
//             >
//               <LogOut className="mr-2 h-4 w-4" />
//               Logout
//             </Button>
//           </SidebarFooter>
//         </Sidebar>

//         <div className="flex-1 overflow-auto ml-[240px]">
//           <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60">
//             <div className="flex h-14 items-center px-4">
//               <SidebarTrigger />
//               <h1 className="ml-4 text-xl font-semibold">
//                 {location.pathname.includes("/overview") && "Teacher Dashboard"}
//                 {location.pathname.includes("/ratings") && "Your Ratings"}
//                 {location.pathname.includes("/availability") && "Manage Availability"}
//                 {location.pathname === "/teacher/profile" && "Profile Overview"}
//                 {location.pathname === "/teacher/profile/edit" && "Edit Profile"}
//                 {location.pathname.includes("/settings") && "Account Settings"}
//               </h1>
//               <div className="ml-auto flex items-center gap-2">
//                 <Avatar className="h-8 w-8">
//                   <AvatarImage src="/placeholder.svg" />
//                   <AvatarFallback>JS</AvatarFallback>
//                 </Avatar>
//               </div>
//             </div>
//           </header>

//           <main className="p-4">
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="container max-w-7xl"
//             >
//               <Outlet />
//             </motion.div>
//           </main>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default TeacherLayout;



import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Star, Calendar, User, Settings, LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

export default function TeacherLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const userName = "Jane Smith";

  const navItems = [
    { name: "Overview",     to: "/teacher/overview",     icon: Home     },
    { name: "Ratings",      to: "/teacher/ratings",      icon: Star     },
    { name: "Availability", to: "/teacher/availability", icon: Calendar },
    { name: "Profile",      to: "/teacher/profile",      icon: User     },
    { name: "Settings",     to: "/teacher/settings",     icon: Settings },
  ];

  const handleLogout = () => {
    toast({ title: "Logged out successfully" });
    navigate("/");
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`
            flex flex-col bg-white border-r
            transition-all duration-300 ease-in-out
            ${sidebarOpen ? "w-72" : "w-20"}
            overflow-x-hidden
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b">
            <Link to="/" className="flex items-center gap-3">
              <span className="text-3xl font-bold text-orange-500">
                {sidebarOpen ? "VidyaPaalam" : "VP"}
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="text-gray-600 focus:outline-none text-2xl"
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* User Info */}
          <div className="flex flex-col items-center p-6 border-b">
            <div className="h-16 w-16 flex items-center justify-center bg-orange-100 text-orange-500 rounded-full text-2xl font-bold">
              JS
            </div>
            {sidebarOpen && (
              <div className="mt-4 text-center">
                <div className="text-lg font-semibold">{userName}</div>
                <div className="text-sm text-gray-500">Teacher</div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-6 space-y-6">
            {navItems.map(({ name, to, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Tooltip key={name} placement="right">
                  <TooltipTrigger asChild>
                    <Link
                      to={to}
                      className={`
                        flex items-center gap-5 p-4 rounded-lg transition-all
                        ${active ? "bg-orange-100 text-orange-600" : "text-gray-700"}
                        hover:bg-orange-50
                      `}
                    >
                      <Icon className="h-7 w-7" />
                      {sidebarOpen && (
                        <span className="text-lg font-medium">{name}</span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {!sidebarOpen && (
                    <TooltipContent>
                      <span>{name}</span>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-6 border-t">
            <Tooltip placement="right">
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="
                    flex items-center gap-5 w-full text-gray-700
                    hover:text-orange-600 hover:bg-orange-50 p-4 rounded-lg text-lg font-medium
                  "
                >
                  <LogOut className="h-7 w-7" />
                  {sidebarOpen && <span>Logout</span>}
                </button>
              </TooltipTrigger>
              {!sidebarOpen && (
                <TooltipContent>
                  <span>Logout</span>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="flex items-center gap-4 p-4 bg-white border-b sticky top-0 z-10">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-600 md:hidden text-2xl"
              >
                ☰
              </button>
            )}
            <h1 className="text-lg font-semibold text-gray-800">
              {location.pathname.includes("/overview")     && "Teacher Dashboard"}
              {location.pathname.includes("/ratings")      && "Your Ratings"}
              {location.pathname.includes("/availability") && "Manage Availability"}
              {location.pathname === "/teacher/profile"    && "Profile Overview"}
              {location.pathname === "/teacher/profile/edit" && "Edit Profile"}
              {location.pathname.includes("/settings")     && "Account Settings"}
            </h1>
          </header>
          <main className="flex-1 p-6">
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
    </TooltipProvider>
  );
}
