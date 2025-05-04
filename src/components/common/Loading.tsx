import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-violet-200 opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-violet-600 animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;