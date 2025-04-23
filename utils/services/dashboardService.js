import { apiRequest } from './api';

// User Information API
export const getUserInfo = async () => {
  return await apiRequest('get', '/b/manage_user/users/me');
};

// Daily Streak API
export const getDailyStreak = async () => {
  return await apiRequest('get', '/b/user_activity/daily-streak');
};

// Daily Question API
export const getDailyQuestion = async (date) => {
  return await apiRequest('get', '/b/user_activity/daily-question', null, { date });
};

// User Activities API
export const getUserActivities = async () => {
  return await apiRequest('get', '/b/user_activity/activities');
};

// Test Recommendations API
export const getTestRecommendations = async (limit = 3) => {
  return await apiRequest('get', '/b/recommendation/recommendations', null, { limit });
};

// Format timestamp to readable date
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format timestamp to time ago
export const timeAgo = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  const seconds = Math.floor((Date.now() / 1000) - timestamp);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return '1 year ago';
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  if (interval === 1) return '1 month ago';
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  if (interval === 1) return '1 day ago';
  
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  if (interval === 1) return '1 hour ago';
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  if (interval === 1) return '1 minute ago';
  
  if (seconds < 10) return 'just now';
  
  return `${Math.floor(seconds)} seconds ago`;
};