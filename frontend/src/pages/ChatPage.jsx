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
      // Check for all dependencies to be ready, including a valid current user ID
      if (!isClientReady || !user || !user.id || !recipientId || recipientId === '') {
        return;
      }
      
      const currentUserId = user.id;

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
  }, [chatClient, isClientReady, user, recipientId]);

  if (!isClientReady || !channel) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-500">
        Connecting to chat...
      </div>
    );
  }

  // Define your custom theme object right here
  const customTheme = {
    // Override the general styling of the entire Chat component
    '--str-chat__primary-color': '#42b0f4',
    '--str-chat__container-background-color': '#fafafa',
    '--str-chat__base-font-color': '#333',
    '--str-chat__message-simple-sent-background-color': '#dcf8c6',
    '--str-chat__message-simple-received-background-color': '#e5e5ea',

    // You can also target specific components more granularly
    channelHeader: {
      container: {
        background: '#fff',
        borderBottom: '1px solid #e5e5e5',
        padding: '10px 15px',
      },
      title: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
      },
    },
    messageInput: {
      textarea: {
        borderColor: '#e5e5e5',
        boxShadow: 'none',
        '&:focus': {
          borderColor: '#42b0f4',
        },
      },
      sendButton: {
        background: '#42b0f4',
        color: '#fff',
        borderRadius: '50%',
      },
    },
  };

  return (
    <div className="chat-container h-screen flex">
      {/* Pass the custom theme directly to the Chat component */}
      <Chat client={chatClient} theme={customTheme}>
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
