import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './ui/LoadingSpinner';

/**
 * ProtectedRoute component to wrap authenticated pages
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth is initialized (not loading) and there's no user, redirect to login
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Show loading spinner while loading or redirecting
  if (loading || (!user && router.pathname !== '/auth/login')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" text="Checking authentication..." />
      </div>
    );
  }

  // If user is authenticated, render children
  return children;
}