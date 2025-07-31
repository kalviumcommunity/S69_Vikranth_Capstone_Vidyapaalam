// In src/pages/ChatPage.js

import React, { useEffect, useState } from 'react';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
  Thread,
} from 'stream-chat-react';
import { useStreamChat } from '../contexts/StreamChatContext';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';

import 'stream-chat-react/dist/css/v2/index.css';


const ChatPage = () => {
  const { chatClient, isClientReady } = useStreamChat();
  const { user } = useAuth();
  const { recipientId } = useParams(); // <-- Use recipientId

  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const setupChannel = async () => {
      if (!isClientReady || !user || !recipientId) {
        return;
      }
      
      const currentUserId = user._id;

      // Create a unique channel ID by sorting the two user IDs
      const members = [currentUserId, recipientId];
      const channelId = members.sort().join('-');

      try {
        const newChannel = chatClient.channel('messaging', channelId, {
          name: `Chat with ${user.name}`,
          members: members,
        });

        await newChannel.watch();
        setChannel(newChannel);
        
      } catch (error) {
        console.error("Failed to set up chat channel:", error);
      }
    };

    setupChannel();

    return () => {
      if (channel) {
        channel.stopWatching();
      }
    };
  }, [chatClient, isClientReady, user, recipientId, channel]); // Added 'channel' to dependency array

  if (!isClientReady || !channel) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-500">
        Connecting to chat...
      </div>
    );
  }

  return (
    <div className="chat-container h-screen flex">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
