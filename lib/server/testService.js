/**
 * Server-side test API service functions
 * Used by API routes to fetch data from external services
 */
import { serverApiClient, handleApiError, setAuthToken } from './apiClient';
import { API } from '../../utils/constants';

/**
 * Fetch tests with filters, sorting and pagination
 * 
 * @param {string} token - Authentication token
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response
 */
export async function fetchTests(token, params = {}) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(`${API.BASE_URL}/b/test_library/tests`, {
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
 * Start a test attempt
 * 
 * @param {string} token - Authentication token
 * @param {string} testId - ID of the test to start
 * @param {string} mode - Test mode ('practice' or 'exam')
 * @returns {Promise<Object>} API response
 */
export async function startTestAttempt(token, testId, mode) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.post(
      `${API.BASE_URL}/b/test_library/tests/${testId}/start`,
      { mode }
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
 * Get test details including questions
 * 
 * @param {string} token - Authentication token
 * @param {string} testId - ID of the test
 * @returns {Promise<Object>} API response
 */
export async function getTestDetails(token, testId) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(
      `${API.BASE_URL}/b/test_library/tests/${testId}`
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
 * Submit answer for a question
 * 
 * @param {string} token - Authentication token
 * @param {string} attemptId - ID of the test attempt
 * @param {Object} answerData - Answer data
 * @returns {Promise<Object>} API response
 */
export async function submitAnswer(token, attemptId, answerData) {
  try {
    setAuthToken(token);
    // Format the payload according to API expectations
    const payload = {
      question_id: answerData.question_id,
      selected_option: Array.isArray(answerData.selected_option_ids) 
        ? answerData.selected_option_ids
        : [answerData.selected_option_ids],
      time_taken: answerData.time_taken
    };
    
    const response = await serverApiClient.post(
      `${API.BASE_URL}/b/test_library/attempts/${attemptId}/answer`,
      payload
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
 * @param {string} token - Authentication token
 * @param {string} attemptId - ID of the test attempt
 * @returns {Promise<Object>} API response
 */
export async function finishTestAttempt(token, attemptId) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.post(
      `${API.BASE_URL}/b/test_library/attempts/${attemptId}/finish`
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
 * Get test attempt details
 * 
 * @param {string} token - Authentication token
 * @param {string} attemptId - ID of the test attempt
 * @returns {Promise<Object>} API response
 */
export async function getTestAttempt(token, attemptId) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(
      `${API.BASE_URL}/b/test_library/attempts/${attemptId}`
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
 * Get user's test history with filtering and pagination
 * 
 * @param {string} token - Authentication token
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response
 */
export async function getTestHistory(token, params = {}) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(
      `${API.BASE_URL}/b/test_library/history`,
      { params }
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
 * Get user test performance analytics
 * 
 * @param {string} token - Authentication token
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response
 */
export async function getTestPerformanceAnalytics(token, params = {}) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(
      `${API.BASE_URL}/b/test_library/analytics/performance`,
      { params }
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
 * Get user statistics for test performance and history
 * 
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} API response with user statistics
 */
export async function getUserStatistics(token) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(
      `${API.BASE_URL}${API.USER_STATISTICS}`
    );
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}
