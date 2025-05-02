import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getDashboardLayout } from '../../../components/layouts/DashboardLayout';
import useToast from '../../../hooks/useToast';
import { getTestAttempt, getTestDetails } from '../../../utils/services/testLibraryService';
import TestAttemptView from '../../../components/tests/TestAttemptView';
import TestResultsView from '../../../components/tests/TestResultsView';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { useAuth } from '../../../contexts/AuthContext';
import { getStoredAuthToken } from '../../../utils/services/authService';

/**
 * Test Attempt Page - Handles both test taking and results viewing
 * This page uses the test attempt ID from the URL and mode from query parameter
 */
export default function TakeTest() {
  const router = useRouter();
  const { attemptId } = router.query;
  const mode = router.query.mode || 'practice'; // Default to practice mode if not specified
  const { showSuccess, showError } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [testAttempt, setTestAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  // Verify authentication token is present
  const hasAuthToken = !!getStoredAuthToken();

  // Redirect if not authenticated
  useEffect(() => {
    // Only redirect if we're sure authentication has been checked and failed
    if (!authLoading && !isAuthenticated && !hasAuthToken) {
      router.replace('/login?redirect=' + encodeURIComponent(router.asPath));
    }
  }, [authLoading, isAuthenticated, hasAuthToken, router]);

  // Fetch test data
  useEffect(() => {
    // Don't attempt to fetch data if auth is still loading or we don't have params yet
    if (!attemptId || authLoading || (!isAuthenticated && !hasAuthToken)) return;
    
    const fetchTestData = async () => {
      setIsLoading(true);
      try {
        // Get test attempt data
        const attemptResponse = await getTestAttempt(attemptId);
        if (!attemptResponse.success) {
          throw new Error('Failed to load test attempt');
        }
        
        // Check if test belongs to current user (if we have user info)
        if (user?.uid && attemptResponse.data.user_id && 
            attemptResponse.data.user_id !== user.uid) {
          throw new Error('You do not have permission to access this test');
        }
        
        // Set the test attempt data
        setTestAttempt(attemptResponse.data);
        
        // Get test details and questions using the test_id from the attempt
        const testId = attemptResponse.data.test_id;
        
        if (!testId) {
          throw new Error('Invalid test attempt: no test ID found');
        }
        
        const testResponse = await getTestDetails(testId);
        if (!testResponse.success) {
          throw new Error('Failed to load test details');
        }
        
        setTest(testResponse.data.test);
        setQuestions(testResponse.data.questions || []);
        
      } catch (error) {
        console.error('Error loading test data:', error);
        setError(error.message || 'Error loading test data');
        showError(error.message || 'Error loading test data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestData();
  }, [attemptId, router, showError, isAuthenticated, authLoading, user, hasAuthToken]);

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

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading test..." />
      </div>
    );
  }

  // Show error if there was a problem
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-lg font-medium text-red-700 mb-3">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => router.push('/dashboard/tests')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Test Library
          </button>
        </div>
      </div>
    );
  }
  
  // Render based on test status
  return (
    <div className="container mx-auto px-4 py-8">
      {testAttempt?.status === 'completed' ? (
        // Display test results if completed
        <TestResultsView 
          testAttempt={testAttempt}
          test={test}
          questions={questions}
          mode={mode}
        />
      ) : (
        // Display test questions if in progress
        <TestAttemptView 
          testAttempt={testAttempt}
          test={test}
          questions={questions}
          mode={mode}
          attemptId={attemptId}
        />
      )}
    </div>
  );
}

TakeTest.getLayout = getDashboardLayout;
