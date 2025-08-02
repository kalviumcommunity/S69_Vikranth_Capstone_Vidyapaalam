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







import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  StreamVideo,
  StreamCall,
  CallControls,
  CallParticipantsList,
} from '@stream-io/video-react-sdk';
import { useStreamVideo } from '../contexts/StreamVideoContext';
import { useAuth } from '../contexts/AuthContext';
import '@stream-io/video-react-sdk/dist/css/styles.css';

const VideoCallPage = () => {
  const { videoClient, isClientReady } = useStreamVideo();
  const { user } = useAuth();
  const { callId } = useParams();
  const navigate = useNavigate();
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);

  const navigatePath = user?.role === 'teacher' ? '/teacher/overview' : '/student/overview';

  useEffect(() => {
    // Check if the call is already created to prevent re-running
    if (call) return;
    
    // If core dependencies are missing, set an error
    if (!isClientReady || !user?.id || !callId || !videoClient) {
      // This error will only show if the dependencies never become ready.
      // We don't set it in the first render to avoid a flicker.
      // A simple loading screen is sufficient for initial loading.
      return;
    }

    const createAndJoinCall = async () => {
      try {
        const newCall = videoClient.call('default', callId);
        await newCall.join({ create: true });
        console.log('VideoCallPage: Successfully created and joined the call.');
        setCall(newCall);
        setError(null); // Clear any previous error on success
      } catch (err) {
        console.error('Failed to create or join video call:', err);
        setError('Failed to join the video call. Please try again.');
        navigate(navigatePath);
      }
    };

    createAndJoinCall();

    return () => {
      if (call) {
        (async () => {
          try {
            await call.leave();
            console.log('VideoCallPage: Successfully left call on unmount.');
          } catch (err) {
            console.error('Failed to leave call on unmount:', err);
          }
        })();
      }
    };
  }, [videoClient, isClientReady, user?.id, callId, navigate, navigatePath, call]);

  const handleLeaveCall = async () => {
    try {
      if (call) {
        await call.leave();
        console.log('VideoCallPage: Successfully left call.');
      }
    } catch (err) {
      console.error('Failed to leave call:', err);
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
    <div className="w-screen h-screen bg-black text-white">
      <StreamVideo client={videoClient}>
        <StreamCall call={call}>
          <div className="relative w-full h-full">
            <div className="absolute inset-0">
              <CallParticipantsList />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900 bg-opacity-75">
              <CallControls onLeave={handleLeaveCall} />
            </div>
          </div>
        </StreamCall>
      </StreamVideo>
    </div>
  );
};

export default VideoCallPage;


