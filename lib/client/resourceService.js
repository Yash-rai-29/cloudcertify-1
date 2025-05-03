/**
 * Client-side resource service for interacting with server API routes
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
 * Fetch resources with filtering and pagination
 * 
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} API response
 */
export async function getResources(params = {}) {
  try {
    const response = await apiClient.get('/resources', { params });
    
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
 * @param {string} resourceId - ID of the resource to fetch
 * @returns {Promise<Object>} API response
 */
export async function getResourceById(resourceId) {
  try {
    const response = await apiClient.get(`/resources/${resourceId}`);
    
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
 * @returns {Promise<Object>} API response
 */
export async function getResourceCategories() {
  try {
    const response = await apiClient.get('/resources/categories');
    
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
 * @returns {Promise<Object>} API response
 */
export async function getResourceTags() {
  try {
    const response = await apiClient.get('/resources/tags');
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Save a resource
 * 
 * @param {string} resourceId - ID of the resource to save
 * @returns {Promise<Object>} API response
 */
export async function saveResource(resourceId) {
  try {
    const response = await apiClient.post(`/resources/${resourceId}/save`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Unsave a resource
 * 
 * @param {string} resourceId - ID of the resource to unsave
 * @returns {Promise<Object>} API response
 */
export async function unsaveResource(resourceId) {
  try {
    const response = await apiClient.delete(`/resources/${resourceId}/save`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}
