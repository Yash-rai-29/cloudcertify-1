import apiClient from './apiClient';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  getAuth,
  getIdTokenResult
} from 'firebase/auth';
import { auth } from '../firebase';
import Cookies from 'js-cookie';
import { API, AUTH } from '../constants';

/**
 * Handle the setting of auth cookies consistently
 * 
 * @param {Object} user - Firebase user object
 * @param {number} expiryDays - Days until cookie expires (defaults to constant)
 * @returns {Promise<string>} - Authentication token
 */
const setAuthCookies = async (user, expiryDays = AUTH.TOKEN.DEFAULT_EXPIRY_DAYS) => {
  try {
    // Get the ID token and refresh token
    const token = await user.getIdToken();
    const refreshToken = user.refreshToken;
    
    // Set cookies with secure attributes
    const cookieOptions = { 
      expires: expiryDays, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };
    
    // Store both tokens
    Cookies.set(AUTH.COOKIE_NAMES.AUTH_TOKEN, token, cookieOptions);
    
    // Store refresh token if available
    if (refreshToken) {
      Cookies.set(AUTH.COOKIE_NAMES.REFRESH_TOKEN, refreshToken, cookieOptions);
    }
    
    // Also store the expiry timestamp to check for refresh needs
    const tokenResult = await user.getIdTokenResult();
    const expiryTime = new Date(tokenResult.expirationTime).getTime();
    Cookies.set(AUTH.COOKIE_NAMES.TOKEN_EXPIRY, expiryTime.toString(), cookieOptions);
    
    return token;
  } catch (error) {
    console.error('Error setting auth cookies:', error);
    throw error;
  }
};

/**
 * Get stored auth token from cookies
 * 
 * @returns {string|null} - Auth token or null if not found
 */
export const getStoredAuthToken = () => {
  return Cookies.get(AUTH.COOKIE_NAMES.AUTH_TOKEN) || null;
};

/**
 * Get stored refresh token from cookies
 * 
 * @returns {string|null} - Refresh token or null if not found
 */
export const getStoredRefreshToken = () => {
  return Cookies.get(AUTH.COOKIE_NAMES.REFRESH_TOKEN) || null;
};

/**
 * Check if token needs refreshing
 * 
 * @returns {boolean} - Whether token needs refreshing
 */
export const needsTokenRefresh = () => {
  const expiryTime = Cookies.get(AUTH.COOKIE_NAMES.TOKEN_EXPIRY);
  if (!expiryTime) return true;
  
  const currentTime = Date.now();
  const refreshThreshold = AUTH.TOKEN.REFRESH_THRESHOLD_MINUTES * 60 * 1000;
  
  return (parseInt(expiryTime) - currentTime) < refreshThreshold;
};

/**
 * Refresh the auth token if needed
 * 
 * @returns {Promise<string|null>} - New token or null if refresh failed
 */
export const refreshAuthToken = async () => {
  try {
    if (!auth.currentUser) return null;
    
    const token = await auth.currentUser.getIdToken(true);
    if (token) {
      // Update cookies with new token
      await setAuthCookies(auth.currentUser);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Failed to refresh auth token:', error);
    return null;
  }
};

/**
 * Clear all authentication-related cookies
 */
const clearAuthCookies = () => {
  Cookies.remove(AUTH.COOKIE_NAMES.AUTH_TOKEN);
  Cookies.remove(AUTH.COOKIE_NAMES.REFRESH_TOKEN);
  Cookies.remove(AUTH.COOKIE_NAMES.TOKEN_EXPIRY);
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
  
  // Check for "User already exists" error
  if (error.response?.data?.error === "User already exists") {
    return {
      success: false,
      error: {
        message: "A user with this email already exists. Please try logging in instead.",
        code: 'user_exists',
        operation,
        shouldShowToast: true,
        toastType: 'error'
      }
    };
  }
  
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
  
  // Check for Firebase auth errors and provide more user-friendly messages
  let message = error.message || `${operation} failed`;
  let code = error.code || 'unknown';
  
  // Map Firebase auth error codes to user-friendly messages
  if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
    message = 'Invalid email or password. Please check your credentials and try again.';
    code = 'invalid_credentials';
  } else if (error.code === 'auth/email-already-in-use') {
    message = 'This email is already in use. Please try logging in instead.';
    code = 'email_in_use';
  } else if (error.code === 'auth/weak-password') {
    message = 'Password is too weak. Please use a stronger password.';
    code = 'weak_password';
  } else if (error.code === 'auth/network-request-failed') {
    message = 'Network error. Please check your connection and try again.';
    code = 'network_error';
  } else if (error.code === 'auth/too-many-requests') {
    message = 'Too many unsuccessful login attempts. Please try again later.';
    code = 'too_many_attempts';
  }
  
  return {
    success: false,
    error: {
      message,
      code,
      operation,
      shouldShowToast: operation === 'signUp' || operation === 'signIn'
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
    const response = await apiClient.post(API.USERS, userData);
    const apiResponse = { success: true, data: response.data };
    
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
    const firebaseResponse = await signInWithEmailAndPassword(auth, email, password);

    await setAuthCookies(firebaseResponse.user);

    return {
      success: true,
      data: {
        user: {
          uid: firebaseResponse.user.uid,
          email: firebaseResponse.user.email,
          emailVerified: firebaseResponse.user.emailVerified,
        },
      },
    };
  } catch (error) {
    let message = "An error occurred during sign-in.";

    if (error.code === "auth/invalid-credential") {
      message = "Invalid email or password.";
    } else if (error.code === "auth/user-disabled") {
      message = "This user account has been disabled.";
    } else if (error.code === "auth/too-many-requests") {
      message = "Too many unsuccessful login attempts. Please try again later.";
    }

    return {
      success: false,
      error: {
        code: error.code,
        message,
      },
    };
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