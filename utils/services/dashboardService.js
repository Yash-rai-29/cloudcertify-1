import apiClient from './apiClient';
import { API } from '../constants';
import { handleApiError } from '../helpers';
import { useLoading } from '../../contexts/LoadingContext';

/**
 * Get the loading controller if available in the current context
 * This function is used in non-React contexts where hooks can't be used directly
 */
let _loadingController = null;
export const setDashboardLoadingController = (controller) => {
  _loadingController = controller;
};

export const getLoadingController = () => {
  try {
    // Try using the hook first (if in a React component)
    return useLoading();
  } catch (e) {
    // Fall back to cached controller if available
    return _loadingController || {
      startLoading: () => {},
      stopLoading: () => {}
    };
  }
};

/**
 * Get user information for the dashboard
 * @returns {Promise<Object>} API response
 */
export async function getUserInfo() {
  const loadingController = getLoadingController();
  
  try {
    loadingController.startLoading();
    
    const response = await apiClient.get(API.USER_INFO);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  } finally {
    loadingController.stopLoading(300);
  }
}

/**
 * Get user's daily streak information
 * @returns {Promise<Object>} API response
 */
export async function getDailyStreak() {
  const loadingController = getLoadingController();
  
  try {
    loadingController.startLoading();
    
    const response = await apiClient.get(API.DAILY_STREAK);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  } finally {
    loadingController.stopLoading(300);
  }
}

/**
 * Get the daily question
 * @returns {Promise<Object>} API response
 */
export async function getDailyQuestion() {
  const loadingController = getLoadingController();
  
  try {
    loadingController.startLoading();
    
    const response = await apiClient.get(API.DAILY_QUESTION);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  } finally {
    loadingController.stopLoading(300);
  }
}

/**
 * Submit answer for the daily question
 * @param {string} questionId - The question ID
 * @param {string} answer - The selected answer
 * @returns {Promise<Object>} API response
 */
export async function submitDailyAnswer(questionId, answer) {
  const loadingController = getLoadingController();
  
  try {
    loadingController.startLoading();
    
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
  } finally {
    loadingController.stopLoading(300);
  }
}

/**
 * Get test recommendations for the user
 * @param {number} limit - Number of recommendations to return
 * @param {string} recommendation_type - Type of recommendations to fetch: "popular", "new", "in-progress", or "personalized"
 * @returns {Promise<Object>} API response
 */
export async function getTestRecommendations(limit = 4, recommendation_type = "personalized") {
  const loadingController = getLoadingController();
  
  try {
    loadingController.startLoading();
    
    const response = await apiClient.get(API.TEST_RECOMMENDATIONS, {
      params: { limit, recommendation_type }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  } finally {
    loadingController.stopLoading(300);
  }
}

/**
 * Get user's recent activities
 * @param {number} limit - Number of activities to return
 * @returns {Promise<Object>} API response
 */
export async function getUserActivities(limit = 10) {
  const loadingController = getLoadingController();
  
  try {
    loadingController.startLoading();
    
    const response = await apiClient.get(API.USER_ACTIVITIES, {
      params: { limit }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  } finally {
    loadingController.stopLoading(300);
  }
}

/**
 * Start a practice test
 * @param {string} testId - The test ID
 * @returns {Promise<Object>} API response
 */
export async function startTest(testId) {
  const loadingController = getLoadingController();
  
  try {
    loadingController.startLoading();
    
    const response = await apiClient.post(API.START_TEST, {
      test_id: testId
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  } finally {
    loadingController.stopLoading(300);
  }
}

/**
 * Get user's test history
 * @param {number} limit - Number of tests to return
 * @param {number} page - Page number for pagination
 * @returns {Promise<Object>} API response
 */
export async function getTestHistory(limit = 10, page = 1) {
  const loadingController = getLoadingController();
  
  try {
    loadingController.startLoading();
    
    const response = await apiClient.get(API.TEST_HISTORY, {
      params: { limit, page }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  } finally {
    loadingController.stopLoading(300);
  }
}

/**
 * Get available certification resources
 * @param {string} category - Resource category filter
 * @returns {Promise<Object>} API response
 */
export async function getCertificationResources(category = null) {
  const loadingController = getLoadingController();
  
  try {
    loadingController.startLoading();
    
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
  } finally {
    loadingController.stopLoading(300);
  }
}

/**
 * Get leaderboard data
 * @param {string} period - Time period (week, month, all)
 * @param {number} limit - Number of entries to return
 * @returns {Promise<Object>} API response
 */
export async function getLeaderboard(period = 'week', limit = 10) {
  const loadingController = getLoadingController();
  
  try {
    loadingController.startLoading();
    
    const response = await apiClient.get(API.LEADERBOARD, {
      params: { period, limit }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  } finally {
    loadingController.stopLoading(300);
  }
}

/**
 * Send message to AI assistant
 * @param {string} message - User message
 * @param {Array} history - Conversation history
 * @returns {Promise<Object>} API response
 */
export async function sendAiChatMessage(message, history = []) {
  const loadingController = getLoadingController();
  
  try {
    loadingController.startLoading();
    
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
  } finally {
    loadingController.stopLoading(300);
  }
}