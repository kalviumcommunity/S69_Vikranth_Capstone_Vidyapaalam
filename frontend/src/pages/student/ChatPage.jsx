import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeftIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const ChatPage = () => {
  const { teacherId } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const mockTeachers = {
    "1": { name: "Maria Johnson", avatar: "/placeholder.svg" },
    "2": { name: "David Lee", avatar: "/placeholder.svg" },
    "4": { name: "Michael Chen", avatar: "/placeholder.svg" },
  };

  const currentTeacher = mockTeachers[teacherId] || { name: "Teacher", avatar: "/placeholder.svg" };

  useEffect(() => {
    // Simulate fetching initial messages
    const initialMessages = [
      { id: 1, sender: "teacher", teacherId, content: "Hello!", timestamp: new Date(Date.now() - 3600000) },
      { id: 2, sender: "student", teacherId, content: "Hi!", timestamp: new Date(Date.now() - 3000000) },
    ];
    setMessages(initialMessages.filter(msg => msg.teacherId === teacherId));

    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [teacherId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const newMsg = { id: Date.now(), sender: "student", teacherId, content: newMessage.trim(), timestamp: new Date() };
    setMessages([...messages, newMsg]);
    setNewMessage("");
    setTimeout(() => {
      const teacherResponse = { id: Date.now() + 1, sender: "teacher", teacherId, content: "Acknowledged!", timestamp: new Date() };
      setMessages((prevMessages) => [...prevMessages, teacherResponse]);
    }, 1000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileMessage = {
        id: Date.now(),
        sender: "student",
        teacherId,
        contentType: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
        name: file.name,
        url: URL.createObjectURL(file),
        timestamp: new Date(),
      };
      setMessages([...messages, fileMessage]);
      setTimeout(() => {
        const teacherResponse = {
          id: Date.now() + 1,
          sender: "teacher",
          teacherId,
          content: `Received the ${fileMessage.contentType}.`,
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, teacherResponse]);
      }, 1500);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-[calc(100vh-200px)]"
    >
      <div className="flex-1 flex flex-col border border-gray-200 rounded-lg shadow-sm bg-white">
        <div className="border-b p-4">
          <div className="flex items-center">
            <Link to="/student/favorites" className="mr-4">
              <ArrowLeftIcon className="h-6 w-6 text-gray-600 hover:text-gray-800" />
            </Link>
            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
              {currentTeacher.avatar ? (
                <img src={currentTeacher.avatar} alt={currentTeacher.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-medium">{currentTeacher.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">{currentTeacher.name}</h2>
              <div className="text-sm font-normal text-gray-500">
                Teacher #{teacherId}
              </div>
            </div>
          </div>
        </div>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === "student" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === "student" ? "bg-blue-600 text-white font-medium" : "bg-gray-300 font-medium"
              }`}>
                {message.contentType === "image" && (
                  <img src={message.url} alt={message.name} className="max-h-48 rounded-md" />
                )}
                {message.contentType === "video" && (
                  <video src={message.url} className="max-h-48 rounded-md" controls />
                )}
                {message.contentType === "document" && (
                  <div className="flex items-center bg-gray-100 rounded-md p-2">
                    <PaperClipIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <a href={message.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {message.name}
                    </a>
                  </div>
                )}
                {message.content && <p>{message.content}</p>}
                <p className="text-xs mt-1 opacity-70 text-right">{formatTime(message.timestamp)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <div className="mr-3">
              <input
                type="file"
                accept="image/*, video/*, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="rounded-md bg-orange-600 text-white p-2 hover:bg-orange-700"
              >
                <PaperClipIcon className="h-5 w-5" />
              </button>
            </div>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="h-10 w-10 flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPage;