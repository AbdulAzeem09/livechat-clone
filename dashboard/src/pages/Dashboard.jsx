import React, { useState } from 'react';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import VisitorInfo from '../components/VisitorInfo';

const Dashboard = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="flex h-screen bg-gray-50">
      <ConversationList
        onSelectConversation={setSelectedConversation}
        selectedConversationId={selectedConversation?._id}
      />
      <ChatWindow conversation={selectedConversation} />
      <VisitorInfo conversation={selectedConversation} />
    </div>
  );
};

export default Dashboard;
