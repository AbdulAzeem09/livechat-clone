import React from 'react';
import { MessageSquare, Users, Archive, BarChart2, Settings, Bell, ChevronDown } from 'lucide-react';
import { Avatar } from '../shared/Avatar';
import type { Agent } from '../../types';

interface TopNavProps {
  agent: Agent;
  onStatusChange: (status: Agent['status']) => void;
}

interface NavItemProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
      transition-all duration-200
      ${active 
        ? 'bg-lc-orange-light text-lc-orange' 
        : 'text-lc-gray-700 hover:bg-lc-gray-100'
      }
    `}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="ml-1 px-2 py-0.5 bg-lc-orange text-white text-xs rounded-full">
        {badge}
      </span>
    )}
  </button>
);

export const TopNav: React.FC<TopNavProps> = ({ agent, onStatusChange }) => {
  const [showStatusMenu, setShowStatusMenu] = React.useState(false);
  
  const statuses: Array<{ value: Agent['status']; label: string; color: string }> = [
    { value: 'online', label: 'Online', color: 'bg-lc-green' },
    { value: 'away', label: 'Away', color: 'bg-lc-yellow' },
    { value: 'busy', label: 'Busy', color: 'bg-lc-red' },
    { value: 'offline', label: 'Offline', color: 'bg-lc-gray-400' },
  ];

  return (
    <header className="h-14 bg-white border-b border-lc-gray-200 flex items-center px-4 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-lc-orange rounded-lg flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl text-lc-gray-900">LiveChat</span>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-1 ml-8">
        <NavItem icon={MessageSquare} label="Chats" active badge={5} />
        <NavItem icon={Users} label="Traffic" />
        <NavItem icon={Archive} label="Archives" />
        <NavItem icon={BarChart2} label="Reports" />
        <NavItem icon={Settings} label="Settings" />
      </nav>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-4">
        {/* Status Selector */}
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="flex items-center gap-2 px-3 py-2 hover:bg-lc-gray-100 rounded-lg transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${statuses.find(s => s.value === agent.status)?.color}`} />
            <span className="text-sm font-medium text-lc-gray-900">
              {statuses.find(s => s.value === agent.status)?.label}
            </span>
            <ChevronDown className="w-4 h-4 text-lc-gray-600" />
          </button>
          
          {showStatusMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-lc-gray-200 py-2 z-50">
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => {
                    onStatusChange(status.value);
                    setShowStatusMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-lc-gray-100 transition-colors"
                >
                  <span className={`w-2 h-2 rounded-full ${status.color}`} />
                  <span className="text-sm text-lc-gray-900">{status.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 hover:bg-lc-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-lc-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-lc-red rounded-full" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <Avatar src={agent.avatar} size="sm" status={agent.status} />
          <span className="text-sm font-medium text-lc-gray-900">{agent.name}</span>
          <ChevronDown className="w-4 h-4 text-lc-gray-600" />
        </div>
      </div>
    </header>
  );
};
