import apiClient from './apiClient';
import { API } from '../constants';
import { getAuth } from 'firebase/auth';

/**
 * Track user activity across the application
 * 
 * @param {string} activity - Description of the activity being tracked
 * @param {Object} metadata - Additional metadata to attach to the activity
 * @returns {Promise<Object>} - API response
 */
export const trackUserActivity = async (activity, metadata = {}) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.warn('Cannot track activity: User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    const payload = {
      activity,
      metadata: [
        {
          uid: user.uid,
          email: user.email,
          ...metadata
        }
      ]
    };

    const response = await apiClient.post(API.USER_ACTIVITIES, payload);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error tracking user activity:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to track activity'
    };
  }
};

/**
 * Get user daily streak information
 * 
 * @returns {Promise<Object>} - API response with streak data
 */
export const getDailyStreak = async () => {
  try {
    const response = await apiClient.get(API.DAILY_STREAK);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching daily streak:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to fetch streak data'
    };
  }
};

/**
 * Get daily question for streak challenge
 * 
 * @returns {Promise<Object>} - API response with daily question
 */
export const getDailyQuestion = async () => {
  try {
    const response = await apiClient.get(API.DAILY_QUESTION);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching daily question:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to fetch daily question'
    };
  }
};

/**
 * Submit answer to daily question
 * 
 * @param {string} questionId - ID of the daily question
 * @param {string} selectedOption - User's selected answer option
 * @returns {Promise<Object>} - API response with updated streak data
 */
export const submitDailyQuestionAnswer = async (questionId, selectedOption) => {
  try {
    const response = await apiClient.post(API.SUBMIT_DAILY_ANSWER, {
      question_id: questionId,
      selected_option: selectedOption
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error submitting daily question answer:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to submit answer'
    };
  }
};

/**
 * Get user recent activities
 * 
 * @param {number} limit - Maximum number of activities to retrieve
 * @returns {Promise<Object>} - API response with activity data
 */
export const getRecentActivities = async (limit = 5) => {
  try {
    const response = await apiClient.get(`${API.USER_ACTIVITIES}?limit=${limit}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to fetch activities'
    };
  }
};

/**
 * Get recommended practice tests for user
 * 
 * @returns {Promise<Object>} - API response with recommendations
 */
export const getRecommendedPracticeTests = async () => {
  try {
    const response = await apiClient.get(API.TEST_RECOMMENDATIONS);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching recommended tests:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to fetch recommendations'
    };
  }
};