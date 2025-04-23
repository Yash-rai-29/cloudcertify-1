import { apiRequest } from './api';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
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
 */
const setAuthCookies = async (user, expiryDays = 7) => {
  try {
    const token = await user.getIdToken();
    Cookies.set(AUTH.COOKIE_NAMES.AUTH_TOKEN, token, { expires: expiryDays });
    
    // Additional cookies can be set here as needed
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
  // Clear any other auth-related cookies here
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
 * Creates both API and Firebase accounts
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
    // Step 1: Create user via API
    const apiResponse = await apiRequest('post', API.ENDPOINTS.USERS, userData);
    
    if (!apiResponse.success) {
      throw new Error(apiResponse.message || 'API user creation failed');
    }
    
    // Step 2: Create user in Firebase
    const { email, password } = userData;
    const firebaseResponse = await createUserWithEmailAndPassword(auth, email, password);
    
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
 * Sign in existing user
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
    
    // Fetch user profile from API if needed
    // const userProfile = await apiRequest('get', API.ENDPOINTS.USER_ME);
    
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
 * Sign in with Google
 * 
 * @returns {Object} Sign in result
 */
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    // Open Google sign-in popup
    const firebaseResponse = await signInWithPopup(auth, provider);
    
    // Set auth cookies
    await setAuthCookies(firebaseResponse.user);
    
    // Check if user exists in our API or create one
    const userData = {
      email: firebaseResponse.user.email,
      first_name: firebaseResponse.user.displayName?.split(' ')[0] || '',
      last_name: firebaseResponse.user.displayName?.split(' ').slice(1).join(' ') || '',
      firebase_uid: firebaseResponse.user.uid,
      provider: 'google'
    };
    
    // Either check user exists or create new user in our API
    const userCheckResponse = await apiRequest('post', API.ENDPOINTS.CHECK_USER_EXISTS, { 
      email: userData.email 
    });
    
    if (!userCheckResponse.success || !userCheckResponse.data?.exists) {
      // User doesn't exist, create account in our API
      await apiRequest('post', API.ENDPOINTS.USERS, userData);
    }
    
    return {
      success: true,
      data: {
        user: {
          uid: firebaseResponse.user.uid,
          email: firebaseResponse.user.email,
          displayName: firebaseResponse.user.displayName,
        }
      }
    };
  } catch (error) {
    return createErrorResponse(error, 'signInWithGoogle');
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