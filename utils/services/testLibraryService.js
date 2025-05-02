import apiClient from './apiClient';
import { API } from '../constants';
import { handleApiError } from '../helpers';

/**
 * Fetch tests with filters, sorting and pagination
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.category - Filter by test category
 * @param {string} params.cloud_provider - Filter by cloud provider
 * @param {string} params.difficulty - Filter by difficulty level
 * @param {string} params.status - Filter by status
 * @param {string} params.search - Search term
 * @param {string} params.sort_by - Field to sort by
 * @param {string} params.sort_order - Sort direction (asc/desc)
 * @param {number} params.limit - Number of items per page
 * @param {string} params.cursor - Pagination cursor
 * @returns {Promise<Object>} API response
 */
export async function fetchTests(params = {}) {
  try {
    const response = await apiClient.get(`${API.BASE_URL}/b/test_library/tests`, {
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
 * @param {string} testId - ID of the test to start
 * @param {string} mode - Test mode ('practice' or 'exam')
 * @returns {Promise<Object>} API response
 */
export async function startTestAttempt(testId, mode) {
  try {
    const response = await apiClient.post(
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
 * @param {string} testId - ID of the test
 * @returns {Promise<Object>} API response
 */
export async function getTestDetails(testId) {
  try {
    const response = await apiClient.get(
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
 * @param {string} attemptId - ID of the test attempt
 * @param {string} questionId - ID of the question
 * @param {string[]} selectedOption - Selected option(s)
 * @param {number} timeTaken - Time taken to answer in seconds
 * @returns {Promise<Object>} API response
 */
export async function submitAnswer(attemptId, questionId, selectedOption, timeTaken) {
  try {
    const response = await apiClient.post(
      `${API.BASE_URL}/b/test_library/attempts/${attemptId}/answer`,
      {
        question_id: questionId,
        selected_option: selectedOption,
        time_taken: timeTaken
      }
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
    const response = await apiClient.post(
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
 * @param {string} attemptId - ID of the test attempt
 * @returns {Promise<Object>} API response
 */
export async function getTestAttempt(attemptId) {
  try {
    const response = await apiClient.get(
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
 * @param {Object} params - Query parameters
 * @param {string} params.search - Search term for test title
 * @param {string} params.period - Time period filter (week, month, 3months, year, all)
 * @param {string} params.status - Status filter (passed, failed)
 * @param {string} params.sort_by - Field to sort by
 * @param {string} params.sort_order - Sort direction (asc/desc)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Number of items per page
 * @returns {Promise<Object>} API response
 */
export async function getTestHistory(params = {}) {
  try {
    const response = await apiClient.get(
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
 * Get user's test attempts with filtering and pagination
 * 
 * @param {Object} params - Query parameters
 * @param {string} params.test_id - Filter by test ID
 * @param {string} params.status - Filter by attempt status (completed, in-progress)
 * @param {string} params.mode - Filter by mode (practice, exam)
 * @param {string} params.search - Search by test title or fields
 * @param {string} params.cursor - Pagination cursor
 * @param {number} params.page_size - Number of items per page
 * @returns {Promise<Object>} API response
 */
export async function getUserTestAttempts(params = {}) {
  try {
    const response = await apiClient.get(
      `${API.BASE_URL}/b/test_library/attempts`,
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
 * Get specific test attempt details
 * 
 * @param {string} attemptId - ID of the attempt
 * @returns {Promise<Object>} API response
 */
export async function getTestAttemptDetails(attemptId) {
  try {
    const response = await apiClient.get(
      `${API.BASE_URL}/b/test_library/history/attempts/${attemptId}`
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
 * @param {Object} params - Query parameters
 * @param {string} params.period - Time period (week, month, year, all)
 * @returns {Promise<Object>} API response
 */
export async function getTestPerformanceAnalytics(params = {}) {
  try {
    const response = await apiClient.get(
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
 * Resume an in-progress test attempt
 * 
 * @param {string} attemptId - ID of the attempt to resume
 * @returns {Promise<Object>} API response
 */
export async function resumeTestAttempt(attemptId) {
  try {
    const response = await apiClient.post(
      `${API.BASE_URL}/b/test_library/attempts/${attemptId}/resume`
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
 * @returns {Promise<Object>} API response with user statistics
 */
export async function getUserStatistics() {
  try {
    const response = await apiClient.get(
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
