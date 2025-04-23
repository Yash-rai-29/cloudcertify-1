import { apiRequest } from './api';

/**
 * Get user information
 * Endpoint: /b/manage_user/users/me
 */
export const getUserInfo = async () => {
  return await apiRequest('get', '/b/manage_user/users/me');
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
 * @param {number} limit - Maximum number of activities to return
 */
export const getUserActivities = async (limit = 20) => {
  return await apiRequest('get', '/b/user_activity/activities', null, { limit });
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
 * Get test history
 * Endpoint: /b/exam/test-history
 * @param {number} page - Page number for pagination
 * @param {number} pageSize - Number of items per page
 */
export const getTestHistory = async (page = 1, pageSize = 10) => {
  return await apiRequest('get', '/b/exam/test-history', null, { page, pageSize });
};

/**
 * Get test library
 * Endpoint: /b/exam/tests
 * @param {number} page - Page number for pagination
 * @param {number} pageSize - Number of items per page
 * @param {string} category - Filter by test category
 * @param {string} difficulty - Filter by difficulty level
 */
export const getTestLibrary = async (page = 1, pageSize = 12, category = null, difficulty = null) => {
  const params = { page, pageSize };
  if (category) params.category = category;
  if (difficulty) params.difficulty = difficulty;
  
  return await apiRequest('get', '/b/exam/tests', null, params);
};

/**
 * Get test details
 * Endpoint: /b/exam/tests/{testId}
 * @param {string} testId - ID of the test to retrieve
 */
export const getTestDetails = async (testId) => {
  return await apiRequest('get', `/b/exam/tests/${testId}`);
};

/**
 * Start a test
 * Endpoint: /b/exam/tests/{testId}/start
 * @param {string} testId - ID of the test to start
 */
export const startTest = async (testId) => {
  return await apiRequest('post', `/b/exam/tests/${testId}/start`);
};

/**
 * Submit a test
 * Endpoint: /b/exam/tests/{testId}/submit
 * @param {string} testId - ID of the test to submit
 * @param {Array} answers - Array of answer objects with questionId and selectedOption
 */
export const submitTest = async (testId, answers) => {
  return await apiRequest('post', `/b/exam/tests/${testId}/submit`, { answers });
};

/**
 * Get test result
 * Endpoint: /b/exam/tests/{testId}/result
 * @param {string} testId - ID of the test to get results for
 */
export const getTestResult = async (testId) => {
  return await apiRequest('get', `/b/exam/tests/${testId}/result`);
};

/**
 * Get user leaderboard
 * Endpoint: /b/leaderboard/rankings
 * @param {string} timeFrame - Time frame for the leaderboard (weekly, monthly, allTime)
 * @param {number} limit - Maximum number of entries to return
 */
export const getLeaderboard = async (timeFrame = 'weekly', limit = 10) => {
  return await apiRequest('get', '/b/leaderboard/rankings', null, { timeFrame, limit });
};

/**
 * Get user ranking
 * Endpoint: /b/leaderboard/my-ranking
 */
export const getUserRanking = async () => {
  return await apiRequest('get', '/b/leaderboard/my-ranking');
};

/**
 * Get learning resources
 * Endpoint: /b/resources/learning-materials
 * @param {string} category - Filter by resource category
 * @param {number} limit - Maximum number of resources to return
 */
export const getLearningResources = async (category = null, limit = 20) => {
  const params = { limit };
  if (category) params.category = category;
  
  return await apiRequest('get', '/b/resources/learning-materials', null, params);
};

/**
 * Send message to AI chatbot
 * Endpoint: /b/ai/chat
 * @param {string} message - User message
 * @param {Array} history - Previous conversation history
 */
export const sendChatMessage = async (message, history = []) => {
  return await apiRequest('post', '/b/ai/chat', { 
    message, 
    history 
  });
};

/**
 * Format timestamp to readable date
 * @param {number} timestamp - Unix timestamp in seconds
 */
export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format timestamp to time ago
 * @param {number} timestamp - Unix timestamp in seconds
 */
export const timeAgo = (timestamp) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  
  return formatDate(timestamp);
};