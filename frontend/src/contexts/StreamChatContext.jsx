import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useAuth } from './AuthContext';

const StreamChatContext = createContext();

export const useStreamChat = () => useContext(StreamChatContext);

export const StreamChatProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [chatClient, setChatClient] = useState(null);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    if (loading || !user || !user.id) {
      console.log('Stream Chat Provider: Dependencies not ready yet.', { loading, user: !!user, userId: user?.id });
      if (chatClient) {
        chatClient.disconnectUser();
        setChatClient(null);
        setIsClientReady(false);
      }
      return;
    }

    const initializeClient = async () => {
      try {
        console.log('Stream Chat Provider: Fetching Stream token from backend using cookie authentication...');

        const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
        // The fetch call will automatically include your `accessToken` cookie
        const response = await fetch(`${backendUrl}/api/stream/token`, {
          credentials: 'include', // Important for sending cookies with cross-origin requests
        });

        if (!response.ok) {
          throw new Error('Failed to fetch Stream Chat token from backend.');
        }

        const { token, apiKey, userId } = await response.json();

        const client = StreamChat.getInstance(apiKey);
        await client.connectUser({ id: userId, name: user.name, image: user.picture }, token);
        
        setChatClient(client);
        setIsClientReady(true);
        console.log('Stream Chat Provider: Client initialized and connected successfully.');
      } catch (error) {
        console.error("Stream Chat Provider: Error connecting user to Stream:", error);
        setChatClient(null);
        setIsClientReady(false);
      }
    };

    initializeClient();

    return () => {
      console.log('Stream Chat Provider: Disconnecting user...');
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [user, user?.id, loading]);

  return (
    <StreamChatContext.Provider value={{ chatClient, isClientReady }}>
      {children}
    </StreamChatContext.Provider>
  );
};
