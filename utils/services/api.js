import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'https://base-service-6070296894.us-central1.run.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to all requests
api.interceptors.request.use(
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorResponse = {
      message: 'An unexpected error occurred',
      status: 500,
      data: null,
    };

    if (error.response) {
      // Server responded with an error status code
      errorResponse.message = error.response.data?.message || 'Server error';
      errorResponse.status = error.response.status;
      errorResponse.data = error.response.data;
    } else if (error.request) {
      // Request was made but no response received
      errorResponse.message = 'No response from server. Please check your connection.';
      errorResponse.status = 0;
    } else {
      // Something happened in setting up the request
      errorResponse.message = error.message;
    }

    return Promise.reject(errorResponse);
  }
);

// Wrapper function for making API requests with error handling
export const apiRequest = async (method, url, data = null, params = null) => {
  try {
    const response = await api({
      method,
      url,
      data,
      params,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: {
        message: error.message || 'Request failed',
        status: error.status || 500,
        data: error.data
      } 
    };
  }
};

export default api;