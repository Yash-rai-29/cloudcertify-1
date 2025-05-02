import axios from 'axios';
import { AUTH, HTTP_STATUS } from '../constants';
import { auth } from '../firebase';
import { showError } from '../toast';
import { getStoredAuthToken, refreshAuthToken, needsTokenRefresh } from './authService';

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
    // First check if we have a stored token in cookies
    let token = getStoredAuthToken();
    
    // If we have a token but it might be expiring soon, try to refresh it
    if (token && needsTokenRefresh()) {
      const newToken = await refreshAuthToken();
      if (newToken) {
        token = newToken;
      }
    }
    
    // If we still don't have a token but there's a current Firebase user
    // try to get a fresh token directly
    if (!token && auth.currentUser) {
      try {
        token = await auth.currentUser.getIdToken(true);
      } catch (error) {
        console.error('Error getting fresh auth token:', error);
      }
    }
    
    // Set the Authorization header if we have a token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  async (error) => {
    // Extract the original request to retry after potential token refresh
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (expired token)
    if (error.response && error.response.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to refresh the token
      try {
        const newToken = await refreshAuthToken();
        
        if (newToken) {
          // Update the Authorization header with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Retry the original request with the new token
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token on 401:', refreshError);
      }
      
      // If token refresh fails or there's no current user, handle session expiration
      if (auth.currentUser) {
        // Show error message
        showError('Your session has expired. Please log in again.');
        
        // Attempt to sign out the user
        try {
          await auth.signOut();
        } catch (signOutError) {
          console.error('Error signing out user after token expired:', signOutError);
        }
      }
      
      // Redirect to login page with returnUrl and expired flag
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const returnUrl = currentPath !== '/' && !currentPath.includes('/login') ? 
                         currentPath : undefined;
        
        // Build the redirect URL with query parameters
        let redirectUrl = AUTH.ROUTES.LOGIN;
        const params = new URLSearchParams();
        if (returnUrl) params.append('returnUrl', returnUrl);
        params.append('expired', 'true');
        
        if (params.toString()) {
          redirectUrl += `?${params.toString()}`;
        }
        
        // Use this approach rather than router.push to ensure a full page reload,
        // which helps clear any stale state
        window.location.href = redirectUrl;
      }
    } 
    // Handle 403 Forbidden errors (user doesn't have permission)
    else if (error.response && error.response.status === HTTP_STATUS.FORBIDDEN) {
      showError('You do not have permission to access this resource.');
    }
    // Handle rate limiting
    else if (error.response && error.response.status === HTTP_STATUS.RATE_LIMIT) {
      showError('Too many requests. Please try again later.');
    }
    // Network errors or the server didn't respond
    else if (error.request) {
      showError('Could not connect to the server. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;