import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Settings, User, Circle } from 'lucide-react';

const Header = () => {
  const { user, logout, updateStatus } = useAuth();

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  const handleStatusChange = (status) => {
    updateStatus(status);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LiveChat Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your customer conversations</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100">
              <Circle className={`w-3 h-3 ${statusColors[user?.status || 'offline']} rounded-full`} />
              <span className="text-sm font-medium text-gray-700">{user?.status || 'offline'}</span>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-10">
              {['online', 'away', 'busy', 'offline'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-50"
                >
                  <Circle className={`w-3 h-3 ${statusColors[status]} rounded-full`} />
                  <span className="text-sm text-gray-700 capitalize">{status}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
