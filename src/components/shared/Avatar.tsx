import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'away' | 'busy' | 'offline';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const statusColors = {
  online: 'bg-lc-green',
  away: 'bg-lc-yellow',
  busy: 'bg-lc-red',
  offline: 'bg-lc-gray-400',
};

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md',
  status,
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      <img
        src={src || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
      {status && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-white`}
        />
      )}
    </div>
  );
};
