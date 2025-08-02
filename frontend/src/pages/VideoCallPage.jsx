// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   StreamVideo,
//   Call,
//   CallControls,
//   CallParticipantsList,
// } from '@stream-io/video-react-sdk';
// import { useStreamVideo } from '../contexts/StreamVideoContext';
// import { useAuth } from '../contexts/AuthContext';
// import '@stream-io/video-react-sdk/dist/css/styles.css';

// const VideoCallPage = () => {
//   const { videoClient, isClientReady } = useStreamVideo();
//   const { user } = useAuth();
//   const { callId } = useParams();
//   const navigate = useNavigate();
//   const [call, setCall] = useState(null);

//   useEffect(() => {
//     let callInstance;
//     const setupCall = async () => {
//       // Guard clause to ensure we have a ready client and user
//       if (!isClientReady || !user?.id || !callId || call) return;

//       console.log('VideoCallPage: Setting up a new call instance.');
      
//       try {
//         callInstance = videoClient.getOrCreateCall({ id: callId });
//         setCall(callInstance);
//         await callInstance.join();
//         console.log('VideoCallPage: Successfully joined call.');
//       } catch (error) {
//         console.error('Failed to join video call:', error);
//         navigate('/overview'); // Redirect on error
//       }
//     };

//     setupCall();

//     // Cleanup: leave the call when the component unmounts
//     return () => {
//       console.log('VideoCallPage: Component unmounting, leaving call.');
//       if (callInstance) {
//         callInstance.leave();
//       }
//     };
//   }, [isClientReady, user, callId, videoClient, navigate]); // Removed 'call' from the dependency array

//   if (!isClientReady || !call) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg">
//         Connecting to video call...
//       </div>
//     );
//   }
  
//   const handleLeaveCall = async () => {
//     await call.leave();
//     navigate('/overview'); // Redirect to overview page after leaving the call
//   };

//   return (
//     <div className="w-screen h-screen bg-black text-white">
//       <StreamVideo client={videoClient}>
//         <Call call={call}>
//           <div className="relative w-full h-full">
//             {/* The main video content area */}
//             <div className="absolute inset-0">
//               <CallParticipantsList />
//             </div>
//             {/* Controls at the bottom */}
//             <div className="absolute bottom-0 left-0 right-0 p-4">
//               <CallControls onLeave={handleLeaveCall} />
//             </div>
//           </div>
//         </Call>
//       </StreamVideo>
//     </div>
//   );
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
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import { useStreamVideo } from "../contexts/StreamVideoContext";
import { useAuth } from "../contexts/AuthContext";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const customThemeStyle = `
.str-video.light {
  --str-video__primary-color: orange;
  --str-video__secondary-color: blue;
  --str-video__text-color1: #fff ;
  --str-video__background-color: #fff;
}
.full-call-container {
  display: flex;
  flex-direction: column;
}
.main-call-area {
  flex: 1;
  display: flex;
}
.main-speaker-view {
  flex: 1;
}
.participants-list-sidebar {
  width: 250px;
  background: #f0f0f0;
  overflow-y: auto;
}
.controls-bar {
  background: #fff;
  padding: 1rem;
}
@media (max-width: 640px) {
  .main-call-area {
    flex-direction: column;
    height: 100vh;
  }
  .main-speaker-view {
    flex: 1;
  }
  .participants-list-sidebar {
    width: 100%;
    height: 30vh; /* Give it a fixed height for mobile */
    position: static;
    background: #fff;
    border-top: 1px solid #ccc;
    z-index: 15;
    order: 2; /* Position it below the video */
  }
  .controls-bar {
    position: static;
    width: 100%;
    order: 3; /* Position it at the bottom */
  }
  .str-video__call-participants-list {
    padding: 0.5rem;
  }
}
`;

const VideoCallPage = () => {
  const { videoClient, isClientReady } = useStreamVideo();
  const { user } = useAuth();
  const { callId } = useParams();
  const navigate = useNavigate();
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);

  const navigatePath =
    user?.role === "teacher" ? "/teacher/overview" : "/student/overview";

  useEffect(() => {
    if (call) return;

    if (!isClientReady || !user?.id || !callId || !videoClient) {
      return;
    }

    const createAndJoinCall = async () => {
      try {
        const newCall = videoClient.call("default", callId);
        await newCall.join({ create: true });
        setCall(newCall);
        setError(null);
      } catch (err) {
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
          } catch (err) {}
        })();
      }
    };
  }, [
    videoClient,
    isClientReady,
    user?.id,
    callId,
    navigate,
    navigatePath,
    call,
  ]);

  const handleLeaveCall = async () => {
    try {
      if (call) {
        await call.leave();
      }
    } catch (err) {}
    navigate(navigatePath);
  };

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
      <style>{customThemeStyle}</style>
      <StreamTheme className="light h-screen w-screen bg-white">
        <StreamVideo client={videoClient}>
          <StreamCall call={call}>
            <div className="full-call-container h-full">
              <div className="main-call-area">
                <div className="main-speaker-view">
                  <SpeakerLayout />
                </div>
                <div className="participants-list-sidebar">
                  <CallParticipantsList />
                </div>
              </div>
              <div className="controls-bar">
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
