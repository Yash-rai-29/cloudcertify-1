import axios from 'axios';
import Cookies from 'js-cookie';

// API base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cloudcertify.app/v1';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercept requests to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Authentication errors
      if (error.response.status === 401) {
        // Clear auth cookies and redirect to login
        Cookies.remove('authToken');
        Cookies.remove('refreshToken');
        
        // Only redirect if in browser context
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      
      // Rate limiting
      if (error.response.status === 429) {
        console.error('API rate limit exceeded. Please try again later.');
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Generic API request wrapper with error handling
 * 
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {string} url - API endpoint
 * @param {Object} data - Request payload (for POST/PUT)
 * @param {Object} params - URL query parameters (for GET)
 * @returns {Promise} - API response with standardized format
 */
export const apiRequest = async (method, url, data = null, params = null) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      params
    });
    
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    
    // Extract error details
    const errorResponse = {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      error: error.response?.data?.error || error.name || 'UnknownError'
    };
    
    return errorResponse;
  }
};