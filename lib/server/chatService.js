/**
 * Server-side chat API service functions
 * Used by API routes to fetch data from external services
 */
import { serverApiClient, handleApiError, setAuthToken } from './apiClient';
import { API } from '../constants';

/**
 * Get chat history for the current user
 * 
 * @param {string} token - Authentication token
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Number of messages to return
 * @param {string} params.cursor - Pagination cursor
 * @returns {Promise<Object>} API response
 */
export async function getChatHistory(token, params = {}) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(`${API.BASE_URL}/b/chat/history`, {
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
 * Send a chat message
 * 
 * @param {string} token - Authentication token
 * @param {Object} messageData - Message data
 * @param {string} messageData.text - Message text
 * @param {string} messageData.context - Optional context
 * @returns {Promise<Object>} API response
 */
export async function sendChatMessage(token, messageData) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.post(
      `${API.BASE_URL}/b/chat/send`,
      messageData
    );
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}
