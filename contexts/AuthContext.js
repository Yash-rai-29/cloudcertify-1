import { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged } from '../utils/firebase';
import { useRouter } from 'next/router';
import { 
  signUp as apiSignUp, 
  signIn as apiSignIn,
  signOut as apiSignOut,
  resetPassword as apiResetPassword
} from '../utils/services/authService';
import { AUTH } from '../utils/constants';

/**
 * Default context state
 */
const defaultContextState = {
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  clearError: () => {}
};

// Create Auth Context
const AuthContext = createContext(defaultContextState);

/**
 * Authentication Provider component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  // State for auth data and status
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  /**
   * Clear any authentication errors
   */
  const clearError = () => setError(null);

  /**
   * Set authentication error from failed operations
   * 
   * @param {Object} errorResponse - Error response from auth service
   */
  const handleAuthError = (errorResponse) => {
    console.error('Authentication error:', errorResponse);
    
    // Check if the errorResponse is a direct Firebase error
    if (errorResponse.code && errorResponse.code.startsWith('auth/')) {
      // Format Firebase auth error codes for better display
      let formattedError;
      
      // Map Firebase error codes to user-friendly messages
      switch (errorResponse.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          formattedError = { 
            message: 'Invalid email or password. Please try again.',
            code: 'invalid_credentials',
            shouldShowToast: true
          };
          break;
        case 'auth/email-already-in-use':
          formattedError = { 
            message: 'This email is already in use. Please try logging in instead.',
            code: 'email_in_use',
            shouldShowToast: true
          };
          break;
        case 'auth/weak-password':
          formattedError = { 
            message: 'Password is too weak. Please use a stronger password.',
            code: 'weak_password'
          };
          break;
        case 'auth/network-request-failed':
          formattedError = { 
            message: 'Network error. Please check your connection and try again.',
            code: 'network_error',
            shouldShowToast: true
          };
          break;
        case 'auth/too-many-requests':
          formattedError = { 
            message: 'Too many unsuccessful login attempts. Please try again later.',
            code: 'too_many_attempts',
            shouldShowToast: true
          };
          break;
        case 'auth/user-disabled':
          formattedError = { 
            message: 'This account has been disabled. Please contact support.',
            code: 'account_disabled',
            shouldShowToast: true
          };
          break;
        default:
          formattedError = {
            message: errorResponse.message || 'An authentication error occurred',
            code: errorResponse.code,
            shouldShowToast: true
          };
      }
      
      setError(formattedError);
    } else {
      // Handle errors from our API service
      setError(errorResponse.error || { message: 'An unexpected error occurred' });
    }
    
    setLoading(false);
  };

  /**
   * Handle successful authentication
   * 
   * @param {Object} response - Success response from auth service
   */
  const handleAuthSuccess = (response) => {
    clearError();
    // User will be set by the onAuthStateChanged listener
    setLoading(false);
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: user.photoURL,
        });
        
        // TODO: Fetch user profile from API if needed
        // const profileResponse = await getUserProfile();
        // if (profileResponse.success) {
        //   setUserProfile(profileResponse.data);
        // }
      } else {
        // User is signed out
        setUser(null);
        setUserProfile(null);
        
        // Redirect to login if on protected route
        const isProtectedRoute = AUTH.ROUTES.PROTECTED_ROUTES.some(route => 
          router.pathname === route || router.pathname.startsWith(`${route}/`)
        );
        
        if (isProtectedRoute) {
          router.push(AUTH.ROUTES.LOGIN);
        }
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  /**
   * Sign up a new user
   * Creates user via FastAPI and then authenticates with Firebase
   * 
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Sign up result
   */
  const signUp = async (userData) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await apiSignUp(userData);
      
      if (response.success) {
        handleAuthSuccess(response);
        router.push(AUTH.ROUTES.DASHBOARD);
        return response;
      } else {
        // Check for "User already exists" error which should be handled specially
        if (response.code === 'user_exists' || response.error?.code === 'user_exists') {
          const errorObj = {
            message: response.message || response.error?.message || 'A user with this email already exists. Please try logging in instead.',
            code: 'user_exists',
            shouldShowToast: true
          };
          setError(errorObj);
          setLoading(false);
          return { success: false, error: errorObj };
        } else {
          handleAuthError(response);
          return response;
        }
      }
    } catch (error) {
      // If it's a Firebase auth error, pass it directly to handleAuthError
      if (error.code && error.code.startsWith('auth/')) {
        handleAuthError(error);
        // Create a standardized error response
        return { 
          success: false, 
          error: {
            message: error.message,
            code: error.code,
            shouldShowToast: true
          }
        };
      } else {
        // Handle other errors
        handleAuthError({ error: { message: error.message } });
        return { success: false, error: { message: error.message } };
      }
    }
  };

  /**
   * Sign in existing user with email and password
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - Sign in result
   */
  const signIn = async (email, password) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await apiSignIn(email, password);
      
      if (response.success) {
        handleAuthSuccess(response);
        router.push(AUTH.ROUTES.DASHBOARD);
        return response;
      } else {
        // Check for special error handling cases
        if (response.shouldShowToast || response.error?.shouldShowToast) {
          const errorObj = {
            message: response.message || response.error?.message || 'Failed to log in. Please check your credentials.',
            code: response.code || response.error?.code || 'auth_error',
            shouldShowToast: true
          };
          setError(errorObj);
          setLoading(false);
          return { success: false, error: errorObj };
        } else {
          handleAuthError(response);
          return response;
        }
      }
    } catch (error) {
      // If it's a Firebase auth error, pass it directly to handleAuthError
      if (error.code && error.code.startsWith('auth/')) {
        handleAuthError(error);
        // Create a standardized error response
        return { 
          success: false, 
          error: {
            message: error.message,
            code: error.code,
            shouldShowToast: true
          }
        };
      } else {
        // Handle other errors
        handleAuthError({ error: { message: error.message } });
        return { success: false, error: { message: error.message } };
      }
    }
  };

  /**
   * Sign out current user
   * 
   * @returns {Promise<Object>} - Sign out result
   */
  const signOut = async () => {
    setLoading(true);
    clearError();
    
    try {
      const response = await apiSignOut();
      
      if (response.success) {
        // User state will be updated by the auth state listener
        setLoading(false);
        router.push('/');
        return response;
      } else {
        handleAuthError(response);
        return response;
      }
    } catch (error) {
      handleAuthError({ error: { message: error.message } });
      return { success: false, error: { message: error.message } };
    }
  };

  /**
   * Reset user password
   * 
   * @param {string} email - User email
   * @returns {Promise<Object>} - Password reset result
   */
  const resetPassword = async (email) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await apiResetPassword(email);
      
      if (response.success) {
        setLoading(false);
        clearError();
        return response;
      } else {
        handleAuthError(response);
        return response;
      }
    } catch (error) {
      handleAuthError({ error: { message: error.message } });
      return { success: false, error: { message: error.message } };
    }
  };

  // Context value
  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use auth context
 * 
 * @returns {Object} Auth context value
 * @throws {Error} When used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}