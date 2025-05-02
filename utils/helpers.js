import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HTTP_STATUS } from './constants';
import { showError } from './toast';

/**
 * Combine Tailwind CSS class names with clsx and tailwind-merge
 * @param  {...any} inputs - Class names to combine
 * @returns {string} - Combined class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a readable string
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = {}) {
  if (!date) {
    return 'N/A';
  }
  
  let dateObj;
  
  // Check if the date is already a Date object
  if (date instanceof Date) {
    dateObj = date;
  } else {
    // Try to convert the date to a Date object
    dateObj = new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date value:', date);
      return 'Invalid date';
    }
  }
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  try {
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(date);
  }
}

/**
 * Format a date to a time-ago string
 * @param {Date|string|number} date - Date to format
 * @returns {string} - Time-ago string (e.g., "2 days ago")
 */
export function timeAgo(date) {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const seconds = Math.floor((now - dateObj) / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  
  // Less than a day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  
  // Less than a week
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  
  // Less than a month
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  }
  
  // Less than a year
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months === 1 ? '' : 's'} ago`;
  }
  
  // More than a year
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

/**
 * Handle API error responses
 * @param {Error} error - The error object from axios
 * @param {boolean} showToast - Whether to show a toast notification
 * @returns {Object} - An object with success: false and error details
 */
export function handleApiError(error, showToast = true) {
  let errorMessage = 'An unexpected error occurred. Please try again.';
  let errorCode = 'unknown_error';
  let statusCode = HTTP_STATUS.SERVER_ERROR;

  // Handle axios error response
  if (error.response) {
    statusCode = error.response.status;
    
    // Get the error message and code from the response if available
    if (error.response.data) {
      errorMessage = error.response.data.message || error.response.data.detail || errorMessage;
      errorCode = error.response.data.code || errorCode;
    }
    
    // Handle specific status codes
    switch (statusCode) {
      case HTTP_STATUS.UNAUTHORIZED:
        errorMessage = 'Your session has expired. Please log in again.';
        errorCode = 'session_expired';
        break;
      case HTTP_STATUS.FORBIDDEN:
        errorMessage = 'You do not have permission to perform this action.';
        errorCode = 'permission_denied';
        break;
      case HTTP_STATUS.NOT_FOUND:
        errorMessage = 'The requested resource was not found.';
        errorCode = 'not_found';
        break;
      case HTTP_STATUS.RATE_LIMIT:
        errorMessage = 'Too many requests. Please try again later.';
        errorCode = 'rate_limited';
        break;
    }
  } else if (error.request) {
    // The request was made but no response was received
    errorMessage = 'Could not connect to the server. Please check your connection.';
    errorCode = 'network_error';
    statusCode = 0;
  }

  // Show error toast if requested
  if (showToast) {
    showError(errorMessage);
  }

  // Return formatted error response
  return {
    success: false,
    error: {
      message: errorMessage,
      code: errorCode,
      status: statusCode
    }
  };
}

/**
 * Truncate a string if it exceeds a maximum length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated string with ellipsis if needed
 */
export function truncate(str, maxLength = 50) {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

/**
 * Generate a random ID
 * @param {number} length - Length of the ID
 * @returns {string} - Random ID
 */
export function generateId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Sleep for a specified duration
 * @param {number} ms - Duration in milliseconds
 * @returns {Promise} - Promise that resolves after the duration
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}