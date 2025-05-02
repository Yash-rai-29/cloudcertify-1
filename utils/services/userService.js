import apiClient from './apiClient';
import { API } from '../constants';
import { handleApiError } from '../helpers';

/**
 * Update user profile information
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} API response
 */
export async function updateUserProfile(userData) {
  try {
    // Ensure all fields are included in the request
    const profileData = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      certification_target: userData.certification_target,
      job_title: userData.job_title,
      bio: userData.bio,
      photo_url: userData.photo_url
    };
    
    const response = await apiClient.put(API.USERS, profileData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * Upload user profile image
 * @param {File} file - Image file to upload
 * @returns {Promise<Object>} API response with image URL
 */
export async function uploadProfileImage(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(API.UPLOAD_USER_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
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
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} API response
 */
export async function updatePassword(newPassword) {
  try {
    const response = await apiClient.post(API.UPDATE_PASSWORD, {
      new_password: newPassword
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
 * Get available certification options
 * @returns {Promise<Object>} API response with certification options
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
