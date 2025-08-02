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
  Call,
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

  const navigatePath = user?.role === 'teacher' ? '/teacher/overview' : '/student/overview';

  useEffect(() => {
    console.log('VideoCallPage Effect: Checking dependencies...');
    console.log({ isClientReady, user: !!user, callId, hasCall: !!call, hasVideoClient: !!videoClient });

    // The ultimate defensive check: is videoClient an object with the right method?
    if (!videoClient || typeof videoClient.getOrCreateCall !== 'function' || !user?.id || !callId || call) {
      console.error('VideoCallPage Effect: Guard clause triggered. Exiting effect.');
      return;
    }
    
    console.log('VideoCallPage Effect: Setting up a new call instance...');

    try {
      const callInstance = videoClient.getOrCreateCall({ id: callId });
      setCall(callInstance);
      callInstance.join();
      console.log('VideoCallPage Effect: Successfully joined call.');
    } catch (error) {
      console.error('Failed to join video call:', error);
      navigate(navigatePath);
    }

    return () => {
      if (callInstance) {
        callInstance.leave();
      }
    };
  }, [videoClient, user, callId, call, navigate, navigatePath, isClientReady]);

  if (!isClientReady || !call) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg">
        Connecting to video call...
      </div>
    );
  }
  
  const handleLeaveCall = async () => {
    await call.leave();
    navigate(navigatePath);
  };

  return (
    <div className="w-screen h-screen bg-black text-white">
      <StreamVideo client={videoClient}>
        <Call call={call}>
          <div className="relative w-full h-full">
            <div className="absolute inset-0">
              <CallParticipantsList />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <CallControls onLeave={handleLeaveCall} />
            </div>
          </div>
        </Call>
      </StreamVideo>
    </div>
  );
};

export default VideoCallPage;
