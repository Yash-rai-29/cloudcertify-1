import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`animate-spin rounded-full border-t-transparent border-blue-500 ${sizeClasses[size]}`} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;