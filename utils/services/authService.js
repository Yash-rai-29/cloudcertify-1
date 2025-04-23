import { apiRequest } from './api';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase';
import Cookies from 'js-cookie';

/**
 * Sign up a new user
 * Endpoint: /b/manage_user/users
 * @param {Object} userData - User sign up data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.first_name - User first name
 * @param {string} userData.last_name - User last name
 * @param {string} userData.certification_target - GCP certification target
 */
export const signUp = async (userData) => {
  try {
    // Step 1: Create user via API
    const apiResponse = await apiRequest('post', '/b/manage_user/users', userData);
    
    if (!apiResponse.success) {
      throw new Error(apiResponse.error.message);
    }
    
    // Step 2: Create user in Firebase
    const { email, password } = userData;
    const firebaseResponse = await createUserWithEmailAndPassword(auth, email, password);
    
    // Step 3: Get Firebase token
    const token = await firebaseResponse.user.getIdToken();
    Cookies.set('auth_token', token, { expires: 7 });
    
    // Return combined data
    return {
      success: true,
      data: {
        ...apiResponse.data,
        firebaseUser: firebaseResponse.user
      }
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code
      }
    };
  }
};

/**
 * Sign in existing user
 * @param {string} email - User email
 * @param {string} password - User password
 */
export const signIn = async (email, password) => {
  try {
    // Authenticate with Firebase
    const response = await signInWithEmailAndPassword(auth, email, password);
    
    // Get token and store in cookies
    const token = await response.user.getIdToken();
    Cookies.set('auth_token', token, { expires: 7 });
    
    return {
      success: true,
      data: {
        user: response.user
      }
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code
      }
    };
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    
    // Open Google sign-in popup
    const response = await signInWithPopup(auth, provider);
    
    // Get token and store in cookies
    const token = await response.user.getIdToken();
    Cookies.set('auth_token', token, { expires: 7 });
    
    return {
      success: true,
      data: {
        user: response.user
      }
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code
      }
    };
  }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    await auth.signOut();
    Cookies.remove('auth_token');
    
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code
      }
    };
  }
};

/**
 * Reset password
 * @param {string} email - User email
 */
export const resetPassword = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
    
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code
      }
    };
  }
};