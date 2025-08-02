// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   StreamVideo,
//   StreamCall,
//   CallControls,
//   CallParticipantsList,
//   StreamTheme,
//   SpeakerLayout,
// } from "@stream-io/video-react-sdk";
// import { useStreamVideo } from "../contexts/StreamVideoContext";
// import { useAuth } from "../contexts/AuthContext";
// import { Users, X } from "lucide-react"; // Using lucide-react for icons
// import "@stream-io/video-react-sdk/dist/css/styles.css";

// const VideoCallPage = () => {
//   const { videoClient, isClientReady } = useStreamVideo();
//   const { user } = useAuth();
//   const { callId } = useParams();
//   const navigate = useNavigate();
//   const [call, setCall] = useState(null);
//   const [error, setError] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const navigatePath = user?.role === "teacher" ? "/teacher/overview" : "/student/overview";

//   useEffect(() => {
//     if (!isClientReady || !user?.id || !callId || !videoClient) {
//       setError("Missing required data to start the video call.");
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
//       if (call) {
//         await call.leave();
//       }
//     } catch (err) {
//       console.error("Failed to leave call:", err);
//     }
//     navigate(navigatePath);
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen((prev) => !prev);
//   };

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg">
//         {error}
//       </div>
//     );
//   }

//   if (!isClientReady || !call) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg">
//         Connecting to video call...
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{`
//         .str-video.light {
//           --str-video__primary-color: #f97316; /* Orange */
//           --str-video__secondary-color: #3b82f6; /* Blue */
//           --str-video__text-color1: #222222;
//           --str-video__text-color2: #333333;
//           --str-video__text-color3: #555555;
//           --str-video__background-color: #f3f4f6; /* Light gray */
//           --str-video__popover-background: #ffffff;
//           --str-video__popover-text-color: #222222;
//           --str-video__tooltip-background: #222222;
//           --str-video__tooltip-text-color: #ffffff;
//         }

//         .str-video__call-participants-list {
//           padding: 1rem;
//         }

//         .str-video__participant-details {
//           background: #ffffff;
//           border-radius: 0.5rem;
//           margin-bottom: 0.5rem;
//           padding: 0.5rem;
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//         }

//         .str-video__call-controls {
//           display: flex;
//           justify-content: center;
//           gap: 1rem;
//         }

//         .str-video__call-controls__button {
//           background: #f97316;
//           color: #ffffff;
//           padding: 0.5rem 1rem;
//           border-radius: 0.375rem;
//           transition: background-color 0.2s;
//         }

//         .str-video__call-controls__button:hover {
//           background: #ea580c;
//         }

//         @media (max-width: 640px) {
//           .str-video__call-participants-list {
//             max-height: 40vh;
//             overflow-y: auto;
//           }
//         }
//       `}</style>
//       <StreamTheme className="light h-screen w-screen bg-gray-100">
//         <StreamVideo client={videoClient}>
//           <StreamCall call={call}>
//             <div className="relative w-full h-full flex flex-col sm:flex-row">
//               {/* Main Speaker View */}
//               <div className="flex-1 bg-black">
//                 <SpeakerLayout />
//               </div>

//               {/* Sidebar for Desktop, Popup for Mobile */}
//               <div
//                 className={`fixed inset-0 z-50 bg-black bg-opacity-50 sm:bg-transparent sm:static sm:w-80 sm:max-w-full sm:shadow-lg sm:rounded-lg sm:bg-white transition-all duration-300 ${
//                   sidebarOpen ? "block" : "hidden sm:w-0 sm:overflow-hidden"
//                 }`}
//                 onClick={() => setSidebarOpen(false)} // Click outside to close on mobile
//               >
//                 <div
//                   className="absolute bottom-0 sm:static w-full sm:w-80 bg-white sm:h-full rounded-t-lg sm:rounded-lg p-4 sm:p-6"
//                   onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
//                 >
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-lg font-semibold text-gray-900 sm:hidden">
//                       Participants
//                     </h3>
//                     <button
//                       onClick={toggleSidebar}
//                       className="text-gray-600 hover:text-gray-900 focus:outline-none"
//                       aria-label="Close participants"
//                     >
//                       <X size={24} />
//                     </button>
//                   </div>
//                   <div className="max-h-[40vh] sm:max-h-[80vh] overflow-y-auto">
//                     <CallParticipantsList />
//                   </div>
//                 </div>
//               </div>

//               {/* Controls Bar with Toggle Button */}
//               <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-800 z-10 flex justify-center items-center">
//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={toggleSidebar}
//                     className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 focus:outline-none"
//                     aria-label={sidebarOpen ? "Hide participants" : "Show participants"}
//                   >
//                     <Users size={24} />
//                   </button>
//                   <CallControls onLeave={handleLeaveCall} />
//                 </div>
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
//   SpeakerLayout,
// } from "@stream-io/video-react-sdk";
// import { useStreamVideo } from "../contexts/StreamVideoContext";
// import { useAuth } from "../contexts/AuthContext";
// import { Users, X } from "lucide-react";
// import "@stream-io/video-react-sdk/dist/css/styles.css";

// const VideoCallPage = () => {
//   const { videoClient, isClientReady } = useStreamVideo();
//   const { user } = useAuth();
//   const { callId } = useParams();
//   const navigate = useNavigate();
//   const [call, setCall] = useState(null);
//   const [error, setError] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const navigatePath = user?.role === "teacher" ? "/teacher/overview" : "/student/overview";

//   useEffect(() => {
//     if (!isClientReady || !user?.id || !callId || !videoClient) {
//       setError("Missing required data to start the video call.");
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

//   return (
//     <>
//       <style>{`
//         .str-video.light {
//           --str-video__primary-color: #f97316;
//           --str-video__secondary-color: #3b82f6;
//           --str-video__text-color1: #ffffff;
//           --str-video__text-color2: #ffffff;
//           --str-video__text-color3: #ffffff;
//           --str-video__background-color: #f9fafb;
//           --str-video__popover-background: #222222;
//           --str-video__popover-text-color: #ffffff;
//           --str-video__tooltip-background: #222222;
//           --str-video__tooltip-text-color: #ffffff;
//         }
//         /* Force dropdown (popover) text color to white */
//         .str-video.light .str-video__popover,
//         .str-video.light .str-video__popover * {
//           color: #ffffff !important;
//         }
//         .str-video__call-participants-list {
//           padding: 1rem;
//         }
//         .str-video__participant-details {
//           background: #ffffff;
//           border-radius: 0.375rem;
//           margin-bottom: 0.5rem;
//           padding: 0.75rem;
//           box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
//           transition: background-color 0.2s;
//         }
//         .str-video__participant-details:hover {
//           background: #f9fafb;
//         }
//         .str-video__call-controls {
//           display: flex;
//           justify-content: center;
//           gap: 0.75rem;
//         }
//         .str-video__call-controls__button {
//           background: #f97316;
//           color: #ffffff;
//           padding: 0.5rem 1rem;
//           border-radius: 0.375rem;
//           font-size: 0.875rem;
//           transition: background-color 0.2s, transform 0.2s;
//         }
//         .str-video__call-controls__button:hover {
//           background: #ea580c;
//           transform: translateY(-1px);
//         }
//         .participants-header {
//           background: #ffffff;
//           position: sticky;
//           top: 0;
//           z-index: 10;
//           padding: 0.75rem 1rem;
//           border-bottom: 1px solid #e5e7eb;
//           font-weight: 500;
//         }
//         .sidebar-container {
//           animation: slide-in 0.3s ease-out;
//         }
//         @keyframes slide-in {
//           from {
//             transform: translateX(100%);
//           }
//           to {
//             transform: translateX(0);
//           }
//         }
//         @media (max-width: 640px) {
//           .str-video__call-participants-list {
//             max-height: 50vh;
//             overflow-y: auto;
//           }
//         }
//         @media (min-width: 641px) and (max-width: 1024px) {
//           .sidebar-container {
//             width: 18rem;
//           }
//         }
//       `}</style>
//       <StreamTheme className="light h-screen w-screen bg-gray-50">
//         <StreamVideo client={videoClient}>
//           <StreamCall call={call}>
//             <div className="relative w-full h-full flex flex-col bg-gray-50">
//               {/* Main Speaker View */}
//               <div className="flex-1 min-h-0 bg-black">
//                 <SpeakerLayout />
//               </div>
//               {/* Sidebar for Desktop, Drawer for Mobile (only visible when open) */}
//               <div
//                 className={`fixed inset-0 z-50 bg-black bg-opacity-30 transition-opacity duration-200 ${
//                   sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
//                 } ${sidebarOpen ? "" : "sm:hidden"}`}
//                 onClick={toggleSidebar}
//               >
//                 <aside
//                   className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white border-l border-gray-200 shadow-md transform transition-transform duration-300 ${
//                     sidebarOpen ? "translate-x-0" : "translate-x-full"
//                   } ${sidebarOpen ? "sm:w-80" : "sm:w-0"} sm:rounded-lg sidebar-container`}
//                   style={{ maxHeight: "100vh" }}
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <div className="flex flex-col h-full">
//                     <div className="participants-header flex items-center justify-between p-3 border-b border-gray-200">
//                       <h3 className="text-base font-medium text-gray-900">Participants</h3>
//                       <button
//                         onClick={toggleSidebar}
//                         className="text-gray-500 hover:text-gray-700 focus:outline-none"
//                         aria-label="Close participants"
//                       >
//                         <X size={20} />
//                       </button>
//                     </div>
//                     <div className="flex-1 overflow-y-auto p-3">
//                       <CallParticipantsList />
//                     </div>
//                   </div>
//                 </aside>
//               </div>
//               {/* Controls Bar with Toggle Button */}
//               <div className="fixed bottom-0 left-0 right-0 p-3 bg-white z-10 flex justify-center items-center shadow-t-sm">
//                 <div className="flex items-center space-x-3">
//                   <button
//                     onClick={toggleSidebar}
//                     className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 focus:outline-none shadow-sm transition-transform hover:scale-105"
//                     aria-label={sidebarOpen ? "Hide participants" : "Show participants"}
//                   >
//                     <Users size={18} />
//                   </button>
//                   <CallControls onLeave={handleLeaveCall} />
//                 </div>
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
// } from "@stream-io/video-react-sdk";
// import { useStreamVideo } from "../contexts/StreamVideoContext";
// import { useAuth } from "../contexts/AuthContext";
// import { Users, X } from "lucide-react";
// import "@stream-io/video-react-sdk/dist/css/styles.css";

// const customStyles = `
//   .str-video {
//     --str-video__primary-color: #f97316;
//     --str-video__secondary-color: #3b82f6;
//     --str-video__text-color1: #222;
//     --str-video__text-color2: #444;
//     --str-video__background-color: #f9fafb;
//     --str-video__popover-background: #fff;
//     --str-video__popover-text-color: #222;
//     --str-video__popover-box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//   }
//   .str-video__participants-list__item-name:hover {
//     background: rgba(255, 255, 255, 0.2);
//   }
//   .participants-header {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     padding: 1rem;
//     border-bottom: 1px solid #e5e7eb;
//     font-weight: 600;
//   }
//   .controls-bar {
//     position: fixed;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     background: #fff;
//     padding: 1rem;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
//     z-index: 10;
//   }
//   .video-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//     gap: 1rem;
//     padding: 1rem;
//     width: 100%;
//     height: 100%;
//     overflow-y: auto;
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
//           className="rounded-lg overflow-hidden flex items-center justify-center bg-gray-900"
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

//   const navigatePath = user?.role === "teacher" ? "/teacher/overview" : "/student/overview";

//   useEffect(() => {
//     if (!isClientReady || !user?.id || !callId || !videoClient) {
//       setError("Missing required data to start the video call.");
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
//     // eslint-disable-next-line
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
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg">
//         {error}
//       </div>
//     );
//   }

//   if (!isClientReady || !call) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg">
//         Connecting to video call...
//       </div>
//     );
//   }

//   return (
//     <>
//       <style>{customStyles}</style>
//       <StreamTheme className="light h-screen w-screen">
//         <StreamVideo client={videoClient}>
//           <StreamCall call={call}>
//             <div className="flex h-screen w-screen bg-gray-50 relative">
//               {/* Main Video Grid */}
//               <div
//                 className={`flex-1 transition-all duration-300 ${
//                   sidebarOpen ? "md:mr-80" : ""
//                 } relative h-full bg-black flex`}
//               >
//                 <VideoGridLayout />
//               </div>

//               {/* Participants Drawer */}
//               <div
//                 className={`fixed inset-0 z-50 transition-opacity duration-200 ${
//                   sidebarOpen
//                     ? "bg-black bg-opacity-30 pointer-events-auto"
//                     : "bg-transparent pointer-events-none"
//                 }`}
//                 onClick={toggleSidebar}
//               >
//                 <aside
//                   className={`absolute top-0 right-0 h-full w-full md:w-80 bg-white border-l border-gray-200 shadow-md transform transition-transform duration-300 ${
//                     sidebarOpen ? "translate-x-0" : "translate-x-full"
//                   }`}
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <div className="flex flex-col h-full">
//                     <div className="participants-header">
//                       <h3 className="text-lg font-semibold">Participants</h3>
//                       <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
//                         <X size={20} />
//                       </button>
//                     </div>
//                     <div className="flex-1 overflow-y-auto">
//                       <CallParticipantsList />
//                     </div>
//                   </div>
//                 </aside>
//               </div>

//               {/* Controls Bar with Toggle Button */}
//               <div className="controls-bar">
//                 <div className="flex items-center space-x-3">
//                   <button
//                     onClick={toggleSidebar}
//                     className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 focus:outline-none shadow-sm transition-transform hover:scale-105"
//                     aria-label={sidebarOpen ? "Hide participants" : "Show participants"}
//                   >
//                     <Users size={18} />
//                   </button>
//                   <CallControls onLeave={handleLeaveCall} />
//                 </div>
//               </div>
//             </div>
//           </StreamCall>
//         </StreamVideo>
//       </StreamTheme>
//     </>
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

const customStyles = `
  .str-video {
    --str-video__primary-color: #f97316;
    --str-video__secondary-color: #3b82f6;
    --str-video__text-color1: #222;
    --str-video__text-color2: #444;
    --str-video__background-color: #f9fafb;
    --str-video__popover-background: #fff;
    --str-video__popover-text-color: #222;
    --str-video__popover-box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .str-video__participants-list__item-name:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  .participants-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 600;
  }
  .controls-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #1B168E ;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
    z-index: 10;
  }
  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
    padding: 1rem;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
`;

const VideoGridLayout = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <div className="video-grid">
      {participants.map((p) => (
        <div
          key={p.sessionId}
          className="rounded-lg overflow-hidden flex items-center justify-center bg-gray-900"
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigatePath = user?.role === "teacher" ? "/teacher/overview" : "/student/overview";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isClientReady || !user?.id || !callId || !videoClient) {
      setError("Missing required data to start the video call.");
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
    // eslint-disable-next-line
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
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg">
        {error}
      </div>
    );
  }

  if (!isClientReady || !call) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg">
        Connecting to video call...
      </div>
    );
  }

  return (
    <>
      <style>{customStyles}</style>
      <StreamTheme className="light h-screen w-screen">
        <StreamVideo client={videoClient}>
          <StreamCall call={call}>
            <div className="flex h-screen w-screen bg-gray-50 relative">
              {/* Main Video Area */}
              <div
                className={`flex-1 transition-all duration-300 relative h-full bg-black flex pb-24 ${
                  sidebarOpen ? "md:mr-80" : ""
                }`}
              >
                {isMobile ? <VideoGridLayout /> : <SpeakerLayout />}
              </div>

              {/* Participants Drawer */}
              <div
                className={`fixed inset-0 z-50 transition-opacity duration-200 ${
                  sidebarOpen
                    ? "bg-black bg-opacity-30 pointer-events-auto"
                    : "bg-transparent pointer-events-none"
                }`}
                onClick={toggleSidebar}
              >
                <aside
                  className={`absolute top-0 right-0 h-full w-full md:w-80 bg-white border-l border-gray-200 shadow-md transform transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "translate-x-full"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col h-full">
                    <div className="participants-header">
                      <h3 className="text-lg font-semibold">Participants</h3>
                      <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <CallParticipantsList />
                    </div>
                  </div>
                </aside>
              </div>

              {/* Controls Bar with Toggle Button */}
              <div className="controls-bar">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleSidebar}
                    className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 focus:outline-none shadow-sm transition-transform hover:scale-105"
                    aria-label={sidebarOpen ? "Hide participants" : "Show participants"}
                  >
                    <Users size={18} />
                  </button>
                  <CallControls onLeave={handleLeaveCall} />
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
