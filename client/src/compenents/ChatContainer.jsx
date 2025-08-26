import React, { useState, useEffect, useRef } from 'react';
import assets from '../assets/assets';
import { messagesAPI } from '../lib/api';
import socketService from '../lib/socket';
import { messagesDummyData } from '../assets/assets';

const ChatContainer = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();
      socketService.onReceiveMessage(handleNewMessage);
      socketService.onUserTyping(handleUserTyping);
      socketService.onUserStopTyping(handleUserStopTyping);
      socketService.onConversationDeleted(handleConversationDeleted);
      socketService.onMessageDeleted(handleRemoteMessageDeleted);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Remove listeners to avoid duplicate handlers when switching users
      socketService.offReceiveMessage(handleNewMessage);
      socketService.offUserTyping(handleUserTyping);
      socketService.offUserStopTyping(handleUserStopTyping);
      socketService.offConversationDeleted(handleConversationDeleted);
      socketService.offMessageDeleted(handleRemoteMessageDeleted);
    };
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // Try to fetch real messages first
      try {
        const response = await messagesAPI.getMessages(selectedUser._id);
        if (response.data && response.data.length > 0) {
          setMessages(response.data);
        } else {
          // Use dummy messages if no real messages
          setMessages(messagesDummyData.filter(msg => 
            msg.senderId === selectedUser._id || msg.receiverId === selectedUser._id
          ));
        }
      } catch (error) {
        // Use dummy messages as fallback
        setMessages(messagesDummyData.filter(msg => 
          msg.senderId === selectedUser._id || msg.receiverId === selectedUser._id
        ));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Use dummy messages as fallback
      setMessages(messagesDummyData.filter(msg => 
        msg.senderId === selectedUser._id || msg.receiverId === selectedUser._id
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleConversationDeleted = (data) => {
    const sender = data.senderId?._id || data.senderId;
    if (sender === selectedUser._id) {
      setMessages([]);
    }
  };

  const handleRemoteMessageDeleted = (data) => {
    const { messageId } = data;
    setMessages(prev => prev.map(m => m._id === messageId ? { ...m, text: '', image: '', deleted: true } : m));
  };

  const handleNewMessage = (message) => {
    // message can come as object with populated ids or strings
    const sender = message.senderId?._id || message.senderId;
    const receiver = message.receiverId?._id || message.receiverId;
    // Only append if it belongs to this conversation
    if (
      (sender === selectedUser._id && receiver === currentUser._id) ||
      (sender === currentUser._id && receiver === selectedUser._id)
    ) {
      const withTimestamp = {
        ...message,
        timestamp: message.timestamp || message.createdAt || new Date().toISOString()
      };
      setMessages(prev => [...prev, withTimestamp]);
    }
  };

  const handleUserTyping = (data) => {
    const sender = data.senderId?._id || data.senderId;
    if (sender === selectedUser._id) {
      setTyping(true);
    }
  };

  const handleUserStopTyping = (data) => {
    const sender = data.senderId?._id || data.senderId;
    if (sender === selectedUser._id) {
      setTyping(false);
    }
  };

  // Auto-reply function
  const generateAutoReply = (message) => {
    const lowerMessage = message.toLowerCase().trim();
    
    if (lowerMessage === 'hi' || lowerMessage === 'hello' || lowerMessage === 'hey') {
      return "Hi there! 👋 How are you doing today?";
    } else if (lowerMessage.includes('how are you') || lowerMessage.includes('how r u')) {
      return "I'm doing great, thanks for asking! 😊 How about you?";
    } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return "Goodbye! 👋 Have a great day!";
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! 😊";
    } else if (lowerMessage.includes('name')) {
      return `My name is ${selectedUser?.fullName || 'QuickChat Bot'}! Nice to meet you!`;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return "I can chat with you, respond to greetings, and help you with basic conversation! 🤖";
    }
    
    return null;
  };

  const sendAutoReply = async (replyText) => {
    const autoReplyMessage = {
      _id: Date.now().toString(),
      senderId: selectedUser._id,
      receiverId: currentUser._id,
      text: replyText,
      timestamp: new Date().toISOString(),
      seen: false
    };

    setMessages(prev => [...prev, autoReplyMessage]);
    
    // Send to backend if possible
    try {
      await messagesAPI.sendMessage({
        receiverId: selectedUser._id,
        text: replyText
      });
    } catch (error) {
      console.log('Auto-reply sent locally');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      _id: Date.now().toString(),
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
      seen: false
    };

    setMessages(prev => [...prev, messageData]);
    setNewMessage('');

    // Send via socket (include senderId and timestamp)
    socketService.sendMessage({
      receiverId: selectedUser._id,
      senderId: currentUser._id,
      text: newMessage.trim(),
      timestamp: messageData.timestamp
    });

    // Send to backend
    try {
      await messagesAPI.sendMessage({
        receiverId: selectedUser._id,
        text: newMessage.trim()
      });
    } catch (error) {
      console.log('Message sent via socket only');
    }

    // Check for auto-reply
    const autoReply = generateAutoReply(newMessage.trim());
    if (autoReply) {
      setTimeout(() => {
        sendAutoReply(autoReply);
      }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
    }
  };

  const handleTyping = () => {
    socketService.typing({ receiverId: selectedUser._id, senderId: currentUser._id });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping({ receiverId: selectedUser._id, senderId: currentUser._id });
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestampOrDate) => {
    const source = timestampOrDate || new Date().toISOString();
    const date = new Date(source);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (!selectedUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-white">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 flex-shrink-0">
            <img 
              src={assets.logo_icon} 
              alt="Logo" 
              className="w-full h-full object-contain opacity-50"
              style={{ 
                filter: 'drop-shadow(0 0 4px rgba(147, 110, 255, 0.3))',
                imageRendering: 'crisp-edges'
              }}
            />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Chat anytime, anywhere</h2>
          <p className="text-gray-400">Select a user to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-600">
        <div className="flex items-center gap-3">
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt={selectedUser.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-white">{selectedUser.fullName}</h3>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${selectedUser.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-sm text-gray-400">
                {selectedUser.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              if (!selectedUser) return;
              try {
                await messagesAPI.deleteConversation(selectedUser._id);
                setMessages([]);
                // notify other party via socket
                socketService.deleteConversation({
                  receiverId: selectedUser._id,
                  senderId: currentUser._id,
                });
              } catch {}
            }}
            className="text-sm text-red-400 hover:text-red-300"
            title="Delete chat"
          >
            Delete
          </button>
          <img src={assets.menu_icon} alt="Menu" className="w-5 h-5 cursor-pointer" />
          <img src={assets.help_icon} alt="Info" className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center">
            <div className="text-gray-400">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === currentUser._id;
            return (
              <div
                key={message._id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[70%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                  <img
                    src={isOwnMessage ? (currentUser?.profilePic || assets.avatar_icon) : (selectedUser?.profilePic || assets.avatar_icon)}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className={`px-4 py-2 rounded-2xl relative ${
                    isOwnMessage 
                      ? 'bg-violet-600 text-white' 
                      : 'bg-[#282142] text-white'
                  }`}>
                    {message.image ? (
                      <img src={message.image} alt="attachment" className="max-w-xs rounded-md mb-2" />
                    ) : null}
                    {message.text ? (
                      <p className="text-sm">{message.text}</p>
                    ) : null}
                    {(!message.text && !message.image) && (
                      <p className="text-sm italic opacity-75">This message was deleted</p>
                    )}
                    <p className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </p>

                    {/* Per-message delete menu */}
                    <div className="absolute top-1 right-2 flex gap-2 opacity-80">
                      <button
                        className="text-xs text-red-300 hover:text-red-200"
                        title="Delete for me"
                        onClick={async () => {
                          try {
                            await messagesAPI.deleteMessageForMe(message._id);
                            setMessages(prev => prev.filter(m => m._id !== message._id));
                          } catch {}
                        }}
                      >
                        Me
                      </button>
                      {isOwnMessage && (
                        <button
                          className="text-xs text-red-300 hover:text-red-200"
                          title="Delete for everyone (2 min)"
                          onClick={async () => {
                            try {
                              await messagesAPI.deleteMessageForEveryone(message._id);
                              socketService.deleteMessage({
                                receiverId: selectedUser._id,
                                senderId: currentUser._id,
                                messageId: message._id,
                              });
                              setMessages(prev => prev.map(m => m._id === message._id ? { ...m, text: '', image: '', deleted: true } : m));
                            } catch {}
                          }}
                        >
                          All
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {typing && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2">
              <img
                src={selectedUser?.profilePic || assets.avatar_icon}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="bg-[#282142] px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-gray-600">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <label className="w-6 h-6 cursor-pointer text-gray-400 hover:text-violet-400">
            <img src={assets.gallery_icon} alt="Attachment" className="w-6 h-6" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !selectedUser) return;
                const reader = new FileReader();
                reader.onload = async () => {
                  const base64 = reader.result;
                  const tempId = Date.now().toString();
                  const localMsg = {
                    _id: tempId,
                    senderId: currentUser._id,
                    receiverId: selectedUser._id,
                    text: '',
                    image: base64,
                    timestamp: new Date().toISOString(),
                    seen: false,
                  };
                  setMessages(prev => [...prev, localMsg]);
                  socketService.sendMessage({
                    senderId: currentUser._id,
                    receiverId: selectedUser._id,
                    text: '',
                    image: base64,
                    timestamp: localMsg.timestamp,
                  });
                  try {
                    await messagesAPI.sendMessage({
                      receiverId: selectedUser._id,
                      text: '',
                      image: base64,
                    });
                  } catch {}
                };
                reader.readAsDataURL(file);
                e.target.value = '';
              }}
            />
          </label>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Send a message..."
            className="flex-1 bg-[#282142] rounded-full px-4 py-3 text-white placeholder-gray-400 border-none outline-none"
          />
          <button
            type="submit"
            className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center hover:bg-violet-700 transition-colors"
          >
            <img src={assets.send_icon} alt="Send" className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatContainer;
