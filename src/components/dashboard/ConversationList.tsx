import React from 'react';
import { Search } from 'lucide-react';
import type { Conversation, ChatFilter } from '../../types';
import { Avatar } from '../shared/Avatar';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  filter: ChatFilter;
  onFilterChange: (filter: ChatFilter) => void;
}

interface ConversationItemProps {
  conversation: Conversation;
  selected: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, selected, onClick }) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const statusIcon = {
    active: '🟢',
    resolved: '✅',
    queued: '⏳',
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full p-3 flex gap-3 hover:bg-lc-gray-50 transition-colors border-l-4
        ${selected ? 'bg-lc-orange-light border-lc-orange' : 'border-transparent'}
      `}
    >
      <Avatar src={conversation.visitor.avatar} size="md" />
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-sm text-lc-gray-900 truncate">
            {conversation.visitor.name}
          </h3>
          <span className="text-xs text-lc-gray-500 ml-2">
            {formatTime(conversation.lastMessageTime)}
          </span>
        </div>
        <p className="text-sm text-lc-gray-600 truncate mb-1">
          {conversation.lastMessage}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs">{statusIcon[conversation.status]}</span>
          {conversation.unreadCount > 0 && (
            <span className="px-1.5 py-0.5 bg-lc-orange text-white text-xs rounded-full">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
  filter,
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filters: Array<{ value: ChatFilter; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'my', label: 'My chats' },
    { value: 'unassigned', label: 'Unassigned' },
    { value: 'queued', label: 'Queued' },
  ];

  const getFilterCount = (filterValue: ChatFilter) => {
    switch (filterValue) {
      case 'all':
        return conversations.length;
      case 'my':
        return conversations.filter(c => c.status === 'active').length;
      case 'unassigned':
        return conversations.filter(c => c.status === 'queued').length;
      case 'queued':
        return conversations.filter(c => c.status === 'queued').length;
      default:
        return 0;
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.visitor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-[280px] h-full bg-white border-r border-lc-gray-200 flex flex-col">
      {/* Search */}
      <div className="p-3 border-b border-lc-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lc-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-lc-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lc-orange"
            placeholder="Search chats..."
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-lc-gray-200 px-2 gap-1 overflow-x-auto">
        {filters.map((f) => {
          const count = getFilterCount(f.value);
          return (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`
                flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap
                border-b-2 transition-colors
                ${filter === f.value
                  ? 'border-lc-orange text-lc-orange'
                  : 'border-transparent text-lc-gray-600 hover:text-lc-gray-900'
                }
              `}
            >
              <span>{f.label}</span>
              {count > 0 && (
                <span className={`
                  px-1.5 py-0.5 rounded-full text-xs
                  ${filter === f.value
                    ? 'bg-lc-orange text-white'
                    : 'bg-lc-gray-200 text-lc-gray-700'
                  }
                `}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            selected={selectedId === conv.id}
            onClick={() => onSelect(conv.id)}
          />
        ))}
      </div>
    </aside>
  );
};
