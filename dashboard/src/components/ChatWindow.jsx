import React, { useState, useEffect, useRef } from 'react';
import { messagesAPI, cannedResponsesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import socketService from '../services/socket';
import { Send, Paperclip, Smile, Zap } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ChatWindow = ({ conversation }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [cannedResponses, setCannedResponses] = useState([]);
  const [showCannedResponses, setShowCannedResponses] = useState(false);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      fetchMessages();
      fetchCannedResponses();
      socketService.joinConversation(conversation._id);

      socketService.on('message:new', handleNewMessage);
      socketService.on('typing:start', handleTypingStart);
      socketService.on('typing:stop', handleTypingStop);

      return () => {
        socketService.off('message:new', handleNewMessage);
        socketService.off('typing:start', handleTypingStart);
        socketService.off('typing:stop', handleTypingStop);
      };
    }
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getByConversation(conversation._id);
      setMessages(response.data.messages);
      
      // Mark messages as read
      await messagesAPI.markAllRead(conversation._id);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchCannedResponses = async () => {
    try {
      const response = await cannedResponsesAPI.getAll();
      setCannedResponses(response.data);
    } catch (error) {
      console.error('Failed to fetch canned responses');
    }
  };

  const handleNewMessage = (data) => {
    if (data.message.conversation === conversation._id) {
      setMessages((prev) => [...prev, data.message]);
    }
  };

  const handleTypingStart = (data) => {
    if (data.conversationId === conversation._id) {
      setTyping(true);
    }
  };

  const handleTypingStop = (data) => {
    if (data.conversationId === conversation._id) {
      setTyping(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      socketService.sendMessage(
        conversation._id,
        newMessage,
        'agent',
        user.id,
        'User'
      );
      setNewMessage('');
      socketService.stopTyping(conversation._id);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    socketService.startTyping(conversation._id, user.name);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      socketService.stopTyping(conversation._id);
    }, 1000);
  };

  const handleCannedResponse = (response) => {
    setNewMessage(response.content);
    setShowCannedResponses(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {conversation.visitor?.name || 'Anonymous'}
            </h2>
            <p className="text-sm text-gray-500">{conversation.visitor?.email || 'No email'}</p>
          </div>
          <div className="flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              conversation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              conversation.status === 'active' ? 'bg-green-100 text-green-800' :
              conversation.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {conversation.status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet</p>
          </div>
        ) : (
          messages.map((message) => {
            const isAgent = message.sender === 'agent';
            return (
              <div
                key={message._id}
                className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md ${isAgent ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-lg px-4 py-2 ${
                    isAgent
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {format(new Date(message.createdAt), 'HH:mm')}
                  </p>
                </div>
              </div>
            );
          })
        )}
        
        {typing && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border border-gray-200 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-500">Visitor is typing...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        {showCannedResponses && (
          <div className="mb-2 max-h-40 overflow-y-auto bg-gray-50 rounded-lg border border-gray-200">
            {cannedResponses.map((response) => (
              <button
                key={response._id}
                onClick={() => handleCannedResponse(response)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
              >
                <p className="text-sm font-medium text-gray-900">{response.title}</p>
                <p className="text-xs text-gray-500 truncate">{response.content}</p>
              </button>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <button
            type="button"
            onClick={() => setShowCannedResponses(!showCannedResponses)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Zap className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Smile className="w-5 h-5" />
          </button>
          
          <textarea
            value={newMessage}
            onChange={handleTyping}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Type your message..."
            rows="1"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
