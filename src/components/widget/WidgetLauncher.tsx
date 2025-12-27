import React from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ChatWidget } from './ChatWidget';

interface WidgetLauncherProps {
  unreadCount?: number;
}

export const WidgetLauncher: React.FC<WidgetLauncherProps> = ({ unreadCount = 0 }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {/* Chat Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          fixed bottom-6 right-6
          w-[60px] h-[60px]
          bg-lc-orange hover:bg-lc-orange-hover
          rounded-full shadow-lg
          flex items-center justify-center
          transition-all duration-200
          hover:scale-105
          z-[9999]
        "
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-lc-red text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat Widget */}
      {isOpen && <ChatWidget onClose={() => setIsOpen(false)} />}
    </>
  );
};
