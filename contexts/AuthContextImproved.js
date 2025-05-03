import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../utils/firebase';
import { useVerifyAuth, useUserSession } from '../hooks/useAuthQuery';
import { 
  setAuthToken,
  getStoredAuthToken,
  clearAuthToken,
  verifyAuth,
  getUserSession
} from '../lib/client/authService';
import { AUTH, ERRORS } from '../utils/constants';

/**
 * Default context state for authentication
 */
const defaultContextState = {
  user: null,
  userProfile: null,
  isAuthenticated: false,
  isLoading: true,
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
 * Authentication Provider that uses React Query for data fetching
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  
  // Track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(!!getStoredAuthToken());

  // Use React Query for auth verification
  const {
    data: authData,
    isLoading: isAuthLoading,
    isError: isAuthError,
    error: authError,
    refetch: refetchAuth
  } = useVerifyAuth({
    enabled: isAuthenticated,
    onError: (error) => {
      handleAuthError({ error: { message: error.message } });
    }
  });

  // Use React Query for user session data
  const {
    data: sessionData,
    isLoading: isSessionLoading,
    refetch: refetchSession
  } = useUserSession({
    enabled: isAuthenticated && !!authData,
    onError: (error) => {
      console.error('Session fetch error:', error);
    }
  });

  // Combined loading state
  const isLoading = isAuthLoading || isSessionLoading;

  /**
   * Clear any authentication errors
   */
  const clearError = useCallback(() => setError(null), []);

  /**
   * Handle Firebase authentication state changes
   */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setFirebaseUser(user);
        
        // Get a fresh token and set it in cookies
        try {
          const token = await user.getIdToken(true);
          setAuthToken(token);
          setIsAuthenticated(true);
          
          // Refresh auth and session data
          refetchAuth();
          refetchSession();
        } catch (error) {
          console.error('Error setting auth token:', error);
          setIsAuthenticated(false);
        }
      } else {
        // Clear user state when signed out
        setFirebaseUser(null);
        setIsAuthenticated(false);
        clearAuthToken();
      }
    });

    return () => unsubscribe();
  }, [refetchAuth, refetchSession]);

  /**
   * Handle authentication errors
   * 
   * @param {Object} errorResponse - Error response from auth service
   */
  const handleAuthError = useCallback((errorResponse) => {
    console.error('Authentication error:', errorResponse);
    
    // Check if this is a session expiration error
    if (
      errorResponse.code === 'session_expired' || 
      errorResponse.error?.code === 'session_expired'
    ) {
      const formattedError = {
        message: 'Your session has expired. Please log in again.',
        code: 'session_expired',
        shouldShowToast: true
      };
      setError(formattedError);
      
      // Handle session expiration
      clearAuthToken();
      setIsAuthenticated(false);
      
      // Only redirect if we're not already on the login page
      if (typeof window !== 'undefined' && !router.pathname.includes(AUTH.ROUTES.LOGIN)) {
        // Redirect to login with the appropriate parameters
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
        
        router.push(redirectUrl);
      }
    }
    // Handle Firebase auth errors
    else if (errorResponse.code && errorResponse.code.startsWith('auth/')) {
      // Map Firebase error codes to user-friendly messages
      let message;
      
      switch (errorResponse.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = ERRORS.AUTH.INVALID_CREDENTIALS;
          break;
        case 'auth/email-already-in-use':
          message = ERRORS.AUTH.EMAIL_IN_USE;
          break;
        case 'auth/weak-password':
          message = ERRORS.AUTH.WEAK_PASSWORD;
          break;
        case 'auth/invalid-email':
          message = ERRORS.AUTH.INVALID_EMAIL;
          break;
        case 'auth/too-many-requests':
          message = ERRORS.AUTH.TOO_MANY_REQUESTS;
          break;
        default:
          message = errorResponse.message || ERRORS.AUTH.GENERIC;
      }
      
      setError({
        message,
        code: errorResponse.code,
        shouldShowToast: true
      });
    }
    // Handle API error responses
    else if (errorResponse.error) {
      setError({
        message: errorResponse.error.message || ERRORS.AUTH.GENERIC,
        code: errorResponse.error.code || 'api_error',
        shouldShowToast: true
      });
    }
    // Handle other errors
    else {
      setError({
        message: ERRORS.AUTH.GENERIC,
        code: 'unknown_error',
        shouldShowToast: true
      });
    }
  }, [router]);

  /**
   * Sign up a new user
   * 
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Sign up result
   */
  const signUp = useCallback(async (userData) => {
    clearError();
    
    try {
      // Use Firebase for authentication
      const userCredential = await auth.createUserWithEmailAndPassword(
        userData.email,
        userData.password
      );
      
      if (userCredential.user) {
        // The auth state listener will handle setting the user state
        // and refreshing the auth token
        
        // Create user profile on server
        // This will happen via the auth token from Firebase
        
        // Redirect to dashboard or onboarding
        router.push(AUTH.ROUTES.DASHBOARD);
        
        return { 
          success: true, 
          user: userCredential.user 
        };
      }
    } catch (error) {
      handleAuthError(error);
      return { 
        success: false, 
        error: {
          message: error.message,
          code: error.code
        }
      };
    }
  }, [clearError, handleAuthError, router]);

  /**
   * Sign in existing user
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - Sign in result
   */
  const signIn = useCallback(async (email, password) => {
    clearError();
    
    try {
      // Use Firebase for authentication
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      
      if (userCredential.user) {
        // Get fresh token and store in cookie
        const token = await userCredential.user.getIdToken();
        setAuthToken(token);
        setIsAuthenticated(true);
        
        // Check if there's a returnUrl to redirect to
        const returnUrl = router.query.returnUrl || AUTH.ROUTES.DASHBOARD;
        router.push(returnUrl);
        
        return { 
          success: true, 
          user: userCredential.user 
        };
      }
    } catch (error) {
      handleAuthError(error);
      return { 
        success: false, 
        error: {
          message: error.message,
          code: error.code
        }
      };
    }
  }, [clearError, handleAuthError, router]);

  /**
   * Sign out current user
   * 
   * @returns {Promise<Object>} - Sign out result
   */
  const signOut = useCallback(async () => {
    clearError();
    
    try {
      await auth.signOut();
      clearAuthToken();
      setIsAuthenticated(false);
      
      // Redirect to home page
      router.push('/');
      
      return { success: true };
    } catch (error) {
      handleAuthError({ error: { message: error.message } });
      return { 
        success: false, 
        error: {
          message: error.message
        }
      };
    }
  }, [clearError, handleAuthError, router]);

  /**
   * Reset user password
   * 
   * @param {string} email - User email
   * @returns {Promise<Object>} - Password reset result
   */
  const resetPassword = useCallback(async (email) => {
    clearError();
    
    try {
      await auth.sendPasswordResetEmail(email);
      return { success: true };
    } catch (error) {
      handleAuthError(error);
      return { 
        success: false, 
        error: {
          message: error.message,
          code: error.code
        }
      };
    }
  }, [clearError, handleAuthError]);

  // Prepare context value
  const value = {
    user: firebaseUser,
    userProfile: sessionData?.user || null,
    isAuthenticated,
    isLoading,
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
 * Custom hook to use the authentication context
 * 
 * @returns {Object} Authentication context value
 * @throws {Error} When used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
