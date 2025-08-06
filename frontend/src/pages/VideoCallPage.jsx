
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
    --str-video__primary-color: #1a73e8;
    --str-video__secondary-color: #34a853;
    --str-video__text-color1: #ffffff;
    --str-video__text-color2: #ffffff;
    --str-video__background-color: #202124;
    --str-video__popover-background: #303134;
    --str-video__popover-text-color: #ffffff;
    --str-video__popover-box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }
  .str-video__participant-view {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    background: #202124;
  }
  .str-video__participant-name {
    color: #ffffff !important;
  }
  .str-video__participants-list__item-name {
    color: #ffffff !important;
    background: #303134;
    padding: 0.75rem;
    border-radius: 8px;
    transition: background 0.2s ease;
  }
  .str-video__participants-list__item-name:hover {
    background: rgba(26, 115, 232, 0.2);
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
      if (window.innerWidth < 768 && sidebarOpen) setSidebarOpen(false);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg font-medium">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
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
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg font-medium">
        <div className="flex items-center space-x-3 bg-gray-800 p-4 rounded-lg shadow-lg">
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
      <StreamTheme className="dark h-screen w-screen">
        <StreamVideo client={videoClient}>
          <StreamCall call={call}>
            <div className="flex h-screen w-screen bg-gray-900 relative overflow-hidden">
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
                className={`fixed inset-0 z-50 ${
                  sidebarOpen ? "bg-black bg-opacity-60" : "bg-transparent"
                } ${sidebarOpen ? "block" : "hidden"} md:${sidebarOpen ? "block" : "hidden"}`}
                onClick={toggleSidebar}
              >
                <aside
                  className={`absolute top-0 right-0 h-full w-full md:w-80 bg-gray-800 border-l border-gray-700 shadow-lg transform ${
                    sidebarOpen
                      ? "translate-x-0 transition-transform duration-200 ease-in-out"
                      : "translate-x-full transition-transform duration-200 ease-in-out"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
                      <h3 className="text-lg font-medium text-white">Participants</h3>
                      <button
                        onClick={toggleSidebar}
                        className="p-2 text-white hover:text-gray-300 transition-colors rounded-full"
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

              <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 p-3 rounded-full shadow-lg flex items-center space-x-3 z-50 max-w-[90%] md:max-w-[70%]">
                <button
                  onClick={toggleSidebar}
                  className="p-2 bg-gray-700 text-white rounded-full hover:bg-blue-600 transition-colors"
                  aria-label={sidebarOpen ? "Hide participants" : "Show participants"}
                >
                  <Users size={20} />
                </button>
                <CallControls onLeave={handleLeaveCall} />
              </div>
            </div>
          </StreamCall>
        </StreamVideo>
      </StreamTheme>
    </>
  );
};

export default VideoCallPage;
