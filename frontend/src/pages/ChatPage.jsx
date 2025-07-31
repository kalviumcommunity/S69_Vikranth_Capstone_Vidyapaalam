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






// // src/pages/ChatPage.js

// import React, { useEffect, useState } from 'react';

// import {

//   Chat,

//   Channel,

//   ChannelHeader,

//   MessageList,

//   MessageInput,

//   Window,

//   Thread,

// } from 'stream-chat-react';

// import { useStreamChat } from '../contexts/StreamChatContext';

// import { useAuth } from '../contexts/AuthContext';

// import { useParams } from 'react-router-dom';



// import 'stream-chat-react/dist/css/v2/index.css';



// const ChatPage = () => {

//   const { chatClient, isClientReady } = useStreamChat();

//   const { user } = useAuth();

//   const { recipientId } = useParams();

//   const [channel, setChannel] = useState(null);



//   useEffect(() => {

//     const setupChannel = async () => {

//       if (!isClientReady || !user?.id || !recipientId || recipientId === '') return;



//       const members = [user.id, recipientId].sort();

//       const channelId = members.join('-');



//       try {

//         const newChannel = chatClient.channel('messaging', channelId, {

//           name: `Chat with ${user.name}`,

//           members,

//         });



//         await newChannel.watch();

//         setChannel(newChannel);

//       } catch (error) {

//         console.error('Failed to set up chat channel:', error);

//       }

//     };



//     setupChannel();



//     return () => {

//       if (channel) {

//         channel.stopWatching();

//       }

//     };

//   }, [chatClient, isClientReady, user, recipientId]);



//   if (!isClientReady || !channel) {

//     return (

//       <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-500 text-lg">

//         Connecting to chat...

//       </div>

//     );

//   }



//   return (

//     <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 p-2 sm:p-4">

//       <div className="w-full h-full border border-gray-200 bg-white rounded-xl shadow-lg overflow-hidden">

//         <Chat client={chatClient} theme="str-chat__theme-light">

//           <Channel channel={channel}>

//             <Window>

//               <div className="border-b px-4 py-3 bg-white shadow-sm">

//                 <ChannelHeader />

//               </div>

//               <div className="flex-1 h-[calc(100vh-160px)] overflow-y-auto">

//                 <MessageList />

//               </div>

//               <div className="border-t p-2 bg-white">

//                 <MessageInput />

//               </div>

//             </Window>

//             <Thread />

//           </Channel>

//         </Chat>

//       </div>

//     </div>

//   );

// };



// export default ChatPage;




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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 via-white to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Connecting to chat...</p>
        </div>
      </div>
    );
  }

return (
  <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[calc(90vh-2rem)] sm:h-[calc(90vh-3rem)]">
    <Chat client={chatClient} theme="str-chat__theme-light">
      <Channel channel={channel}>
        <Window>
          <div className="border-b border-gray-200 bg-orange-50 p-4 sm:p-6">
            <ChannelHeader />
          </div>
          <div className="flex-1 overflow-y-auto bg-white">
            <MessageList />
          </div>
          <div className="border-t border-gray-200 bg-orange-50 p-3 sm:p-4">
            <MessageInput
              additionalTextareaProps={{
                className:
                  'border-orange-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 rounded-lg',
              }}
            />
          </div>
        </Window>
        <Thread
          additionalMessageInputProps={{
            className:
              'border-orange-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 rounded-lg',
          }}
        />
      </Channel>
    </Chat>
  </div>
);
};

export default ChatPage;
