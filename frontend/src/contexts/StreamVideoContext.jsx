import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { useAuth } from './AuthContext';

const StreamVideoContext = createContext();

export const useStreamVideo = () => useContext(StreamVideoContext);

export const StreamVideoProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [videoClient, setVideoClient] = useState(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Prevent a second initialization run
    if (isInitializedRef.current) {
      console.log("Stream Video Provider: Initialization already started, skipping.");
      return;
    }

    if (loading || !user || !user.id) {
      console.log('Stream Video Provider: Dependencies not ready. Disconnecting existing client.');
      if (videoClient) {
        videoClient.disconnectUser();
      }
      setVideoClient(null);
      setIsClientReady(false);
      return;
    }

    const initializeClient = async () => {
      isInitializedRef.current = true; // Mark initialization as started

      try {
        console.log('Stream Video Provider: Fetching Stream token from backend...');
        const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/stream/video-token`, {
          credentials: 'include',
        });

        if (!response.ok) {
          console.error('Failed to fetch Stream Video token from backend:', response.status, response.statusText);
          throw new Error('Failed to fetch Stream Video token from backend.');
        }

        const { token, apiKey, userId } = await response.json();
        
        const client = new StreamVideoClient({
          apiKey,
          user: { id: userId, name: user.name, image: user.avatar },
          token,
        });

        setVideoClient(client);
        setIsClientReady(true);
        console.log('Stream Video Provider: Client initialized and connected successfully.');
      } catch (error) {
        console.error("Stream Video Provider: Error connecting user to Stream:", error);
        setVideoClient(null);
        setIsClientReady(false);
      }
    };

    initializeClient();

    return () => {
      console.log("Stream Video Provider: Component unmounting. Disconnecting client.");
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [user, user?.id, loading]);

  return (
    <StreamVideoContext.Provider value={{ videoClient, isClientReady }}>
      {children}
    </StreamVideoContext.Provider>
  );
};
