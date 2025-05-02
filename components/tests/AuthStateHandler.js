import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * Component to handle authentication state and redirects
 * Returns appropriate loading/redirect UI based on auth state
 */
const AuthStateHandler = ({
  authLoading,
  isAuthenticated,
  hasAuthToken,
  children
}) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state on client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    // Only redirect if we're sure authentication has been checked and failed
    if (!authLoading && !isAuthenticated && !hasAuthToken && isMounted) {
      router.replace('/login?redirect=' + encodeURIComponent(router.asPath));
    }
  }, [authLoading, isAuthenticated, hasAuthToken, router, isMounted]);

  // Server-side safe rendering to avoid hydration errors
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="animate-spin rounded-full border-t-transparent border-blue-500 h-12 w-12 border-4" />
        </div>
      </div>
    );
  }

  // Handle authentication loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Verifying authentication..." />
      </div>
    );
  }

  // Redirect if not authenticated (handled by useEffect)
  if (!isAuthenticated && !hasAuthToken && !authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Redirecting to login..." />
      </div>
    );
  }

  // Render children if authenticated
  return children;
};

export default AuthStateHandler;
