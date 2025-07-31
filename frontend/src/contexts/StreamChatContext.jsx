import React, { createContext, useState, useEffect, useContext } from 'react';
import { StreamChat } from 'stream-chat';
import { useAuth } from './AuthContext'; // Make sure this path is correct

const StreamChatContext = createContext(null);

export const StreamChatProvider = ({ children }) => {
  const { user, loading } = useAuth(); 
  const [chatClient, setChatClient] = useState(null);
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    const connectUserToStream = async () => {
      try {
        const response = await fetch('/api/stream/token', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`, 
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch Stream token');
        }
        
        const { apiKey, token, userId } = await response.json();
        
        const client = StreamChat.getInstance(apiKey);
        
        await client.connectUser(
          { id: userId }, 
          token
        );

        setChatClient(client);
        setIsClientReady(true);
        console.log("Stream client connected successfully!");

      } catch (error) {
        console.error("Stream connection failed:", error);
      }
    };
    
    return () => {
        if (chatClient) {
            chatClient.disconnectUser();
            setChatClient(null);
            setIsClientReady(false);
            console.log("Stream client disconnected.");
        }
    };
    
    connectUserToStream();
    
  }, [user, loading]); // Depend on user and loading from AuthContext

  const value = { chatClient, isClientReady };

  return (
    <StreamChatContext.Provider value={value}>
      {children}
    </StreamChatContext.Provider>
  );
};

export const useStreamChat = () => {
  const context = useContext(StreamChatContext);
  if (context === undefined) {
    throw new Error('useStreamChat must be used within a StreamChatProvider');
  }
  return context;
};