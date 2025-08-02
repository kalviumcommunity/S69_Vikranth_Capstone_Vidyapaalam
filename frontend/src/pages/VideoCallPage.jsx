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







import React, { useEffect, useRef } from 'react';
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
  const callRef = useRef(null);

  const navigatePath = user?.role === 'teacher' ? '/teacher/overview' : '/student/overview';

  useEffect(() => {
    // Only proceed if the client is ready, the user is logged in, and a call hasn't been created yet.
    if (callRef.current || !isClientReady || !user?.id || !callId || !videoClient) {
      return;
    }

    const createAndJoinCall = async () => {
      try {
        const newCall = videoClient.call('default', callId);
        await newCall.join({ create: true });
        callRef.current = newCall;
        console.log('VideoCallPage: Successfully created and joined the call.');
      } catch (error) {
        console.error('Failed to create or join video call:', error);
        navigate(navigatePath);
      }
    };

    createAndJoinCall();

    return () => {
      if (callRef.current) {
        callRef.current.leave();
        console.log('VideoCallPage: Leaving call on unmount.');
      }
    };
  }, [videoClient, isClientReady, user, callId, navigate, navigatePath]);

  if (!isClientReady || !callRef.current) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg">
        Connecting to video call...
      </div>
    );
  }

  const handleLeaveCall = async () => {
    if (callRef.current) {
      await callRef.current.leave();
    }
    navigate(navigatePath);
  };

  return (
    <div className="w-screen h-screen bg-black text-white">
      <StreamVideo client={videoClient}>
        <StreamCall call={callRef.current}>
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
