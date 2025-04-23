import axios from 'axios';
import Cookies from 'js-cookie';
import { API, AUTH, HTTP_STATUS } from '../constants';

/**
 * Axios instance configured for API requests
 */
export const apiClient = axios.create({
  baseURL: API.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000 // 10s timeout for requests
});

/**
 * Request interceptor to add auth token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get auth token from cookies
    const token = Cookies.get(AUTH.COOKIE_NAMES.AUTH_TOKEN);
    
    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor to handle common error cases
 */
apiClient.interceptors.response.use(
  // For successful responses, just return the response
  (response) => response,
  
  // For error responses, handle common cases
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // Handle authentication errors
      if (status === HTTP_STATUS.UNAUTHORIZED) {
        // Clear all auth cookies
        Cookies.remove(AUTH.COOKIE_NAMES.AUTH_TOKEN);
        Cookies.remove(AUTH.COOKIE_NAMES.REFRESH_TOKEN);
        
        // Redirect to login in browser context
        if (typeof window !== 'undefined') {
          window.location.href = AUTH.ROUTES.LOGIN;
        }
      }
      
      // Handle rate limiting
      if (status === HTTP_STATUS.RATE_LIMIT) {
        console.error('API rate limit exceeded. Please try again later.');
      }
      
      // Add more common error handlers as needed
    }
    
    return Promise.reject(error);
  }
);

/**
 * Generic API request function with standardized error handling
 * 
 * @param {string} method - HTTP method (get, post, put, delete)
 * @param {string} url - API endpoint
 * @param {Object} data - Request payload (for POST/PUT)
 * @param {Object} params - URL query parameters (for GET)
 * @returns {Object} - Standardized response object
 */
export const apiRequest = async (method, url, data = null, params = null) => {
  try {
    // Make request with apiClient
    const response = await apiClient({
      method,
      url,
      data,
      params
    });
    
    // Return standardized success response
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    // Log the error to console
    console.error(`API Error (${method.toUpperCase()} ${url}):`, error);
    
    // Construct standardized error response
    return {
      success: false,
      status: error.response?.status || HTTP_STATUS.SERVER_ERROR,
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      error: error.response?.data?.error || error.name || 'UnknownError'
    };
  }
};