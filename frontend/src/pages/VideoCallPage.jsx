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

  useEffect(() => {
    const setupCall = async () => {
      if (!isClientReady || !user?.id || !callId) return;

      const newCall = videoClient.getOrCreateCall({ id: callId });
      setCall(newCall);
      
      try {
        await newCall.join();
      } catch (error) {
        console.error('Failed to join video call:', error);
        navigate('/overview'); // Redirect on error
      }
    };

    setupCall();

    // Cleanup: leave the call when the component unmounts
    return () => {
      if (call) {
        call.leave();
      }
    };
  }, [isClientReady, user, callId, videoClient, navigate, call]);

  if (!isClientReady || !call) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white text-lg">
        Connecting to video call...
      </div>
    );
  }
  
  const handleLeaveCall = async () => {
    await call.leave();
    navigate('/overview'); // Redirect to overview page after leaving the call
  };

  return (
    <div className="w-screen h-screen bg-black text-white">
      <StreamVideo client={videoClient}>
        <Call call={call}>
          <div className="relative w-full h-full">
            {/* The main video content area */}
            <div className="absolute inset-0">
              <CallParticipantsList />
            </div>
            {/* Controls at the bottom */}
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