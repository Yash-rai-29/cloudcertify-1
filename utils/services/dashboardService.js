import { apiRequest } from './api';

/**
 * Get user dashboard data
 * 
 * @returns {Promise} User dashboard data
 */
export const getDashboardData = async () => {
  // Combine data from multiple endpoints
  const [userProfile, userStatistics, userActivities, recommendations, dailyQuestion, streak] = await Promise.all([
    apiRequest('get', '/b/manage_user/users/me'),
    apiRequest('get', '/b/user_statistics/user-statistics'),
    apiRequest('get', '/b/user_activity/activities'),
    apiRequest('get', '/b/recommendation/recommendations'),
    apiRequest('get', '/b/user_activity/daily-question'),
    apiRequest('get', '/b/user_activity/daily-streak')
  ]);
  
  return {
    profile: userProfile,
    statistics: userStatistics,
    activities: userActivities,
    recommendations: recommendations,
    dailyQuestion: dailyQuestion,
    streak: streak
  };
};

/**
 * Get user profile data
 * 
 * @returns {Promise} User profile data
 */
export const getUserProfile = async () => {
  return await apiRequest('get', '/b/manage_user/users/me');
};

/**
 * Update user profile
 * 
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Updated user profile
 */
export const updateUserProfile = async (profileData) => {
  return await apiRequest('put', '/b/manage_user/users', profileData);
};

/**
 * Get user test history
 * 
 * @param {number} limit - Number of items per page
 * @returns {Promise} User test history
 */
export const getTestHistory = async (limit = 10) => {
  return await apiRequest('get', '/b/test_library/users/history', null, { limit });
};

/**
 * Get test library data
 * 
 * @param {Object} filters - Test filters
 * @param {number} limit - Number of items per page
 * @returns {Promise} Test library data
 */
export const getTestLibrary = async (filters = {}, limit = 10) => {
  const { category, cloud_provider, difficulty, search, sort_by, sort_order } = filters;
  return await apiRequest('get', '/b/test_library/tests', null, { 
    category, 
    cloud_provider, 
    difficulty, 
    search, 
    sort_by, 
    sort_order,
    limit 
  });
};

/**
 * Get leaderboard data
 * 
 * @param {number} limit - Number of users to return
 * @returns {Promise} Leaderboard data
 */
export const getLeaderboard = async (limit = 10) => {
  return await apiRequest('get', '/b/leaderboard/leaderboard', null, { limit });
};

/**
 * Get resources list
 * 
 * @returns {Promise} Resources data
 */
export const getResources = async () => {
  return await apiRequest('get', '/b/resources/resources');
};

/**
 * Submit answer for daily question
 * 
 * @param {string} questionId - Question ID
 * @param {string} optionId - Selected option ID
 * @returns {Promise} Submission result
 */
export const submitDailyAnswer = async (questionId, optionId) => {
  return await apiRequest('post', '/b/user_activity/daily-question/submit', { 
    question_id: questionId, 
    option_id: optionId 
  });
};

/**
 * Send chat message to AI assistant
 * 
 * @param {string} message - User message
 * @param {Array} history - Chat history
 * @returns {Promise} AI response
 */
export const sendChatMessage = async (message, history = []) => {
  return await apiRequest('post', '/b/chat_ai/chat', { message, history });
};