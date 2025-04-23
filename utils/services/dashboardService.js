import { apiRequest } from "./api";
import { API } from "../constants";

/**
 * Get all the data needed for the user dashboard
 * Centralized function to fetch all data that the dashboard needs
 *
 * @returns {Object} Consolidated dashboard data
 */
export const getDashboardData = async () => {
  try {
    // Fetch data from multiple endpoints in parallel
    const [
      userProfile,
      userStatistics,
      userActivities,
      recommendations,
      dailyQuestion,
      streak,
    ] = await Promise.all([
      apiRequest("get", API.ENDPOINTS.USER_ME),
      apiRequest("get", API.ENDPOINTS.USER_STATISTICS),
      apiRequest("get", API.ENDPOINTS.USER_ACTIVITIES),
      apiRequest("get", API.ENDPOINTS.RECOMMENDATIONS),
      apiRequest("get", API.ENDPOINTS.DAILY_QUESTION),
      apiRequest("get", API.ENDPOINTS.DAILY_STREAK),
    ]);

    // Validate responses and return an error-tolerant result
    return {
      profile: userProfile.success ? userProfile.data : null,
      statistics: userStatistics.success ? userStatistics.data : null,
      activities: userActivities.success ? userActivities.data : [],
      recommendations: recommendations.success ? recommendations.data : [],
      dailyQuestion: dailyQuestion.success ? dailyQuestion.data : null,
      streak: streak.success ? streak.data : null,
      errors: getResponseErrors([
        { name: "profile", response: userProfile },
        { name: "statistics", response: userStatistics },
        { name: "activities", response: userActivities },
        { name: "recommendations", response: recommendations },
        { name: "dailyQuestion", response: dailyQuestion },
        { name: "streak", response: streak },
      ]),
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return {
      errors: [{
        source: "getDashboardData",
        message: "Failed to fetch dashboard data",
        details: error.message,
      }],
    };
  }
};

/**
 * Helper function to extract errors from multiple API responses
 * 
 * @param {Array} responses - Array of {name, response} objects
 * @returns {Array} List of errors
 */
const getResponseErrors = (responses) => {
  return responses
    .filter(({ response }) => !response.success)
    .map(({ name, response }) => ({
      source: name,
      message: response.message,
      status: response.status,
      details: response.error,
    }));
};

/**
 * Get current user profile data
 *
 * @returns {Promise} User profile data
 */
export const getUserProfile = async () => {
  return await apiRequest("get", API.ENDPOINTS.USER_ME);
};

/**
 * Update user profile information
 *
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Updated user profile
 */
export const updateUserProfile = async (profileData) => {
  return await apiRequest("put", API.ENDPOINTS.USERS, profileData);
};

/**
 * Get user's test history
 *
 * @param {number} limit - Number of items to return
 * @returns {Promise} User test history
 */
export const getTestHistory = async (limit = 10) => {
  return await apiRequest("get", API.ENDPOINTS.TEST_HISTORY, null, { limit });
};

/**
 * Get test library data with optional filtering
 *
 * @param {Object} filters - Test filters
 * @param {number} limit - Number of items per page
 * @returns {Promise} Test library data
 */
export const getTestLibrary = async (filters = {}, limit = 10) => {
  const { category, cloud_provider, difficulty, search, sort_by, sort_order } =
    filters;
  return await apiRequest("get", API.ENDPOINTS.TESTS, null, {
    category,
    cloud_provider,
    difficulty,
    search,
    sort_by,
    sort_order,
    limit,
  });
};

/**
 * Get leaderboard data
 *
 * @param {number} limit - Number of users to return
 * @returns {Promise} Leaderboard data
 */
export const getLeaderboard = async (limit = 10) => {
  return await apiRequest("get", API.ENDPOINTS.LEADERBOARD, null, { limit });
};

/**
 * Get list of learning resources
 *
 * @returns {Promise} Resources data
 */
export const getResources = async () => {
  return await apiRequest("get", API.ENDPOINTS.RESOURCES);
};

/**
 * Submit an answer for the daily question
 *
 * @param {string} questionId - Question ID
 * @param {string} optionId - Selected option ID
 * @returns {Promise} Submission result with streak information
 */
export const submitDailyAnswer = async (questionId, optionId) => {
  return await apiRequest("post", API.ENDPOINTS.SUBMIT_DAILY_QUESTION, {
    question_id: questionId,
    option_id: optionId,
  });
};

/**
 * Send a message to the AI assistant
 *
 * @param {string} message - User message
 * @param {Array} history - Chat history
 * @returns {Promise} AI response
 */
export const sendChatMessage = async (message, history = []) => {
  return await apiRequest("post", API.ENDPOINTS.CHAT, { message, history });
};
