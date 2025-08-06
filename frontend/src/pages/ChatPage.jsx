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
//   const [otherUser, setOtherUser] = useState(null); // <-- New state to store the other user's data

//   useEffect(() => {
//     const setupChannel = async () => {
//       if (!isClientReady || !user?.id || !recipientId || recipientId === '') return;

//       const members = [user.id, recipientId].sort();
//       const channelId = members.join('-');

//       try {
//         const newChannel = chatClient.channel('messaging', channelId, {
//           members,
//         });

//         await newChannel.watch();
//         setChannel(newChannel);

//         // Find the other user from the channel's members
//         const otherMember = Object.values(newChannel.state.members).find(
//           (member) => member.user_id !== user.id
//         );
//         setOtherUser(otherMember?.user || null);
        
//       } catch (error) {
//         console.error('Failed to set up chat channel:', error);
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
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 via-white to-blue-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500 mx-auto mb-4"></div>
//           <p className="text-lg font-semibold text-gray-700">Connecting to chat...</p>
//         </div>
//       </div>
//     );
//   }

//   // Determine the title based on the other user's name
//   const channelTitle = otherUser ? otherUser.name : 'Loading...';

//   return (
//     <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[calc(90vh-2rem)] sm:h-[calc(90vh-3rem)]">
//       <Chat client={chatClient} theme="str-chat__theme-light">
//         <Channel channel={channel}>
//           <Window>
//             <div className="border-b border-gray-200 bg-orange-50 p-4 sm:p-6">
//               <ChannelHeader title={channelTitle} /> {/* <-- Updated ChannelHeader */}
//             </div>
//             <div className="flex-1 overflow-y-auto bg-white">
//               <MessageList />
//             </div>
//             <div className="border-t border-gray-200 bg-orange-50 p-3 sm:p-4">
//               <MessageInput
//                 additionalTextareaProps={{
//                   className:
//                     'border-orange-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 rounded-lg',
//                 }}
//               />
//             </div>
//           </Window>
//           <Thread
//             additionalMessageInputProps={{
//               className:
//                 'border-orange-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 rounded-lg',
//             }}
//           />
//         </Channel>
//       </Chat>
//     </div>
//   );
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
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    const setupChannel = async () => {
      if (!isClientReady || !user?.id || !recipientId || recipientId === '') return;

      const members = [user.id, recipientId].sort();
      const channelId = members.join('-');

      try {
        const newChannel = chatClient.channel('messaging', channelId, {
          members,
        });

        await newChannel.watch();
        setChannel(newChannel);

        const otherMember = Object.values(newChannel.state.members).find(
          (member) => member.user_id !== user.id
        );
        setOtherUser(otherMember?.user || null);
        
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
        <div className="text-center p-4 sm:p-8 bg-white rounded-xl shadow-lg border border-slate-200 max-w-sm w-full">
          <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-t-3 border-blue-500 mx-auto mb-4"></div>
          <p className="text-sm sm:text-lg font-medium text-slate-700">Connecting to chat...</p>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  const channelTitle = otherUser ? otherUser.name : 'Loading...';

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="h-full p-0 sm:p-2 md:p-4 lg:p-6">
        <div className="h-full max-w-none lg:max-w-6xl xl:max-w-7xl mx-auto">
          <Chat client={chatClient} theme="str-chat__theme-light">
            <Channel channel={channel}>
              <div className="h-full bg-white rounded-none sm:rounded-xl shadow-none sm:shadow-xl border-0 sm:border border-slate-200 overflow-hidden flex flex-col">
                <Window>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 sm:p-4 md:p-5 shadow-lg">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm sm:text-lg md:text-xl font-semibold">
                          {otherUser?.name ? otherUser.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm sm:text-base md:text-lg font-semibold truncate">
                          {channelTitle}
                        </div>
                        <div className="text-xs sm:text-sm text-blue-100 mt-0.5">
                          {otherUser ? 'Active now' : 'Connecting...'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-hidden bg-slate-50/30">
                    <div className="h-full overflow-y-auto px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                      <MessageList />
                    </div>
                  </div>

                  {/* Input */}
                  <div className="bg-white border-t border-slate-200 p-2 sm:p-3 md:p-4 lg:p-5">
                    <div className="bg-slate-50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                      <MessageInput
                        additionalTextareaProps={{
                          className: 'bg-transparent border-0 focus:ring-0 resize-none placeholder-slate-500 text-sm sm:text-base',
                          placeholder: `Message ${otherUser?.name || 'user'}...`,
                          rows: 1,
                        }}
                      />
                    </div>
                  </div>
                </Window>

                <Thread />
              </div>
            </Channel>
          </Chat>
        </div>
      </div>

      <style jsx global>{`
        .str-chat__channel-header { display: none !important; }
        .str-chat__message-list { background: transparent !important; }
        .str-chat__message-input { background: transparent !important; border: none !important; padding: 0 !important; }
        .str-chat__message-input-inner { background: transparent !important; border: none !important; }
        .str-chat__message-simple__content { border-radius: 1rem !important; box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; }
        .str-chat__message-simple__content.str-chat__message-simple__content--me { background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important; color: white !important; }
        .str-chat__message-simple__content:not(.str-chat__message-simple__content--me) { background: white !important; border: 1px solid #e2e8f0 !important; }
        .str-chat__send-button { background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important; border-radius: 0.5rem !important; }
        .str-chat__textarea__textarea { min-height: 36px !important; }
        
        @media (max-width: 640px) {
          .str-chat__message-simple__content { max-width: 85% !important; }
          .str-chat__textarea__textarea { font-size: 16px !important; }
          .str-chat__thread { position: fixed !important; inset: 0 !important; z-index: 1000 !important; }
        }
        @media (min-width: 1025px) {
          .str-chat__message-simple__content { max-width: 65% !important; }
          .str-chat__main-panel--thread-open { max-width: 60% !important; }
          .str-chat__thread { max-width: 40% !important; }
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
