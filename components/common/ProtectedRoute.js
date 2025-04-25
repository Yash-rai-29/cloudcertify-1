import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { showError } from '../../utils/toast';
import { AUTH } from '../../utils/constants';

/**
 * ProtectedRoute component to wrap authenticated pages
 * Handles authentication checks, token expiration, and redirects
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 */
export default function ProtectedRoute({ children }) {
  const { user, loading, error } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  
  useEffect(() => {
    // If there's an authentication error, show a toast message
    if (error && error.code === 'session_expired') {
      showError(error.message || 'Your session has expired. Please log in again.');
    }
  }, [error]);
  
  useEffect(() => {
    // Skip redirect logic if still loading or already redirecting
    if (loading || redirecting) return;
    
    // If no user is authenticated after loading is complete, redirect to login
    if (!user) {
      setRedirecting(true);
      
      const handleRedirect = async () => {
        // Check if we're not already on the login page to avoid redirect loops
        if (!router.pathname.includes(AUTH.ROUTES.LOGIN)) {
          await router.push({
            pathname: AUTH.ROUTES.LOGIN,
            query: { returnUrl: router.asPath !== '/' ? router.asPath : undefined }
          });
        }
      };
      
      handleRedirect();
    }
  }, [user, loading, router, redirecting]);
  
  // Show loading state while auth is being checked or during redirect
  if (loading || redirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 text-sm">{redirecting ? 'Redirecting to login...' : 'Checking authentication...'}</p>
      </div>
    );
  }
  
  // Only render children if user is authenticated
  return user ? children : null;
}