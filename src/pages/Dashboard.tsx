import React from 'react';
import { TopNav } from '../components/dashboard/TopNav';
import { ConversationList } from '../components/dashboard/ConversationList';
import { ChatWindow } from '../components/dashboard/ChatWindow';
import { VisitorDetails } from '../components/dashboard/VisitorDetails';
import { mockAgent, mockConversations } from '../utils/mockData';
import type { Agent, Conversation, ChatFilter, Message } from '../types';

export const Dashboard: React.FC = () => {
  const [agent, setAgent] = React.useState<Agent>(mockAgent);
  const [conversations, setConversations] = React.useState<Conversation[]>(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = React.useState<string>(conversations[0].id);
  const [filter, setFilter] = React.useState<ChatFilter>('all');

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const handleStatusChange = (status: Agent['status']) => {
    setAgent({ ...agent, status });
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      senderType: 'agent',
      senderName: agent.name,
      senderAvatar: agent.avatar,
      status: 'sent',
    };

    setConversations(conversations.map(conv => {
      if (conv.id === selectedConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: content,
          lastMessageTime: new Date(),
        };
      }
      return conv;
    }));
  };

  const handleUpdateNotes = (notes: string) => {
    setConversations(conversations.map(conv => {
      if (conv.id === selectedConversationId) {
        return { ...conv, notes };
      }
      return conv;
    }));
  };

  const handleAddTag = (tag: string) => {
    setConversations(conversations.map(conv => {
      if (conv.id === selectedConversationId) {
        return {
          ...conv,
          tags: [...(conv.tags || []), tag],
        };
      }
      return conv;
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-lc-gray-50">
      <TopNav agent={agent} onStatusChange={handleStatusChange} />
      <div className="flex-1 flex overflow-hidden">
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
          filter={filter}
          onFilterChange={setFilter}
        />
        {selectedConversation && (
          <>
            <ChatWindow
              conversation={selectedConversation}
              onSendMessage={handleSendMessage}
            />
            <VisitorDetails
              conversation={selectedConversation}
              onUpdateNotes={handleUpdateNotes}
              onAddTag={handleAddTag}
            />
          </>
        )}
      </div>
    </div>
  );
};
