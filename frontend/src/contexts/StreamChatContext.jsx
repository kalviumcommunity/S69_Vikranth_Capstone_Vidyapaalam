import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useAuth } from './AuthContext';

const StreamChatContext = createContext();

export const useStreamChat = () => useContext(StreamChatContext);

export const StreamChatProvider = ({ children }) => {
  const { user, authToken } = useAuth();
  const [chatClient, setChatClient] = useState(null);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    // Check if we have the minimum required data to proceed
    if (!user || !user._id || !authToken) {
      console.log('Stream Chat Provider: Dependencies not ready. User, User ID, or Auth Token is missing.', {
        user: !!user,
        userId: user?._id,
        authToken: !!authToken,
      });

      if (chatClient) {
        chatClient.disconnectUser();
        setChatClient(null);
        setIsClientReady(false);
      }
      return;
    }

    // If we've made it this far, dependencies are ready. Let's initialize.
    console.log('Stream Chat Provider: Dependencies are ready. Initializing chat client...');

    const initializeClient = async () => {
      try {
        const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
        await client.connectUser({ id: user._id, name: user.name }, authToken);
        
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

    // This cleanup function will disconnect the user when the component unmounts
    return () => {
      console.log('Stream Chat Provider: Disconnecting user...');
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [user, user?._id, authToken]); // Ensure all critical dependencies are in the array

  return (
    <StreamChatContext.Provider value={{ chatClient, isClientReady }}>
      {children}
    </StreamChatContext.Provider>
  );
};
