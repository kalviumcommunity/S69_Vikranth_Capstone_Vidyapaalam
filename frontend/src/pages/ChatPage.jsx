// // src/pages/ChatPage.js

// import React, { useEffect, useState } from 'react';
// import {
//   Chat,
//   Channel,
//   ChannelHeader,
//   MessageList,
//   MessageInput,
//   Window,
//   Thread,
// } from 'stream-chat-react';
// import { useStreamChat } from '../contexts/StreamChatContext';
// import { useAuth } from '../contexts/AuthContext';
// import { useParams } from 'react-router-dom';

// import 'stream-chat-react/dist/css/v2/index.css';


// const ChatPage = () => {
//   const { chatClient, isClientReady } = useStreamChat();
//   const { user } = useAuth();
//   const { recipientId } = useParams();

//   const [channel, setChannel] = useState(null);

//   useEffect(() => {
//     const setupChannel = async () => {
//       // Check for all dependencies to be ready, including a valid current user ID
//       if (!isClientReady || !user || !user.id || !recipientId || recipientId === '') {
//         console.log("Aborting channel setup. Missing a dependency:", {
//           isClientReady,
//           user: !!user,
//           currentUserId: user?.id,
//           recipientId
//         });
//         return;
//       }
      
//       console.log("Attempting to create channel for users:", {
//         currentUserId: user.id, // <-- Corrected: user.id instead of user._id
//         recipientId: recipientId
//       });

//       const currentUserId = user.id; // <-- Corrected: user.id instead of user._id

//       // Create a unique channel ID by sorting the two user IDs
//       const members = [currentUserId, recipientId];
//       const channelId = members.sort().join('-');

//       try {
//         const newChannel = chatClient.channel('messaging', channelId, {
//           name: `Chat with ${user.name}`,
//           members: members,
//         });

//         await newChannel.watch();
//         setChannel(newChannel);
        
//       } catch (error) {
//         console.error("Failed to set up chat channel:", error);
//       }
//     };

//     setupChannel();

//     return () => {
//       if (channel) {
//         channel.stopWatching();
//       }
//     };
//   }, [chatClient, isClientReady, user, recipientId]);

//   if (!isClientReady || !channel) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-500">
//         Connecting to chat...
//       </div>
//     );
//   }

//   return (
//     <div className="chat-container h-screen flex">
//       <Chat client={chatClient}>
//         <Channel channel={channel}>
//           <Window>
//             <ChannelHeader />
//             <MessageList />
//             <MessageInput />
//           </Window>
//           <Thread />
//         </Channel>
//       </Chat>
//     </div>
//   );
// };

// export default ChatPage;






// src/pages/ChatPage.js

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
  const { recipientId } = useParams();
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const setupChannel = async () => {
      if (!isClientReady || !user?.id || !recipientId || recipientId === '') return;

      const members = [user.id, recipientId].sort();
      const channelId = members.join('-');

      try {
        const newChannel = chatClient.channel('messaging', channelId, {
          name: `Chat with ${user.name}`,
          members,
        });

        await newChannel.watch();
        setChannel(newChannel);
      } catch (error) {
        console.error('Failed to set up chat channel:', error);
      }
    };

    setupChannel();

    return () => {
      if (channel) {
        channel.stopWatching();
      }
    };
  }, [chatClient, isClientReady, user, recipientId]);

  if (!isClientReady || !channel) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-500 text-lg">
        Connecting to chat...
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-white flex flex-col sm:flex-row overflow-hidden">
      <Chat client={chatClient} theme="str-chat__theme-light">
        <Channel channel={channel}>
          <Window>
            <div className="flex flex-col h-screen sm:h-full w-full">
              {/* Header */}
              <div className="border-b px-4 py-3 bg-white shadow-sm">
                <ChannelHeader />
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                <MessageList />
              </div>

              {/* Input */}
              <div className="border-t p-2 bg-white">
                <MessageInput />
              </div>
            </div>

            {/* Thread Panel (optional, collapses on mobile) */}
            <Thread />
          </Window>
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
