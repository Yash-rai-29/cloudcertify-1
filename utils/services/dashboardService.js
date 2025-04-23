import { apiRequest } from './api';

/**
 * Get user information
 * Endpoint: /b/manage_user/users/me
 */
export const getUserInfo = async () => {
  return await apiRequest('get', '/b/manage_user/users/me');
};

/**
 * Get daily streak information
 * Endpoint: /b/user_activity/daily-streak
 */
export const getDailyStreak = async () => {
  return await apiRequest('get', '/b/user_activity/daily-streak');
};

/**
 * Get daily question
 * Endpoint: /b/user_activity/daily-question
 */
export const getDailyQuestion = async () => {
  return await apiRequest('get', '/b/user_activity/daily-question');
};

/**
 * Submit answer to daily question
 * Endpoint: /b/user_activity/daily-question/submit
 * @param {string} questionId - The ID of the question
 * @param {string} selectedOption - The selected answer option
 */
export const submitDailyAnswer = async (questionId, selectedOption) => {
  return await apiRequest('post', '/b/user_activity/daily-question/submit', {
    questionId,
    selectedOption
  });
};

/**
 * Get user activities
 * Endpoint: /b/user_activity/activities
 */
export const getUserActivities = async () => {
  return await apiRequest('get', '/b/user_activity/activities');
};

/**
 * Get test recommendations
 * Endpoint: /b/recommendation/recommendations
 * @param {number} limit - Maximum number of recommendations to return
 */
export const getTestRecommendations = async (limit = 4) => {
  return await apiRequest('get', '/b/recommendation/recommendations', null, { limit });
};

/**
 * Update user profile
 * Endpoint: /b/manage_user/users
 * @param {object} userData - User data to update (only include fields to be updated)
 */
export const updateUserProfile = async (userData) => {
  return await apiRequest('put', '/b/manage_user/users', userData);
};

/**
 * Format timestamp to readable date
 * @param {number} timestamp - Unix timestamp in seconds
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format timestamp to time ago
 * @param {number} timestamp - Unix timestamp in seconds
 */
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