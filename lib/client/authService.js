/**
 * Client-side authentication service for interacting with server API routes
 * Implements React Query for efficient data fetching and caching
 */
import axios from 'axios';

// Create API client instance
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Handles API errors consistently
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
 * Verify authentication token with server
 * 
 * @returns {Promise<Object>} API response
 */
export async function verifyAuth() {
  try {
    const response = await apiClient.get('/auth/verify');
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Get current user session data
 * 
 * @returns {Promise<Object>} API response with user session data
 */
export async function getUserSession() {
  try {
    const response = await apiClient.get('/auth/session');
    
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
 * Set authentication token in cookie
 * This is a client-side only function
 * 
 * @param {string} token - Authentication token to store
 * @param {number} expiresInDays - Token expiration in days
 */
export function setAuthToken(token, expiresInDays = 7) {
  if (typeof window === 'undefined') return;
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiresInDays);
  
  document.cookie = `auth_token=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
}

/**
 * Get stored authentication token from cookie
 * This is a client-side only function
 * 
 * @returns {string|null} Stored authentication token or null
 */
export function getStoredAuthToken() {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
  
  if (!tokenCookie) return null;
  
  return tokenCookie.split('=')[1];
}

/**
 * Clear authentication token from cookie
 * This is a client-side only function
 */
export function clearAuthToken() {
  if (typeof window === 'undefined') return;
  
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
