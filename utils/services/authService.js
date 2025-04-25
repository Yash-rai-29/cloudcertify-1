import { apiRequest } from './api';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../firebase';
import Cookies from 'js-cookie';
import { API, AUTH } from '../constants';

/**
 * Handle the setting of auth cookies consistently
 * 
 * @param {Object} user - Firebase user object
 * @param {number} expiryDays - Days until cookie expires
 * @returns {Promise<string>} - Authentication token
 */
const setAuthCookies = async (user, expiryDays = 7) => {
  try {
    const token = await user.getIdToken();
    Cookies.set(AUTH.COOKIE_NAMES.AUTH_TOKEN, token, { expires: expiryDays });
    return token;
  } catch (error) {
    console.error('Error setting auth cookies:', error);
    throw error;
  }
};

/**
 * Clear all authentication-related cookies
 */
const clearAuthCookies = () => {
  Cookies.remove(AUTH.COOKIE_NAMES.AUTH_TOKEN);
  Cookies.remove(AUTH.COOKIE_NAMES.REFRESH_TOKEN);
};

/**
 * Create a standardized error response
 * 
 * @param {Error} error - The error object
 * @param {string} operation - The operation that failed
 * @returns {Object} Standardized error response
 */
const createErrorResponse = (error, operation) => {
  console.error(`Auth Error (${operation}):`, error);
  
  // Check if this is an API validation error with a detail field
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    // Format validation errors into a more user-friendly message
    let message = 'Validation error: ';
    
    if (Array.isArray(detail)) {
      message += detail.map(item => {
        const field = item.loc[item.loc.length - 1];
        return `${field} - ${item.msg}`;
      }).join(', ');
    } else {
      message += error.response.data.detail.toString();
    }
    
    return {
      success: false,
      error: {
        message,
        code: 'validation_error',
        operation,
        detail: error.response.data.detail
      }
    };
  }
  
  return {
    success: false,
    error: {
      message: error.message || `${operation} failed`,
      code: error.code || 'unknown',
      operation
    }
  };
};

/**
 * Sign up a new user
 * First creates user via API, then authenticates with Firebase
 * 
 * @param {Object} userData - User sign up data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.first_name - User first name
 * @param {string} userData.last_name - User last name
 * @param {string} userData.certification_target - GCP certification target
 * @returns {Object} Sign up result
 */
export const signUp = async (userData) => {
  try {
    // Step 1: Create user via FastAPI
    const apiResponse = await apiRequest('post', API.ENDPOINTS.USERS, userData);
    
    if (!apiResponse.success) {
      // Directly return the API error to preserve validation details
      return {
        success: false,
        error: {
          message: apiResponse.message || 'API user creation failed',
          code: 'api_error',
          operation: 'signUp',
          detail: apiResponse.error
        }
      };
    }
    
    // Step 2: Sign in with Firebase using provided credentials
    const { email, password } = userData;
    const firebaseResponse = await signInWithEmailAndPassword(auth, email, password);
    
    // Step 3: Set auth cookies
    await setAuthCookies(firebaseResponse.user);
    
    // Return combined data
    return {
      success: true,
      data: {
        ...apiResponse.data,
        firebaseUser: {
          uid: firebaseResponse.user.uid,
          email: firebaseResponse.user.email,
          emailVerified: firebaseResponse.user.emailVerified,
        }
      }
    };
  } catch (error) {
    return createErrorResponse(error, 'signUp');
  }
};

/**
 * Sign in existing user with email and password
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Sign in result
 */
export const signIn = async (email, password) => {
  try {
    // Authenticate with Firebase
    const firebaseResponse = await signInWithEmailAndPassword(auth, email, password);
    
    // Set auth cookies
    await setAuthCookies(firebaseResponse.user);
    
    return {
      success: true,
      data: {
        user: {
          uid: firebaseResponse.user.uid,
          email: firebaseResponse.user.email,
          emailVerified: firebaseResponse.user.emailVerified,
        }
      }
    };
  } catch (error) {
    return createErrorResponse(error, 'signIn');
  }
};

/**
 * Sign out current user
 * 
 * @returns {Object} Sign out result
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    clearAuthCookies();
    
    return { success: true };
  } catch (error) {
    return createErrorResponse(error, 'signOut');
  }
};

/**
 * Reset password for a user
 * 
 * @param {string} email - User email
 * @returns {Object} Password reset result
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return createErrorResponse(error, 'resetPassword');
  }
};