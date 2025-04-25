import apiClient from './apiClient';
import { API } from '../constants';
import { handleApiError } from '../helpers';

/**
 * Get user information for the dashboard
 * @returns {Promise<Object>} API response
 */
export async function getUserInfo() {
  try {
    const response = await apiClient.get(API.USER_INFO);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get user's daily streak information
 * @returns {Promise<Object>} API response
 */
export async function getDailyStreak() {
  try {
    const response = await apiClient.get(API.DAILY_STREAK);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get the daily question
 * @returns {Promise<Object>} API response
 */
export async function getDailyQuestion() {
  try {
    const response = await apiClient.get(API.DAILY_QUESTION);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Submit answer for the daily question
 * @param {string} questionId - The question ID
 * @param {string} answer - The selected answer
 * @returns {Promise<Object>} API response
 */
export async function submitDailyAnswer(questionId, answer) {
  try {
    const response = await apiClient.post(API.SUBMIT_DAILY_ANSWER, {
      question_id: questionId,
      answer
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get test recommendations for the user
 * @param {number} limit - Number of recommendations to return
 * @returns {Promise<Object>} API response
 */
export async function getTestRecommendations(limit = 4) {
  try {
    const response = await apiClient.get(API.TEST_RECOMMENDATIONS, {
      params: { limit }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get user's recent activities
 * @param {number} limit - Number of activities to return
 * @returns {Promise<Object>} API response
 */
export async function getUserActivities(limit = 10) {
  try {
    const response = await apiClient.get(API.USER_ACTIVITIES, {
      params: { limit }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Start a practice test
 * @param {string} testId - The test ID
 * @returns {Promise<Object>} API response
 */
export async function startTest(testId) {
  try {
    const response = await apiClient.post(API.START_TEST, {
      test_id: testId
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get user's test history
 * @param {number} limit - Number of tests to return
 * @param {number} page - Page number for pagination
 * @returns {Promise<Object>} API response
 */
export async function getTestHistory(limit = 10, page = 1) {
  try {
    const response = await apiClient.get(API.TEST_HISTORY, {
      params: { limit, page }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get available certification resources
 * @param {string} category - Resource category filter
 * @returns {Promise<Object>} API response
 */
export async function getCertificationResources(category = null) {
  try {
    const params = category ? { category } : {};
    const response = await apiClient.get(API.CERTIFICATION_RESOURCES, {
      params
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get leaderboard data
 * @param {string} period - Time period (week, month, all)
 * @param {number} limit - Number of entries to return
 * @returns {Promise<Object>} API response
 */
export async function getLeaderboard(period = 'week', limit = 10) {
  try {
    const response = await apiClient.get(API.LEADERBOARD, {
      params: { period, limit }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Send message to AI assistant
 * @param {string} message - User message
 * @param {Array} history - Conversation history
 * @returns {Promise<Object>} API response
 */
export async function sendAiChatMessage(message, history = []) {
  try {
    const response = await apiClient.post(API.AI_CHAT, {
      message,
      history
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}