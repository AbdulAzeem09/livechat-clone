import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, BarChart3, Settings, Users } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: MessageSquare, label: 'Conversations' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/visitors', icon: Users, label: 'Visitors' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold">LiveChat</h2>
      </div>
      
      <nav className="flex-1 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">© 2024 LiveChat Clone</p>
      </div>
    </aside>
  );
};

export default Sidebar;
