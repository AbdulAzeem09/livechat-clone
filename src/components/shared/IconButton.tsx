import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  tooltip?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  onClick,
  tooltip,
  size = 'md',
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        text-lc-gray-600 hover:text-lc-gray-900
        hover:bg-lc-gray-100
        rounded-lg
        transition-all duration-200
        ${className}
      `}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};
