import React, { useState, useEffect } from 'react';
import { conversationsAPI } from '../services/api';
import socketService from '../services/socket';
import { Search, Circle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const ConversationList = ({ onSelectConversation, selectedConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();

    socketService.on('conversation:new', handleNewConversation);
    socketService.on('message:new', handleNewMessage);

    return () => {
      socketService.off('conversation:new', handleNewConversation);
      socketService.off('message:new', handleNewMessage);
    };
  }, [filter]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await conversationsAPI.getAll(params);
      setConversations(response.data.conversations);
    } catch (error) {
      toast.error('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = (data) => {
    setConversations((prev) => [data.conversation, ...prev]);
  };

  const handleNewMessage = (data) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === data.message.conversation
          ? { ...conv, lastMessageAt: new Date() }
          : conv
      )
    );
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.visitor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.visitor?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = {
    pending: 'bg-yellow-500',
    active: 'bg-green-500',
    resolved: 'bg-blue-500',
    closed: 'bg-gray-500',
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex space-x-2">
          {['all', 'pending', 'active', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => onSelectConversation(conversation)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversationId === conversation._id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Circle className={`w-3 h-3 ${statusColors[conversation.status]} rounded-full`} />
                  <h3 className="font-semibold text-gray-900">
                    {conversation.visitor?.name || 'Anonymous'}
                  </h3>
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(conversation.lastMessageAt), 'HH:mm')}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-1">
                {conversation.visitor?.email || 'No email'}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${
                  conversation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  conversation.status === 'active' ? 'bg-green-100 text-green-800' :
                  conversation.status === 'resolved' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {conversation.status}
                </span>
                
                {conversation.assignedAgent && (
                  <span className="text-xs text-gray-500">
                    {conversation.assignedAgent.name}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
