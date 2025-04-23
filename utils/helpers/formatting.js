/**
 * Date and string formatting utilities
 */

/**
 * Format a date to a readable string
 * 
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  try {
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Format a date to a time-ago string
 * 
 * @param {Date|string|number} date - Date to format
 * @returns {string} Time-ago string (e.g., "2 days ago")
 */
export const timeAgo = (date) => {
  if (!date) return '';
  
  try {
    const now = new Date();
    const dateObj = new Date(date);
    const seconds = Math.floor((now - dateObj) / 1000);
    
    // Handle future dates
    if (seconds < 0) {
      return 'in the future';
    }
    
    // Define time intervals
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };
    
    // Find the appropriate interval
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      
      if (interval >= 1) {
        return interval === 1 
          ? `1 ${unit} ago` 
          : `${interval} ${unit}s ago`;
      }
    }
    
    return 'just now';
  } catch (error) {
    console.error('Error calculating time ago:', error);
    return '';
  }
};

/**
 * Truncate a string if it exceeds a maximum length
 * 
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 50) => {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  
  return `${str.substring(0, maxLength)}...`;
};

/**
 * Capitalize the first letter of a string
 * 
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format a number with thousand separators
 * 
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined) return '';
  
  try {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  } catch (error) {
    console.error('Error formatting number:', error);
    return '';
  }
};

/**
 * Format file size in a human-readable format
 * 
 * @param {number} bytes - Size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return '';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};