/**
 * Client-side dashboard service for interacting with server API routes
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
 * Get leaderboard data
 * 
 * @param {number} limit - Number of users to return
 * @returns {Promise<Object>} API response
 */
export async function getLeaderboard(limit = 20) {
  try {
    const response = await apiClient.get('/dashboard/leaderboard', {
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
 * @returns {Promise<Object>} API response
 */
export async function getDashboardStats() {
  try {
    const response = await apiClient.get('/dashboard/stats');
    
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
 * @returns {Promise<Object>} API response
 */
export async function getUserProfile() {
  try {
    const response = await apiClient.get('/dashboard/profile');
    
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
 * 
 * @returns {Promise<Object>} API response
 */
export async function getDailyStreak() {
  try {
    const response = await apiClient.get('/dashboard/streak');
    
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
 * 
 * @param {number} limit - Number of activities to return
 * @returns {Promise<Object>} API response
 */
export async function getUserActivities(limit = 10) {
  try {
    const response = await apiClient.get('/dashboard/activities', {
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
 * Get test recommendations for the user
 * 
 * @param {number} limit - Number of recommendations to return
 * @returns {Promise<Object>} API response
 */
export async function getTestRecommendations(limit = 4) {
  try {
    const response = await apiClient.get('/dashboard/recommendations', {
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

export { getLeaderboard, getDashboardStats, getUserProfile, getDailyStreak, getUserActivities, getTestRecommendations };
