import axios from 'axios';
import { AUTH, HTTP_STATUS } from '../constants';
import { auth } from '../firebase';
import { showError } from '../toast';

// Create an axios instance for API calls
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://base-service-6070296894.us-central1.run.app',
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Get the current user token if available
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
        // If can't get token, proceed with the request without it
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration and authentication errors
    if (error.response) {
      // Handle 401 Unauthorized errors (expired token or not authenticated)
      if (error.response.status === HTTP_STATUS.UNAUTHORIZED) {
        // Show error message
        showError('Your session has expired. Please log in again.');
        
        // Attempt to sign out the user
        try {
          auth.signOut();
        } catch (signOutError) {
          console.error('Error signing out user after token expired:', signOutError);
        }
        
        // Redirect to login page (will be handled by the auth state listener)
        // If this doesn't work immediately, we could use next/router to force navigation
        if (typeof window !== 'undefined') {
          window.location.href = AUTH.ROUTES.LOGIN;
        }
      } 
      // Handle 403 Forbidden errors (user doesn't have permission)
      else if (error.response.status === HTTP_STATUS.FORBIDDEN) {
        showError('You do not have permission to access this resource.');
      }
      // Handle rate limiting
      else if (error.response.status === HTTP_STATUS.RATE_LIMIT) {
        showError('Too many requests. Please try again later.');
      }
    } 
    // Network errors or the server didn't respond
    else if (error.request) {
      showError('Could not connect to the server. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;