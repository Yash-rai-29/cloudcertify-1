/**
 * Client-side user service for interacting with server API routes
 * Follows project guidelines with named exports and clean separation of concerns
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
 * Get user profile data
 * 
 * @returns {Promise<Object>} API response
 */
export async function getUserProfile() {
  try {
    const response = await apiClient.get('/users/profile');
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Update user profile
 * 
 * @param {Object} profileData - User profile data to update
 * @returns {Promise<Object>} API response
 */
export async function updateUserProfile(profileData) {
  try {
    const response = await apiClient.put('/users/profile', profileData);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get user statistics
 * 
 * @returns {Promise<Object>} API response
 */
export async function getUserStatistics() {
  try {
    const response = await apiClient.get('/users/statistics');
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get user settings
 * 
 * @returns {Promise<Object>} API response
 */
export async function getUserSettings() {
  try {
    const response = await apiClient.get('/users/settings');
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Update user settings
 * 
 * @param {Object} settings - User settings data to update
 * @returns {Promise<Object>} API response
 */
export async function updateUserSettings(settings) {
  try {
    const response = await apiClient.put('/users/settings', settings);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}
