import apiClient from './apiClient';
import { API } from '../constants';
import { handleApiError } from '../helpers';

/**
 * Fetch resources with various filtering options
 * @param {Object} params - Query parameters for filtering
 * @param {string} params.certification - Filter by certification
 * @param {string} params.resource_type - Filter by resource type
 * @param {string} params.tag - Filter by tag
 * @param {string} params.search - Search term
 * @param {string} params.sort_by - Field to sort by ("created_at", "likes", "views")
 * @param {string} params.sort_order - Sort direction ("asc", "desc")
 * @param {number} params.limit - Number of resources to fetch
 * @param {string} params.cursor - Cursor for pagination
 * @returns {Promise<Object>} API response
 */
export async function fetchResources(params = {}) {
  try {
    const response = await apiClient.get(API.BASE_URL + '/b/resources/resources', { 
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
 * Toggle like/unlike for a resource
 * @param {string} resourceId - ID of the resource
 * @returns {Promise<Object>} API response
 */
export async function toggleResourceLike(resourceId) {
  try {
    const response = await apiClient.post(
      API.BASE_URL + '/b/resources/resources/toggle_like', 
      null,
      { params: { resource_id: resourceId } }
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
 * Increment view count for a resource
 * @param {string} resourceId - ID of the resource
 * @returns {Promise<Object>} API response
 */
export async function incrementResourceView(resourceId) {
  try {
    const response = await apiClient.post(
      API.BASE_URL + '/b/resources/resources/increment_view',
      null,
      { params: { resource_id: resourceId } }
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
 * Get available certification options for filtering
 * @returns {Promise<Object>} API response
 */
export async function getCertificationOptions() {
  try {
    const response = await apiClient.get(API.CERTIFICATION_OPTIONS);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}
