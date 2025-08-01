// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { StreamVideoClient } from '@stream-io/video-react-sdk';
// import { useAuth } from './AuthContext';

// const StreamVideoContext = createContext();

// export const useStreamVideo = () => useContext(StreamVideoContext);

// export const StreamVideoProvider = ({ children }) => {
//   const { user, loading } = useAuth();
//   const [videoClient, setVideoClient] = useState(null);
//   const [isClientReady, setIsClientReady] = useState(false);

//   useEffect(() => {
//     if (loading || !user || !user.id) {
//       if (videoClient) {
//         videoClient.disconnectUser();
//         setVideoClient(null);
//       }
//       return;
//     }

//     const initializeClient = async () => {
//       try {
//         const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
//         const response = await fetch(`${backendUrl}/api/stream/video-token`, {
//           credentials: 'include',
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch Stream Video token from backend.');
//         }

//         const { token, apiKey, userId } = await response.json();
        
//         const client = new StreamVideoClient({
//           apiKey,
//           user: { id: userId, name: user.name, image: user.avatar },
//           token,
//         });

//         setVideoClient(client);
//         setIsClientReady(true);
//         console.log('Stream Video Provider: Client initialized and connected successfully.');
//       } catch (error) {
//         console.error("Stream Video Provider: Error connecting user to Stream:", error);
//         setVideoClient(null);
//         setIsClientReady(false);
//       }
//     };

//     initializeClient();

//     return () => {
//       if (videoClient) {
//         videoClient.disconnectUser();
//       }
//     };
//   }, [user, user?.id, loading]);

//   return (
//     <StreamVideoContext.Provider value={{ videoClient, isClientReady }}>
//       {children}
//     </StreamVideoContext.Provider>
//   );
// };



import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { useAuth } from './AuthContext';

const StreamVideoContext = createContext();

export const useStreamVideo = () => useContext(StreamVideoContext);

export const StreamVideoProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [videoClient, setVideoClient] = useState(null);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    if (loading || !user || !user.id) {
      if (videoClient) {
        videoClient.disconnectUser();
        setVideoClient(null);
        setIsClientReady(false);
      }
      return;
    }

    const initializeClient = async () => {
      try {
        const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/stream/video-token`, {
          credentials: 'include',
        });

        if (!response.ok) {
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