/**
 * Client-side chat service for interacting with server API routes
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
 * Get chat history
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Number of messages to return
 * @param {string} params.cursor - Pagination cursor
 * @returns {Promise<Object>} API response
 */
export async function getChatHistory(params = {}) {
  try {
    const response = await apiClient.get('/chat', { params });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Send a chat message
 * 
 * @param {Object} messageData - Message data
 * @param {string} messageData.message - Message text
 * @param {string} messageData.context - Optional context
 * @returns {Promise<Object>} API response
 */
export async function sendChatMessage(messageData) {
  try {
    const response = await apiClient.post('/chat', messageData);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}
