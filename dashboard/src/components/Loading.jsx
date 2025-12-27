import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      <p className="mt-4 text-gray-600">{text}</p>
    </div>
  );
};

export default Loading;
