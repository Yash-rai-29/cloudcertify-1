/**
 * Server-side dashboard API service functions
 * Used by API routes to fetch data from external services
 */
import { serverApiClient, handleApiError, setAuthToken } from './apiClient';
import { API } from '../../utils/constants';

/**
 * Get leaderboard data
 * 
 * @param {string} token - Authentication token
 * @param {number} limit - Number of users to return
 * @returns {Promise<Object>} API response
 */
export async function getLeaderboard(token, limit = 20) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(`${API.BASE_URL}/b/leaderboard`, {
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
 * Get dashboard statistics
 * 
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} API response
 */
export async function getDashboardStats(token) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(`${API.BASE_URL}/b/dashboard/stats`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get user profile data
 * 
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} API response
 */
export async function getUserProfile(token) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(`${API.BASE_URL}/b/user/profile`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get daily streak information
 * 
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} API response
 */
export async function getDailyStreak(token) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(`${API.BASE_URL}/b/user/streak`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get user activities
 * 
 * @param {string} token - Authentication token
 * @param {number} limit - Number of activities to return
 * @returns {Promise<Object>} API response
 */
export async function getUserActivities(token, limit = 10) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(`${API.BASE_URL}/b/user/activities`, {
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
 * Get test recommendations
 * 
 * @param {string} token - Authentication token
 * @param {number} limit - Number of recommendations to return
 * @returns {Promise<Object>} API response
 */
export async function getTestRecommendations(token, limit = 4) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(`${API.BASE_URL}/b/test_library/recommendations`, {
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
