/**
 * Server-side resources API service functions
 * Used by API routes to fetch learning resources data from external services
 */
import { serverApiClient, handleApiError, setAuthToken } from './apiClient';
import { API } from '../../utils/constants';

/**
 * Fetch learning resources with filtering and pagination
 * 
 * @param {string} token - Authentication token
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response
 */
export async function getResources(token, params = {}) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(`${API.BASE_URL}/b/resources`, {
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
 * Get resource details by ID
 * 
 * @param {string} token - Authentication token
 * @param {string} resourceId - ID of the resource to fetch
 * @returns {Promise<Object>} API response
 */
export async function getResourceById(token, resourceId) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(
      `${API.BASE_URL}/b/resources/${resourceId}`
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
 * Get resource categories
 * 
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} API response
 */
export async function getResourceCategories(token) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(
      `${API.BASE_URL}/b/resources/categories`
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
 * Get resource tags
 * 
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} API response
 */
export async function getResourceTags(token) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.get(
      `${API.BASE_URL}/b/resources/tags`
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
 * Add a resource to user's saved items
 * 
 * @param {string} token - Authentication token
 * @param {string} resourceId - ID of the resource to save
 * @returns {Promise<Object>} API response
 */
export async function saveResource(token, resourceId) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.post(
      `${API.BASE_URL}/b/resources/${resourceId}/save`
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
 * Remove a resource from user's saved items
 * 
 * @param {string} token - Authentication token
 * @param {string} resourceId - ID of the resource to unsave
 * @returns {Promise<Object>} API response
 */
export async function unsaveResource(token, resourceId) {
  try {
    setAuthToken(token);
    const response = await serverApiClient.delete(
      `${API.BASE_URL}/b/resources/${resourceId}/save`
    );
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}
