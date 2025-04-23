import axios from 'axios';
import Cookies from 'js-cookie';

// API base URL
const API_BASE_URL = 'https://base-service-6070296894.us-central1.run.app';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration, network errors, etc.
    if (error.response?.status === 401) {
      // Optionally redirect to login page or refresh token
      console.error('Authentication error:', error);
      Cookies.remove('auth_token');
      window.location.href = '/auth/login';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Make API requests with standard format
 * 
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {string} url - API endpoint
 * @param {object} data - Request body data (for POST, PUT)
 * @param {object} params - URL query parameters
 * @returns {Promise} - Promise with standardized response format
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
    console.error(`API ${method.toUpperCase()} request to ${url} failed:`, error);
    
    return {
      success: false,
      error: {
        message: error.response?.data?.detail || error.message || 'An unexpected error occurred',
        status: error.response?.status || 500,
        data: error.response?.data || null
      }
    };
  }
};

export default apiClient;