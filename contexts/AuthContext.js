import { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged } from '../utils/firebase';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

// Create Auth Context
const AuthContext = createContext({
  user: null,
  loading: true,
  error: null,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
  resetPassword: async () => {}
});

// AuthProvider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setUser(user);
        
        // Get Firebase token and store in cookies
        const token = await user.getIdToken();
        Cookies.set('auth_token', token, { expires: 7 });
      } else {
        // User is signed out
        setUser(null);
        Cookies.remove('auth_token');
        
        // Redirect to login if on protected route
        const protectedRoutes = ['/dashboard', '/profile'];
        const isProtectedRoute = protectedRoutes.some(route => 
          router.pathname === route || router.pathname.startsWith(`${route}/`)
        );
        
        if (isProtectedRoute) {
          router.push('/login');
        }
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [router]);

  // Auth methods (these will be implemented with actual service calls)
  const signUp = async (userData) => {
    setError(null);
    // This will be implemented with actual auth service
    console.log('Sign up with data:', userData);
  };

  const signIn = async (email, password) => {
    setError(null);
    // This will be implemented with actual auth service
    console.log('Sign in with:', email, password);
  };

  const signInWithGoogle = async () => {
    setError(null);
    // This will be implemented with actual auth service
    console.log('Sign in with Google');
  };

  const signOut = async () => {
    setError(null);
    // This will be implemented with actual auth service
    console.log('Sign out');
  };

  const resetPassword = async (email) => {
    setError(null);
    // This will be implemented with actual auth service
    console.log('Reset password for:', email);
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}