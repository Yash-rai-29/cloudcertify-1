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
    
    // Check if this is a session expiration error
    if (errorResponse.code === 'session_expired' || errorResponse.error?.code === 'session_expired') {
      const formattedError = {
        message: 'Your session has expired. Please log in again.',
        code: 'session_expired',
        shouldShowToast: true
      };
      setError(formattedError);
      
      // Redirect to login with the appropriate parameters
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const returnUrl = currentPath !== '/' && !currentPath.includes('/login') ? 
                       currentPath : undefined;
      
      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
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
    // Check if the errorResponse is a direct Firebase error
    else if (errorResponse.code && errorResponse.code.startsWith('auth/')) {
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
        // Handle token expiration errors from Firebase
        case 'auth/id-token-expired':
        case 'auth/id-token-revoked':
          formattedError = { 
            message: 'Your session has expired. Please log in again.',
            code: 'session_expired',
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
        try {
          // Check token validity
          const tokenResult = await user.getIdTokenResult(true);
          
          // Check if token is close to expiration (within 5 minutes)
          const expirationTime = new Date(tokenResult.expirationTime).getTime();
          const currentTime = Date.now();
          const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
          
          if (expirationTime - currentTime < fiveMinutes) {
            // Token is about to expire, try to refresh it
            try {
              await user.getIdToken(true); // Force token refresh
              console.log('Token refreshed successfully');
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError);
              // Handle failed token refresh
              const errorObj = {
                message: 'Your session is about to expire and could not be refreshed. Please log in again.',
                code: 'session_expiring',
                shouldShowToast: true
              };
              setError(errorObj);
            }
          }
          
          // User is signed in and token is valid
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            // Add token expiration information
            tokenExpiration: tokenResult.expirationTime
          });
          
          // TODO: Fetch user profile from API if needed
          // const profileResponse = await getUserProfile();
          // if (profileResponse.success) {
          //   setUserProfile(profileResponse.data);
          // }
        } catch (tokenError) {
          console.error('Error checking token validity:', tokenError);
          
          // Handle token validation errors
          if (tokenError.code === 'auth/id-token-expired' || 
              tokenError.code === 'auth/id-token-revoked') {
            // Handle expired or revoked tokens
            const errorObj = {
              message: 'Your session has expired. Please log in again.',
              code: 'session_expired',
              shouldShowToast: true
            };
            setError(errorObj);
            
            // Sign out and force redirect
            try {
              await auth.signOut();
            } catch (signOutError) {
              console.error('Error signing out user after token expired:', signOutError);
            }
            
            // Redirect with query parameters for session expiration
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
            const returnUrl = currentPath !== '/' && !currentPath.includes('/login') ? 
                           currentPath : undefined;
                           
            if (typeof window !== 'undefined') {
              let redirectUrl = AUTH.ROUTES.LOGIN;
              const params = new URLSearchParams();
              if (returnUrl) params.append('returnUrl', returnUrl);
              params.append('expired', 'true');
              
              if (params.toString()) {
                redirectUrl += `?${params.toString()}`;
              }
              
              // Force router push to login page with expired flag
              router.push(redirectUrl);
            }
          } else {
            // If some other token error, set user to signed in but mark error
            setUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              emailVerified: user.emailVerified,
              photoURL: user.photoURL,
            });
            
            setError({
              message: 'There was a problem with your session. Some features may be unavailable.',
              code: 'token_error',
              shouldShowToast: true
            });
          }
        }
      } else {
        // User is signed out
        setUser(null);
        setUserProfile(null);
        
        // Redirect to login if on protected route
        const isProtectedRoute = AUTH.ROUTES.PROTECTED_ROUTES.some(route => 
          router.pathname === route || router.pathname.startsWith(`${route}/`)
        );
        
        if (isProtectedRoute) {
          const returnUrl = router.asPath !== '/' ? router.asPath : undefined;
          
          // Build redirect URL
          let redirectUrl = AUTH.ROUTES.LOGIN;
          if (returnUrl) {
            const params = new URLSearchParams();
            params.append('returnUrl', returnUrl);
            redirectUrl += `?${params}`;
          }
          
          router.push(redirectUrl);
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
        
        // Check if there's a returnUrl to redirect to
        const returnUrl = router.query.returnUrl || AUTH.ROUTES.DASHBOARD;
        router.push(returnUrl);
        
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
        
        // Check if there's a returnUrl to redirect to
        const returnUrl = router.query.returnUrl || AUTH.ROUTES.DASHBOARD;
        router.push(returnUrl);
        
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