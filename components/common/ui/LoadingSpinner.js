import React from 'react';

/**
 * Loading spinner component with customizable size and text
 * 
 * @param {Object} props - Component props
 * @param {string} props.size - Size of spinner (small, medium, large)
 * @param {string|null} props.text - Optional text to display with the spinner
 * @param {string} props.className - Additional CSS classes
 */
const LoadingSpinner = ({ size = 'medium', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-3',
  };

  const spinnerSizeClass = sizeClasses[size] || sizeClasses.medium;
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full ${spinnerSizeClass} border-t-blue-600 border-blue-200`} />
      {text && <p className="mt-2 text-gray-600 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;