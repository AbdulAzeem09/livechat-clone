export interface Visitor {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  browser?: string;
  os?: string;
  currentPage?: string;
  localTime?: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  senderType: 'agent' | 'visitor';
  senderName: string;
  senderAvatar?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  visitor: Visitor;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: 'active' | 'resolved' | 'queued';
  messages: Message[];
  tags?: string[];
  notes?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
}

export type ChatFilter = 'all' | 'my' | 'unassigned' | 'queued';
export type AgentStatus = 'online' | 'away' | 'busy' | 'offline';
