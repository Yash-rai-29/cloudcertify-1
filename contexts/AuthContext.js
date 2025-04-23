import { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged } from '../utils/firebase';
import { useRouter } from 'next/router';
import { 
  signUp as apiSignUp, 
  signIn as apiSignIn, 
  signInWithGoogle as apiSignInWithGoogle,
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
  signInWithGoogle: async () => {},
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
    setError(errorResponse.error || { message: 'An unexpected error occurred' });
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
   * 
   * @param {Object} userData - User registration data
   */
  const signUp = async (userData) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await apiSignUp(userData);
      
      if (response.success) {
        handleAuthSuccess(response);
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
   * Sign in existing user
   * 
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const signIn = async (email, password) => {
    setLoading(true);
    clearError();
    
    try {
      const response = await apiSignIn(email, password);
      
      if (response.success) {
        handleAuthSuccess(response);
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
   * Sign in with Google
   */
  const signInWithGoogle = async () => {
    setLoading(true);
    clearError();
    
    try {
      const response = await apiSignInWithGoogle();
      
      if (response.success) {
        handleAuthSuccess(response);
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
   * Sign out current user
   */
  const signOut = async () => {
    setLoading(true);
    clearError();
    
    try {
      const response = await apiSignOut();
      
      if (response.success) {
        // User state will be updated by the auth state listener
        setLoading(false);
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
    signInWithGoogle,
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