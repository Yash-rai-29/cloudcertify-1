/**
 * Server-side API client for making authenticated requests to external services
 * This is used by API routes to fetch data server-side
 */
import axios from 'axios';

// Create a server-side axios instance for API calls
export const serverApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://base-service-6070296894.us-central1.run.app',
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Set authentication token for API requests
 * @param {string} token - Firebase auth token 
 */
export function setAuthToken(token) {
  if (token) {
    serverApiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete serverApiClient.defaults.headers.common['Authorization'];
  }
}

/**
 * Handle API errors in a consistent way across server-side calls
 * @param {Error} error - Axios error object
 * @returns {Object} Error response object
 */
export function handleApiError(error) {
  // Get status code and response data from the error, if available
  const status = error.response?.status || 500;
  const message = error.response?.data?.message || error.message || 'An unknown error occurred';
  const data = error.response?.data || null;

  console.error(`API Error (${status}): ${message}`, error);

  return {
    success: false,
    error: {
      status,
      message,
      data
    }
  };
}
