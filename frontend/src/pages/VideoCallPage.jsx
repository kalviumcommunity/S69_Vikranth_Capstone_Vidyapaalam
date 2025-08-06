// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   StreamVideo,
//   StreamCall,
//   CallControls,
//   CallParticipantsList,
//   StreamTheme,
//   ParticipantView,
//   useCallStateHooks,
//   SpeakerLayout,
// } from "@stream-io/video-react-sdk";
// import { useStreamVideo } from "../contexts/StreamVideoContext";
// import { useAuth } from "../contexts/AuthContext";
// import { Users, X } from "lucide-react";
// import "@stream-io/video-react-sdk/dist/css/styles.css";

// const customStyles = `
//   .str-video {
//     --str-video__primary-color: #1a73e8;
//     --str-video__secondary-color: #34a853;
//     --str-video__text-color1: #ffffff;
//     --str-video__text-color2: #ffffff;
//     --str-video__background-color: #202124;
//     --str-video__popover-background: #303134;
//     --str-video__popover-text-color: #ffffff;
//     --str-video__popover-box-shadow: 0 4px 16px rgba(0,0,0,0.3);
//   }
//   .str-video__participant-view {
//     border-radius: 12px;
//     overflow: hidden;
//     box-shadow: 0 2px 6px rgba(0,0,0,0.3);
//     background: #202124;
//   }
//   .str-video__participant-name {
//     color: #ffffff !important;
//   }
//   .str-video__participants-list__item-name {
//     color: #ffffff !important;
//     background: #303134;
//     padding: 0.75rem;
//     border-radius: 8px;
//     transition: background 0.2s ease;
//   }
//   .str-video__participants-list__item-name:hover {
//     background: rgba(26, 115, 232, 0.2);
//   }
// `;

// const VideoGridLayout = () => {
//   const { useParticipants } = useCallStateHooks();
//   const participants = useParticipants();

//   return (
//     <div className="video-grid">
//       {participants.map((p) => (
//         <div
//           key={p.sessionId}
//           className="rounded-lg overflow-hidden bg-gray-800 transition-transform hover:scale-[1.02]"
//         >
//           <ParticipantView participant={p} />
//         </div>
//       ))}
//     </div>
//   );
// };

// const VideoCallPage = () => {
//   const { videoClient, isClientReady } = useStreamVideo();
//   const { user } = useAuth();
//   const { callId } = useParams();
//   const navigate = useNavigate();
//   const [call, setCall] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [error, setError] = useState(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   const navigatePath = user?.role === "teacher" ? "/teacher/overview" : "/student/overview";

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth < 768 && sidebarOpen) setSidebarOpen(false);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [sidebarOpen]);

//   useEffect(() => {
//     if (!isClientReady || !user?.id || !callId || !videoClient) {
//       setError("Unable to start the video call. Please check your connection and try again.");
//       return;
//     }
//     if (call) return;

//     const createAndJoinCall = async () => {
//       try {
//         const newCall = videoClient.call("default", callId);
//         await newCall.join({ create: true });
//         setCall(newCall);
//         setError(null);
//       } catch (err) {
//         console.error("Failed to join video call:", err);
//         setError("Failed to join the video call. Please try again.");
//         navigate(navigatePath);
//       }
//     };
//     createAndJoinCall();

//     return () => {
//       if (call) {
//         (async () => {
//           try {
//             await call.leave();
//           } catch (err) {
//             console.error("Failed to leave call:", err);
//           }
//         })();
//       }
//     };
//   }, [videoClient, isClientReady, user?.id, callId, navigate, navigatePath]);

//   const handleLeaveCall = async () => {
//     try {
//       if (call) await call.leave();
//     } catch (err) {
//       console.error("Failed to leave call:", err);
//     }
//     navigate(navigatePath);
//   };

//   const toggleSidebar = () => setSidebarOpen((prev) => !prev);

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg font-medium">
//         <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
//           <p className="mb-4">{error}</p>
//           <button
//             onClick={() => navigate(navigatePath)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Return to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!isClientReady || !call) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg font-medium">
//         <div className="flex items-center space-x-3 bg-gray-800 p-4 rounded-lg shadow-lg">
//           <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//             />
//           </svg>
//           <span>Connecting to video call...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{customStyles}</style>
//       <StreamTheme className="dark h-screen w-screen">
//         <StreamVideo client={videoClient}>
//           <StreamCall call={call}>
//             <div className="flex h-screen w-screen bg-gray-900 relative overflow-hidden">
//               {/* Main Video Area */}
//               <div
//                 className={`flex-1 transition-all duration-300 relative h-full ${
//                   sidebarOpen && !isMobile ? "md:mr-80" : ""
//                 }`}
//               >
//                 {isMobile ? <VideoGridLayout /> : <SpeakerLayout />}
//               </div>

//               {/* Participants Drawer */}
//               <div
//                 className={`fixed inset-0 z-50 ${
//                   sidebarOpen ? "bg-black bg-opacity-60" : "bg-transparent"
//                 } ${sidebarOpen ? "block" : "hidden"} md:${sidebarOpen ? "block" : "hidden"}`}
//                 onClick={toggleSidebar}
//               >
//                 <aside
//                   className={`absolute top-0 right-0 h-full w-full md:w-80 bg-gray-800 border-l border-gray-700 shadow-lg transform ${
//                     sidebarOpen
//                       ? "translate-x-0 transition-transform duration-200 ease-in-out"
//                       : "translate-x-full transition-transform duration-200 ease-in-out"
//                   }`}
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <div className="flex flex-col h-full">
//                     <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
//                       <h3 className="text-lg font-medium text-white">Participants</h3>
//                       <button
//                         onClick={toggleSidebar}
//                         className="p-2 text-white hover:text-gray-300 transition-colors rounded-full"
//                         aria-label="Close participants"
//                       >
//                         <X size={20} />
//                       </button>
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-4">
//                       <CallParticipantsList />
//                     </div>
//                   </div>
//                 </aside>
//               </div>

//               <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 p-3 rounded-full shadow-lg flex items-center space-x-3 z-50 max-w-[90%] md:max-w-[70%]">
//                 <button
//                   onClick={toggleSidebar}
//                   className="p-2 bg-gray-700 text-white rounded-full hover:bg-blue-600 transition-colors"
//                   aria-label={sidebarOpen ? "Hide participants" : "Show participants"}
//                 >
//                   <Users size={20} />
//                 </button>
//                 <CallControls onLeave={handleLeaveCall} />
//               </div>
//             </div>
//           </StreamCall>
//         </StreamVideo>
//       </StreamTheme>
//     </>
//   );
// };

// export default VideoCallPage;





// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   StreamVideo,
//   StreamCall,
//   CallControls,
//   CallParticipantsList,
//   StreamTheme,
//   ParticipantView,
//   useCallStateHooks,
//   SpeakerLayout,
// } from "@stream-io/video-react-sdk";
// import { useStreamVideo } from "../contexts/StreamVideoContext";
// import { useAuth } from "../contexts/AuthContext";
// import { Users, X } from "lucide-react";
// import "@stream-io/video-react-sdk/dist/css/styles.css";

// const VideoGridLayout = () => {
//   const { useParticipants } = useCallStateHooks();
//   const participants = useParticipants();

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 h-full">
//       {participants.map((p) => (
//         <div
//           key={p.sessionId}
//           className="rounded-lg overflow-hidden bg-gray-800 transition-transform hover:scale-[1.02] aspect-video"
//         >
//           <ParticipantView participant={p} />
//         </div>
//       ))}
//     </div>
//   );
// };

// const VideoCallPage = () => {
//   const { videoClient, isClientReady } = useStreamVideo();
//   const { user } = useAuth();
//   const { callId } = useParams();
//   const navigate = useNavigate();
//   const [call, setCall] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [error, setError] = useState(null);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   const navigatePath = user?.role === "teacher" ? "/teacher/overview" : "/student/overview";

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth < 768 && sidebarOpen) setSidebarOpen(false);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [sidebarOpen]);

//   useEffect(() => {
//     if (!isClientReady || !user?.id || !callId || !videoClient) {
//       setError("Unable to start the video call. Please check your connection and try again.");
//       return;
//     }
//     if (call) return;

//     const createAndJoinCall = async () => {
//       try {
//         const newCall = videoClient.call("default", callId);
//         await newCall.join({ create: true });
//         setCall(newCall);
//         setError(null);
//       } catch (err) {
//         console.error("Failed to join video call:", err);
//         setError("Failed to join the video call. Please try again.");
//         navigate(navigatePath);
//       }
//     };
//     createAndJoinCall();

//     return () => {
//       if (call) {
//         (async () => {
//           try {
//             await call.leave();
//           } catch (err) {
//             console.error("Failed to leave call:", err);
//           }
//         })();
//       }
//     };
//   }, [videoClient, isClientReady, user?.id, callId, navigate, navigatePath]);

//   const handleLeaveCall = async () => {
//     try {
//       if (call) await call.leave();
//     } catch (err) {
//       console.error("Failed to leave call:", err);
//     }
//     navigate(navigatePath);
//   };

//   const toggleSidebar = () => setSidebarOpen((prev) => !prev);

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg font-medium">
//         <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
//           <p className="mb-4 text-white">{error}</p>
//           <button
//             onClick={() => navigate(navigatePath)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Return to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!isClientReady || !call) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg font-medium">
//         <div className="flex items-center space-x-3 bg-gray-800 p-4 rounded-lg shadow-lg">
//           <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//             />
//           </svg>
//           <span className="text-white">Connecting to video call...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <StreamTheme className="h-screen w-screen bg-gray-900">
//       <StreamVideo client={videoClient}>
//         <StreamCall call={call}>
//           <div className="flex h-screen w-screen bg-gray-900 relative overflow-hidden">
//             <div
//               className={`flex-1 transition-all duration-300 relative h-full ${
//                 sidebarOpen && !isMobile ? "md:mr-80" : ""
//               }`}
//             >
//               {isMobile ? <VideoGridLayout /> : <SpeakerLayout />}
//             </div>

//             <div
//               className={`fixed inset-0 z-50 ${
//                 sidebarOpen ? "bg-black bg-opacity-60" : "bg-transparent"
//               } ${sidebarOpen ? "block" : "hidden"} md:${sidebarOpen ? "block" : "hidden"}`}
//               onClick={toggleSidebar}
//             >
//               <aside
//                 className={`absolute top-0 right-0 h-full w-full md:w-80 bg-gray-800 border-l border-gray-700 shadow-lg transform ${
//                   sidebarOpen
//                     ? "translate-x-0 transition-transform duration-200 ease-in-out"
//                     : "translate-x-full transition-transform duration-200 ease-in-out"
//                 }`}
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <div className="flex flex-col h-full">
//                   <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
//                     <h3 className="text-lg font-medium text-white">Participants</h3>
//                     <button
//                       onClick={toggleSidebar}
//                       className="p-2 text-white hover:text-gray-300 transition-colors rounded-full"
//                       aria-label="Close participants"
//                     >
//                       <X size={20} />
//                     </button>
//                   </div>
//                   <div className="flex-1 overflow-y-auto p-4">
//                     <div className="text-white">
//                       <CallParticipantsList />
//                     </div>
//                   </div>
//                 </div>
//               </aside>
//             </div>

//             <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 p-3 rounded-full shadow-lg flex items-center space-x-3 z-50 max-w-[90%] md:max-w-[70%]">
//               <button
//                 onClick={toggleSidebar}
//                 className="p-2 bg-gray-700 text-white rounded-full hover:bg-blue-600 transition-colors"
//                 aria-label={sidebarOpen ? "Hide participants" : "Show participants"}
//               >
//                 <Users size={20} />
//               </button>
//               <CallControls onLeave={handleLeaveCall} />
//             </div>
//           </div>
//         </StreamCall>
//       </StreamVideo>
//     </StreamTheme>
//   );
// };

// export default VideoCallPage;





import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  StreamVideo,
  StreamCall,
  CallControls,
  CallParticipantsList,
  StreamTheme,
  ParticipantView,
  useCallStateHooks,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import { useStreamVideo } from "../contexts/StreamVideoContext";
import { useAuth } from "../contexts/AuthContext";
import { Users, X } from "lucide-react";
import "@stream-io/video-react-sdk/dist/css/styles.css";

// Comprehensive styles for white text on all Stream Video components
const participantStyles = `
  /* Participant name tags - all possible selectors */
  .str-video__participant-name,
  .str-video__participant-details__name,
  .str-video__participant-view__name,
  .str-video__participant-view .str-video__participant-name,
  .str-video__participant-details .str-video__participant-name,
  .str-video__participant-view__details .str-video__participant-name,
  .str-video__participant-view__overlay .str-video__participant-name,
  .str-video__participant-view__info .str-video__participant-name,
  [data-testid="participant-name"],
  .str-video__participant-view [data-testid="participant-name"] {
    color: white !important;
    background: rgba(0, 0, 0, 0.75) !important;
    padding: 4px 8px !important;
    border-radius: 6px !important;
    font-weight: 500 !important;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
    backdrop-filter: blur(4px) !important;
  }

  /* Dropdown menus and popover containers */
  .str-video__menu,
  .str-video__menu-container,
  .str-video__dropdown-menu,
  .str-video__popover,
  .str-video__context-menu,
  .str-video__participant-actions-menu,
  .str-video__more-actions-menu,
  [role="menu"],
  [role="listbox"] {
    background: rgb(31, 41, 55) !important;
    border: 1px solid rgb(75, 85, 99) !important;
    border-radius: 8px !important;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4) !important;
    backdrop-filter: blur(8px) !important;
  }

  /* All dropdown menu items */
  .str-video__menu-item,
  .str-video__dropdown-menu-item,
  .str-video__context-menu-item,
  .str-video__participant-actions-menu-item,
  .str-video__more-actions-menu-item,
  [role="menuitem"],
  [role="option"] {
    color: white !important;
    padding: 10px 14px !important;
    transition: all 0.2s ease !important;
    border-radius: 4px !important;
    margin: 2px !important;
  }

  .str-video__menu-item:hover,
  .str-video__dropdown-menu-item:hover,
  .str-video__context-menu-item:hover,
  .str-video__participant-actions-menu-item:hover,
  .str-video__more-actions-menu-item:hover,
  [role="menuitem"]:hover,
  [role="option"]:hover {
    background: rgb(55, 65, 81) !important;
    color: white !important;
    transform: translateX(2px) !important;
  }

  /* Participant list items in sidebar */
  .str-video__participants-list__item,
  .str-video__participants-list__item-name,
  .str-video__participants-list .str-video__participant-name,
  .str-video__participants-list [data-testid="participant-name"] {
    color: white !important;
    background: transparent !important;
  }

  .str-video__participants-list__item:hover {
    background: rgba(55, 65, 81, 0.5) !important;
  }

  /* Call controls styling */
  .str-video__call-controls {
    background: transparent !important;
  }

  .str-video__call-controls button {
    background: rgb(55, 65, 81) !important;
    color: white !important;
    border: none !important;
    transition: all 0.2s ease !important;
  }

  .str-video__call-controls button:hover {
    background: rgb(75, 85, 99) !important;
    transform: translateY(-1px) !important;
  }

  /* Speaker layout participant names */
  .str-video__speaker-layout .str-video__participant-name,
  .str-video__speaker-layout [data-testid="participant-name"] {
    color: white !important;
    background: rgba(0, 0, 0, 0.75) !important;
    padding: 6px 10px !important;
    border-radius: 6px !important;
    font-weight: 500 !important;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8) !important;
  }

  /* Grid layout participant names */
  .str-video__participant-view.str-video__participant-view--grid .str-video__participant-name,
  .str-video__participant-view.str-video__participant-view--grid [data-testid="participant-name"] {
    color: white !important;
    background: rgba(0, 0, 0, 0.8) !important;
    padding: 4px 8px !important;
    border-radius: 4px !important;
    font-size: 0.875rem !important;
  }

  /* Any text within Stream components */
  .str-video__participant-view *,
  .str-video__call-controls *,
  .str-video__participants-list * {
    color: white !important;
  }

  /* Tooltips */
  .str-video__tooltip {
    background: rgb(31, 41, 55) !important;
    color: white !important;
    border: 1px solid rgb(75, 85, 99) !important;
  }

  /* Responsive font sizes */
  @media (max-width: 640px) {
    .str-video__participant-name,
    [data-testid="participant-name"] {
      font-size: 11px !important;
      padding: 3px 6px !important;
    }
  }

  @media (min-width: 641px) and (max-width: 768px) {
    .str-video__participant-name,
    [data-testid="participant-name"] {
      font-size: 12px !important;
      padding: 4px 7px !important;
    }
  }

  @media (min-width: 769px) {
    .str-video__participant-name,
    [data-testid="participant-name"] {
      font-size: 13px !important;
      padding: 5px 9px !important;
    }
  }
`;

const VideoGridLayout = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <div className="grid gap-1 p-1 h-full w-full overflow-hidden
      xs:gap-2 xs:p-2
      sm:gap-2 sm:p-2
      md:gap-3 md:p-3
      lg:gap-3 lg:p-3
      xl:gap-4 xl:p-4
      grid-cols-1 
      xs:grid-cols-1
      sm:grid-cols-2 
      md:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4 
      2xl:grid-cols-5
      3xl:grid-cols-6
      auto-rows-fr">
      {participants.map((p) => (
        <div
          key={p.sessionId}
          className="rounded-lg overflow-hidden bg-gray-800 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg
            min-h-[150px] 
            xs:min-h-[180px]
            sm:min-h-[200px] 
            md:min-h-[220px] 
            lg:min-h-[200px] 
            xl:min-h-[220px]
            2xl:min-h-[240px]
            aspect-video
            border border-gray-700"
        >
          <ParticipantView participant={p} />
        </div>
      ))}
    </div>
  );
};

const VideoCallPage = () => {
  const { videoClient, isClientReady } = useStreamVideo();
  const { user } = useAuth();
  const { callId } = useParams();
  const navigate = useNavigate();
  const [call, setCall] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const navigatePath = user?.role === "teacher" ? "/teacher/overview" : "/student/overview";

  // Enhanced responsive breakpoints
  const isMobile = screenSize.width < 768;
  const isTablet = screenSize.width >= 768 && screenSize.width < 1024;
  const isDesktop = screenSize.width >= 1024;

  useEffect(() => {
    const handleResize = () => {
      const newSize = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      setScreenSize(newSize);
      
      // Auto-close sidebar on mobile when resizing to mobile view
      if (newSize.width < 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    const debouncedResize = debounce(handleResize, 100);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, [sidebarOpen]);

  // Simple debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  useEffect(() => {
    if (!isClientReady || !user?.id || !callId || !videoClient) {
      setError("Unable to start the video call. Please check your connection and try again.");
      return;
    }
    if (call) return;

    const createAndJoinCall = async () => {
      try {
        const newCall = videoClient.call("default", callId);
        await newCall.join({ create: true });
        setCall(newCall);
        setError(null);
      } catch (err) {
        console.error("Failed to join video call:", err);
        setError("Failed to join the video call. Please try again.");
        navigate(navigatePath);
      }
    };
    createAndJoinCall();

    return () => {
      if (call) {
        (async () => {
          try {
            await call.leave();
          } catch (err) {
            console.error("Failed to leave call:", err);
          }
        })();
      }
    };
  }, [videoClient, isClientReady, user?.id, callId, navigate, navigatePath]);

  const handleLeaveCall = async () => {
    try {
      if (call) await call.leave();
    } catch (err) {
      console.error("Failed to leave call:", err);
    }
    navigate(navigatePath);
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-3 xs:p-4 sm:p-6">
        <div className="bg-gray-800 rounded-lg shadow-xl text-center border border-gray-700
          p-4 xs:p-5 sm:p-6 md:p-8
          w-full xs:max-w-sm sm:max-w-md md:max-w-lg
          mx-4">
          <p className="mb-4 xs:mb-5 sm:mb-6 text-white 
            text-sm xs:text-base sm:text-lg
            leading-relaxed">{error}</p>
          <button
            onClick={() => navigate(navigatePath)}
            className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg
              px-4 py-2 xs:px-5 xs:py-2.5 sm:px-6 sm:py-3
              text-sm xs:text-base sm:text-lg
              w-full xs:w-auto
              font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isClientReady || !call) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="flex items-center bg-gray-800 rounded-lg shadow-xl border border-gray-700
          p-4 xs:p-5 sm:p-6
          space-x-3 xs:space-x-4
          max-w-sm xs:max-w-md sm:max-w-lg w-full
          justify-center">
          <svg className="animate-spin flex-shrink-0
            h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7
            text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="text-white font-medium
            text-sm xs:text-base sm:text-lg">
            Connecting to video call...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{participantStyles}</style>
      <StreamTheme className="h-screen w-screen bg-gray-900 overflow-hidden">
        <StreamVideo client={videoClient}>
          <StreamCall call={call}>
            <div className="flex h-screen w-screen bg-gray-900 relative overflow-hidden">
              {/* Main Video Area */}
              <div
                className={`flex-1 transition-all duration-300 relative h-full ${
                  sidebarOpen && !isMobile 
                    ? isTablet 
                      ? "md:mr-64 lg:mr-72" 
                      : "lg:mr-80 xl:mr-80 2xl:mr-96" 
                    : ""
                }`}
              >
                {isMobile ? <VideoGridLayout /> : <SpeakerLayout />}
              </div>

                            {/* Participants Drawer */}
              <div
                className={`fixed inset-0 z-50 ${
                  sidebarOpen ? "bg-black bg-opacity-60" : "bg-transparent pointer-events-none"
                } ${sidebarOpen ? "block" : "hidden"}`}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <aside
                  className={`absolute top-0 right-0 h-full bg-gray-800 border-l border-gray-700 shadow-xl transform transition-all duration-300 ease-in-out
                    ${isMobile 
                      ? "w-full" 
                      : isTablet 
                        ? "w-64 md:w-72" 
                        : "w-80 xl:w-80 2xl:w-96"
                    }
                    ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
                    pointer-events-auto backdrop-blur-sm`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 flex-shrink-0
                      p-3 xs:p-4 sm:p-4 md:p-5">
                      <h3 className="font-semibold text-white
                        text-base xs:text-lg sm:text-lg md:text-xl">
                        Participants
                      </h3>
                      <button
                        onClick={toggleSidebar}
                        className="p-2 text-white hover:text-gray-300 transition-all duration-200 rounded-full hover:bg-gray-700 hover:scale-110"
                        aria-label="Close participants"
                      >
                        <X className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    
                    {/* Participants List */}
                    <div className="flex-1 overflow-y-auto
                      p-3 xs:p-4 sm:p-4 md:p-5">
                      <div className="text-white">
                        <CallParticipantsList />
                      </div>
                    </div>
                  </div>
                </aside>
              </div>

              {/* Bottom Controls */}
              <div className="fixed z-50 w-full flex justify-center
                bottom-3 xs:bottom-4 sm:bottom-5 md:bottom-6 lg:bottom-6
                left-0 right-0
                px-3 xs:px-4 sm:px-6 md:px-8">
                <div className="bg-gray-800 shadow-2xl flex items-center justify-center border border-gray-600
                  rounded-full xs:rounded-full sm:rounded-2xl
                  p-2 xs:p-2.5 sm:p-3 md:p-3.5
                  space-x-2 xs:space-x-2.5 sm:space-x-3 md:space-x-4
                  max-w-[95%] xs:max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[55%] 2xl:max-w-[45%]
                  backdrop-blur-md">
                  
                  <button
                    onClick={toggleSidebar}
                    className="bg-gray-700 text-white rounded-full hover:bg-blue-600 transition-all duration-200 flex-shrink-0 hover:scale-110 hover:shadow-lg
                      p-2 xs:p-2.5 sm:p-2.5 md:p-3
                      group"
                    aria-label={sidebarOpen ? "Hide participants" : "Show participants"}
                  >
                    <Users className="group-hover:scale-110 transition-transform duration-200
                      w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-5 md:h-5" />
                  </button>
                  
                  <div className="flex-1 flex justify-center min-w-0">
                    <CallControls onLeave={handleLeaveCall} />
                  </div>
                </div>
              </div>
            </div>
          </StreamCall>
        </StreamVideo>
      </StreamTheme>
    </>
  );
};

export default VideoCallPage;
