/**
 * Server-side authentication service
 * Handles token verification and user authentication
 */
import { serverApiClient, handleApiError, setAuthToken } from './apiClient';
import { API } from '../constants';

/**
 * Verify a Firebase authentication token on the server
 * 
 * @param {string} token - Firebase authentication token
 * @returns {Promise<Object>} API response with user data
 */
export async function verifyAuthToken(token) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.post(`${API.BASE_URL}/b/auth/verify`, {
      token
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
 * Get user session data from token
 * 
 * @param {string} token - Firebase authentication token
 * @returns {Promise<Object>} API response with user session data
 */
export async function getUserSession(token) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(`${API.BASE_URL}/b/user/session`);
    
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
 * @param {string} token - Firebase authentication token
 * @param {Object} profileData - User profile data to update
 * @returns {Promise<Object>} API response
 */
export async function updateUserProfile(token, profileData) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.put(
      `${API.BASE_URL}/b/user/profile`,
      profileData
    );
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}
