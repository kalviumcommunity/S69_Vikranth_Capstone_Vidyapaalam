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
          } catch (err) {
            // Optionally handle error
          }
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
    } catch (err) {
      // Optionally handle error
    }
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
    <StreamTheme className="h-screen w-screen bg-black">
      <StreamVideo client={videoClient}>
        <StreamCall call={call}>
          <div className="relative w-full h-full">
            <SpeakerLayout />
            <div className="absolute top-0 right-0 m-4 z-20">
              <CallParticipantsList />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900 bg-opacity-75 z-10">
              <CallControls onLeave={handleLeaveCall} />
            </div>
          </div>
        </StreamCall>
      </StreamVideo>
    </StreamTheme>
  );
};

export default VideoCallPage;
