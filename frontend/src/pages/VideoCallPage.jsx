
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
//     background: #1B168E ;
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
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   const navigatePath = user?.role === "teacher" ? "/teacher/overview" : "/student/overview";

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

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
//               {/* Main Video Area */}
//               <div
//                 className={`flex-1 transition-all duration-300 relative h-full bg-black flex pb-24 ${
//                   sidebarOpen ? "md:mr-80" : ""
//                 }`}
//               >
//                 {isMobile ? <VideoGridLayout /> : <SpeakerLayout />}
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
    --str-video__primary-color: #1a73e8; /* Google Meet blue */
    --str-video__secondary-color: #34a853; /* Google Meet green */
    --str-video__text-color1: #202124; /* Dark text */
    --str-video__text-color2: #5f6368; /* Lighter text */
    --str-video__background-color: #f1f3f4; /* Light background */
    --str-video__popover-background: #ffffff;
    --str-video__popover-text-color: #202124;
    --str-video__popover-box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  }
  .str-video__participant-view {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    transition: transform 0.2s ease;
  }
  .str-video__participants-list__item-name {
    padding: 0.75rem;
    border-radius: 8px;
    transition: background 0.2s ease;
    color: #202124;
  }
  .str-video__participants-list__item-name:hover {
    background: rgba(26, 115, 232, 0.08); /* Subtle hover effect */
  }
  .participants-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #dadce0;
    background: #ffffff;
    font-weight: 500;
    color: #202124;
  }
  .controls-bar {
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: #ffffff;
    padding: 0.75rem 1.5rem;
    border-radius: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    max-width: 90%;
  }
  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 0.75rem;
    padding: 1rem;
    width: 100%;
    height: calc(100% - 80px); /* Adjust for controls bar */
    overflow-y: auto;
    background: #202124; /* Dark video area */
  }
  .sidebar {
    background: #ffffff;
    border-left: 1px solid #dadce0;
    box-shadow: -2px 0 12px rgba(0,0,0,0.1);
  }
  .toggle-button {
    transition: all 0.2s ease;
    background: #ffffff;
    border: 1px solid #dadce0;
  }
  .toggle-button:hover {
    background: #e8f0fe !important; /* Google Meet hover blue */
    transform: scale(1.05);
    border-color: #1a73e8;
  }
  .close-button {
    transition: all 0.2s ease;
  }
  .close-button:hover {
    background: #f1f3f4;
    border-radius: 50%;
  }
  @media (max-width: 768px) {
    .video-grid {
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 0.5rem;
      padding: 0.5rem;
      height: calc(100% - 70px);
    }
    .str-video__participant-view {
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }
    .controls-bar {
      padding: 0.5rem 1rem;
      bottom: 1rem;
      max-width: 95%;
    }
    .participants-header {
      padding: 0.75rem 1rem;
    }
    .str-video__participants-list__item-name {
      padding: 0.5rem;
      font-size: 0.875rem;
    }
  }
  @media (max-width: 480px) {
    .video-grid {
      grid-template-columns: 1fr;
      gap: 0.5rem;
      padding: 0.5rem;
    }
    .controls-bar {
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 0.5rem;
    }
    .toggle-button {
      padding: 0.5rem;
    }
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
          className="rounded-lg overflow-hidden bg-gray-800 transition-transform hover:scale-[1.02]"
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
      // Auto-close sidebar on mobile when resizing to small screens
      if (window.innerWidth < 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

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
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900 text-lg font-medium">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={() => navigate(navigatePath)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isClientReady || !call) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-900 text-lg font-medium">
        <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-lg">
          <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span>Connecting to video call...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{customStyles}</style>
      <StreamTheme className="light h-screen w-screen">
        <StreamVideo client={videoClient}>
          <StreamCall call={call}>
            <div className="flex h-screen w-screen bg-gray-100 relative overflow-hidden">
              {/* Main Video Area */}
              <div
                className={`flex-1 transition-all duration-300 relative h-full ${
                  sidebarOpen && !isMobile ? "md:mr-80" : ""
                }`}
              >
                {isMobile ? <VideoGridLayout /> : <SpeakerLayout />}
              </div>

              {/* Participants Drawer */}
              <div
                className={`fixed inset-0 z-50 transition-opacity duration-300 ${
                  sidebarOpen
                    ? "bg-black bg-opacity-40 pointer-events-auto"
                    : "bg-transparent pointer-events-none"
                }`}
                onClick={toggleSidebar}
              >
                <aside
                  className={`absolute top-0 right-0 h-full w-full md:w-80 sidebar transform transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "translate-x-full"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col h-full">
                    <div className="participants-header">
                      <h3 className="text-lg font-medium">Participants</h3>
                      <button
                        onClick={toggleSidebar}
                        className="p-2 text-gray-600 hover:text-gray-900 close-button transition-colors"
                        aria-label="Close participants"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
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
                    className="toggle-button text-gray-900 p-3 rounded-full hover:bg-blue-50 shadow-sm"
                    aria-label={sidebarOpen ? "Hide participants" : "Show participants"}
                  >
                    <Users size={20} />
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
