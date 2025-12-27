import React from 'react';
import { Send, Smile, Paperclip, Hash, Phone, Video, MoreVertical } from 'lucide-react';
import type { Conversation, Message } from '../../types';
import { Avatar } from '../shared/Avatar';
import { Button } from '../shared/Button';
import { IconButton } from '../shared/IconButton';

interface ChatWindowProps {
  conversation: Conversation;
  onSendMessage: (content: string) => void;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAgent = message.senderType === 'agent';

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex gap-2 animate-fadeInUp ${isAgent ? 'justify-start' : 'justify-end'}`}>
      {isAgent && <Avatar src={message.senderAvatar} size="sm" />}
      <div className={`max-w-[70%] ${isAgent ? '' : 'order-first'}`}>
        <div
          className={`
            px-4 py-2 rounded-lg
            ${isAgent
              ? 'bg-white border border-lc-gray-200 text-lc-gray-900'
              : 'bg-lc-orange text-white'
            }
          `}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <div className={`flex items-center gap-1 mt-1 text-xs text-lc-gray-500 ${isAgent ? '' : 'justify-end'}`}>
          <span>{formatTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

const TypingIndicator: React.FC<{ name: string }> = () => (
  <div className="flex gap-2 items-center">
    <Avatar size="sm" />
    <div className="bg-white border border-lc-gray-200 px-4 py-3 rounded-lg">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-lc-gray-400 rounded-full animate-typingDot" />
        <span className="w-2 h-2 bg-lc-gray-400 rounded-full animate-typingDot" style={{ animationDelay: '0.2s' }} />
        <span className="w-2 h-2 bg-lc-gray-400 rounded-full animate-typingDot" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  </div>
);

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onSendMessage }) => {
  const [message, setMessage] = React.useState('');
  const [isTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-lc-gray-50">
      {/* Chat Header */}
      <header className="h-16 bg-white border-b border-lc-gray-200 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={conversation.visitor.avatar} status="online" size="md" />
          <div>
            <h2 className="font-semibold text-lc-gray-900">{conversation.visitor.name}</h2>
            <p className="text-sm text-lc-gray-500">{conversation.visitor.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IconButton icon={Phone} tooltip="Call" />
          <IconButton icon={Video} tooltip="Video call" />
          <IconButton icon={MoreVertical} tooltip="More options" />
          <Button variant="success" size="sm">
            Resolve
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator name={conversation.visitor.name} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-lc-gray-200 p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full resize-none rounded-lg border border-lc-gray-300 p-3 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-lc-orange focus:border-transparent"
              placeholder="Type a message..."
              rows={1}
              style={{ minHeight: '44px', maxHeight: '200px' }}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <IconButton icon={Smile} size="sm" tooltip="Emoji" />
              <IconButton icon={Paperclip} size="sm" tooltip="Attach file" />
              <IconButton icon={Hash} size="sm" tooltip="Canned responses" />
            </div>
          </div>
          <Button 
            onClick={handleSend}
            className="bg-lc-orange hover:bg-lc-orange-hover text-white px-6 py-3 rounded-lg"
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </main>
  );
};
