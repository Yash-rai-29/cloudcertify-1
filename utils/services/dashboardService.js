import { apiRequest } from './api';

/**
 * Get user dashboard data
 * 
 * @returns {Promise} User dashboard data
 */
export const getDashboardData = async () => {
  return await apiRequest('get', '/b/dashboard');
};

/**
 * Get user profile data
 * 
 * @param {string} userId - User ID
 * @returns {Promise} User profile data
 */
export const getUserProfile = async (userId) => {
  return await apiRequest('get', `/b/users/${userId}/profile`);
};

/**
 * Update user profile
 * 
 * @param {string} userId - User ID
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Updated user profile
 */
export const updateUserProfile = async (userId, profileData) => {
  return await apiRequest('put', `/b/manage_user/users`, profileData);
};

/**
 * Get user test history
 * 
 * @param {string} userId - User ID
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of items per page
 * @returns {Promise} User test history
 */
export const getTestHistory = async (userId, page = 1, limit = 10) => {
  return await apiRequest('get', `/b/users/${userId}/test-history`, null, { page, limit });
};

/**
 * Get test library data
 * 
 * @param {Object} filters - Test filters
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of items per page
 * @returns {Promise} Test library data
 */
export const getTestLibrary = async (filters = {}, page = 1, limit = 10) => {
  return await apiRequest('get', '/b/tests', null, { ...filters, page, limit });
};

/**
 * Get leaderboard data
 * 
 * @param {string} timeframe - Timeframe for leaderboard (week, month, all-time)
 * @param {number} limit - Number of users to return
 * @returns {Promise} Leaderboard data
 */
export const getLeaderboard = async (timeframe = 'week', limit = 10) => {
  return await apiRequest('get', '/b/leaderboard', null, { timeframe, limit });
};

/**
 * Get resources list
 * 
 * @param {Object} filters - Resource filters
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of items per page
 * @returns {Promise} Resources data
 */
export const getResources = async (filters = {}, page = 1, limit = 10) => {
  return await apiRequest('get', '/b/resources', null, { ...filters, page, limit });
};

/**
 * Submit answer for daily question
 * 
 * @param {string} questionId - Question ID
 * @param {string} optionId - Selected option ID
 * @returns {Promise} Submission result
 */
export const submitDailyAnswer = async (questionId, optionId) => {
  return await apiRequest('post', `/b/questions/${questionId}/answer`, { option_id: optionId });
};

/**
 * Send chat message to AI assistant
 * 
 * @param {string} message - User message
 * @param {Array} history - Chat history
 * @returns {Promise} AI response
 */
export const sendChatMessage = async (message, history = []) => {
  return await apiRequest('post', '/b/chat', { message, history });
};