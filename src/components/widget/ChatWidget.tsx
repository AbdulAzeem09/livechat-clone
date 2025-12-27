import React from 'react';
import { X, Send } from 'lucide-react';
import { Avatar } from '../shared/Avatar';
import type { Message } from '../../types';
import { mockAgent, mockMessages } from '../../utils/mockData';

interface ChatWidgetProps {
  onClose: () => void;
}

interface WidgetMessageBubbleProps {
  message: Message;
}

const WidgetMessageBubble: React.FC<WidgetMessageBubbleProps> = ({ message }) => {
  const isAgent = message.senderType === 'agent';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex gap-2 mb-4 animate-fadeInUp ${isAgent ? '' : 'flex-row-reverse'}`}>
      {isAgent && <Avatar src={message.senderAvatar} size="sm" />}
      <div className={`max-w-[70%]`}>
        <div
          className={`
            px-4 py-2 rounded-2xl
            ${isAgent
              ? 'bg-white text-lc-gray-900 shadow-sm'
              : 'bg-lc-orange text-white'
            }
          `}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <p className={`text-xs text-lc-gray-500 mt-1 ${isAgent ? '' : 'text-right'}`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onClose }) => {
  const [messages, setMessages] = React.useState<Message[]>(mockMessages);
  const [inputMessage, setInputMessage] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: inputMessage,
        timestamp: new Date(),
        senderType: 'visitor',
        senderName: 'You',
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');

      // Simulate agent response
      setTimeout(() => {
        const agentResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Thanks for your message! Our agent will respond shortly.',
          timestamp: new Date(),
          senderType: 'agent',
          senderName: mockAgent.name,
          senderAvatar: mockAgent.avatar,
        };
        setMessages(prev => [...prev, agentResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="
      fixed bottom-24 right-6
      w-[380px] h-[600px]
      bg-white rounded-2xl shadow-2xl
      flex flex-col overflow-hidden
      animate-slideUp
      z-[9999]
    ">
      {/* Header with gradient */}
      <header className="
        bg-gradient-to-r from-lc-orange to-[#FF7A00]
        text-white p-4
      ">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar src={mockAgent.avatar} size="md" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-lc-green rounded-full border-2 border-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{mockAgent.name}</h3>
            <p className="text-sm text-white/80">We typically reply in under 2 minutes</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-lc-gray-50">
        {messages.map(msg => (
          <WidgetMessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-lc-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-3 bg-lc-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-lc-orange"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim()}
            className="w-10 h-10 bg-lc-orange hover:bg-lc-orange-hover disabled:opacity-50 rounded-full flex items-center justify-center transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Powered by */}
      <div className="py-2 text-center text-xs text-lc-gray-400 bg-white">
        Powered by <span className="font-semibold text-lc-gray-600">LiveChat</span>
      </div>
    </div>
  );
};
