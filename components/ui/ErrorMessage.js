import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ 
  title = 'Error', 
  message = 'An unexpected error occurred. Please try again later.',
  retry = null
}) => {
  return (
    <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex flex-col items-center text-center">
      <FiAlertCircle className="text-red-500 text-2xl mb-2" />
      <h3 className="text-red-800 font-medium mb-1">{title}</h3>
      <p className="text-red-700 text-sm mb-3">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-md font-medium transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;