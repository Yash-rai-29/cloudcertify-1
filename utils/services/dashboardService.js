import { apiRequest } from "./api";
import { API } from "../constants";
import { 
  extractResponseErrors, 
  createErrorResponse,
  asyncTryCatch
} from "../helpers/errorHandling";

/**
 * Get all the data needed for the user dashboard
 * Centralized function to fetch all data that the dashboard needs
 *
 * @returns {Object} Consolidated dashboard data
 */
export const getDashboardData = asyncTryCatch(async () => {
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
    success: true,
    data: {
      profile: userProfile.success ? userProfile.data : null,
      statistics: userStatistics.success ? userStatistics.data : null,
      activities: userActivities.success ? userActivities.data : [],
      recommendations: recommendations.success ? recommendations.data : [],
      dailyQuestion: dailyQuestion.success ? dailyQuestion.data : null,
      streak: streak.success ? streak.data : null,
    },
    errors: extractResponseErrors([
      { name: "profile", response: userProfile },
      { name: "statistics", response: userStatistics },
      { name: "activities", response: userActivities },
      { name: "recommendations", response: recommendations },
      { name: "dailyQuestion", response: dailyQuestion },
      { name: "streak", response: streak },
    ])
  };
}, "getDashboardData");

// Dashboard-specific individual service functions

/**
 * Get user information for dashboard
 *
 * @returns {Promise} User information
 */
export const getUserInfo = asyncTryCatch(async () => {
  return await apiRequest("get", API.ENDPOINTS.USER_ME);
}, "getUserInfo");

/**
 * Get user daily streak data
 *
 * @returns {Promise} User streak data
 */
export const getDailyStreak = asyncTryCatch(async () => {
  return await apiRequest("get", API.ENDPOINTS.DAILY_STREAK);
}, "getDailyStreak");

/**
 * Get daily question
 *
 * @returns {Promise} Daily question data
 */
export const getDailyQuestion = asyncTryCatch(async () => {
  return await apiRequest("get", API.ENDPOINTS.DAILY_QUESTION);
}, "getDailyQuestion");

/**
 * Get test recommendations
 *
 * @returns {Promise} Test recommendations
 */
export const getTestRecommendations = asyncTryCatch(async () => {
  return await apiRequest("get", API.ENDPOINTS.RECOMMENDATIONS);
}, "getTestRecommendations");

/**
 * Get user activities
 *
 * @param {number} limit - Number of activities to return
 * @returns {Promise} User activities
 */
export const getUserActivities = asyncTryCatch(async (limit = 10) => {
  return await apiRequest("get", API.ENDPOINTS.USER_ACTIVITIES, null, { limit });
}, "getUserActivities");

/**
 * Get current user profile data
 *
 * @returns {Promise} User profile data
 */
export const getUserProfile = asyncTryCatch(async () => {
  return await apiRequest("get", API.ENDPOINTS.USER_ME);
}, "getUserProfile");

/**
 * Update user profile information
 *
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Updated user profile
 */
export const updateUserProfile = asyncTryCatch(async (profileData) => {
  if (!profileData) {
    return createErrorResponse(
      { message: "Profile data is required" },
      "updateUserProfile",
      400
    );
  }
  
  return await apiRequest("put", API.ENDPOINTS.USERS, profileData);
}, "updateUserProfile");

/**
 * Get user's test history
 *
 * @param {number} limit - Number of items to return
 * @returns {Promise} User test history
 */
export const getTestHistory = asyncTryCatch(async (limit = 10) => {
  return await apiRequest("get", API.ENDPOINTS.TEST_HISTORY, null, { limit });
}, "getTestHistory");

/**
 * Get test library data with optional filtering
 *
 * @param {Object} filters - Test filters
 * @param {number} limit - Number of items per page
 * @returns {Promise} Test library data
 */
export const getTestLibrary = asyncTryCatch(async (filters = {}, limit = 10) => {
  const { 
    category, 
    cloud_provider, 
    difficulty, 
    search, 
    sort_by, 
    sort_order 
  } = filters;
  
  return await apiRequest("get", API.ENDPOINTS.TESTS, null, {
    category,
    cloud_provider,
    difficulty,
    search,
    sort_by,
    sort_order,
    limit,
  });
}, "getTestLibrary");

/**
 * Get leaderboard data
 *
 * @param {number} limit - Number of users to return
 * @returns {Promise} Leaderboard data
 */
export const getLeaderboard = asyncTryCatch(async (limit = 10) => {
  return await apiRequest("get", API.ENDPOINTS.LEADERBOARD, null, { limit });
}, "getLeaderboard");

/**
 * Get list of learning resources
 *
 * @returns {Promise} Resources data
 */
export const getResources = asyncTryCatch(async () => {
  return await apiRequest("get", API.ENDPOINTS.RESOURCES);
}, "getResources");

/**
 * Submit an answer for the daily question
 *
 * @param {string} questionId - Question ID
 * @param {string} optionId - Selected option ID
 * @returns {Promise} Submission result with streak information
 */
export const submitDailyAnswer = asyncTryCatch(async (questionId, optionId) => {
  if (!questionId || !optionId) {
    return createErrorResponse(
      { message: "Question ID and option ID are required" },
      "submitDailyAnswer",
      400
    );
  }
  
  return await apiRequest("post", API.ENDPOINTS.SUBMIT_DAILY_QUESTION, {
    question_id: questionId,
    option_id: optionId,
  });
}, "submitDailyAnswer");

/**
 * Send a message to the AI assistant
 *
 * @param {string} message - User message
 * @param {Array} history - Chat history
 * @returns {Promise} AI response
 */
export const sendChatMessage = asyncTryCatch(async (message, history = []) => {
  if (!message || message.trim() === '') {
    return createErrorResponse(
      { message: "Message is required" },
      "sendChatMessage",
      400
    );
  }
  
  return await apiRequest("post", API.ENDPOINTS.CHAT, { message, history });
}, "sendChatMessage");
