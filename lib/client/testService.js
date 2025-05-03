/**
 * Client-side test service for interacting with server API routes
 * This ensures all API calls go through server endpoints and never directly to external APIs
 */
import axios from 'axios';

// Create API client instance with proper error handling
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Handles API errors in a consistent way
 * @param {Error} error - Axios error object
 * @returns {Object} Error response
 */
function handleApiError(error) {
  const status = error.response?.status || 500;
  const message = error.response?.data?.error?.message || error.message || 'An unknown error occurred';
  
  return {
    success: false,
    error: { status, message }
  };
}

/**
 * Fetch tests with filters, sorting and pagination
 * 
 * @param {Object} params - Query parameters for filtering and pagination
 * @returns {Promise<Object>} API response
 */
export async function fetchTests(params = {}) {
  try {
    const response = await apiClient.get('/tests', { params });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Start a test attempt
 * 
 * @param {string} testId - ID of the test to start
 * @param {string} mode - Test mode ('practice' or 'exam')
 * @returns {Promise<Object>} API response
 */
export async function startTestAttempt(testId, mode) {
  try {
    const response = await apiClient.post(`/tests/${testId}/start`, { mode });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get test details including questions
 * 
 * @param {string} testId - ID of the test
 * @returns {Promise<Object>} API response
 */
export async function getTestDetails(testId) {
  try {
    const response = await apiClient.get(`/tests/${testId}`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Submit answer for a question
 * 
 * @param {string} attemptId - ID of the test attempt
 * @param {Object} answerData - Answer data
 * @returns {Promise<Object>} API response
 */
export async function submitAnswer(attemptId, answerData) {
  try {
    const response = await apiClient.post(
      `/tests/attempts/${attemptId}/answer`,
      answerData
    );
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Finish a test attempt
 * 
 * @param {string} attemptId - ID of the test attempt
 * @returns {Promise<Object>} API response
 */
export async function finishTestAttempt(attemptId) {
  try {
    const response = await apiClient.post(`/tests/attempts/${attemptId}/finish`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get test attempt details
 * 
 * @param {string} attemptId - ID of the test attempt
 * @returns {Promise<Object>} API response
 */
export async function getTestAttempt(attemptId) {
  try {
    const response = await apiClient.get(`/tests/attempts/${attemptId}`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get user's test history with filtering and pagination
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response
 */
export async function getTestHistory(params = {}) {
  try {
    const response = await apiClient.get('/tests/history', { params });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get user test performance analytics
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response
 */
export async function getTestPerformanceAnalytics(params = {}) {
  try {
    const response = await apiClient.get('/tests/analytics/performance', { 
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
 * Get user statistics for test performance and history
 * 
 * @returns {Promise<Object>} API response with user statistics
 */
export async function getUserStatistics() {
  try {
    const response = await apiClient.get('/tests/statistics');
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}
