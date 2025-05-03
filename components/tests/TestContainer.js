import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingSpinner from '../ui/LoadingSpinner';
import TestAttemptView from './TestAttemptView';
import TestResultsView from './TestResultsView';
import { getTestAttempt, getTestDetails } from '../../lib/client/testService';
import useToast from '../../hooks/useToast';

/**
 * Container component for test content with data fetching and state management
 * Handles loading states, errors, and determines whether to show test or results
 */
const TestContainer = ({
  attemptId,
  mode,
  isAuthenticated,
  hasAuthToken,
  authLoading,
  user,
  onTestDataLoaded,
  testTitle,
  initialTestAttempt = null
}) => {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  
  // State
  const [isLoading, setIsLoading] = useState(!initialTestAttempt);
  const [test, setTest] = useState(initialTestAttempt?.test || null);
  const [testAttempt, setTestAttempt] = useState(initialTestAttempt || null);
  const [questions, setQuestions] = useState(initialTestAttempt?.questions || []);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Indicate when component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch test data if we don't have initialTestAttempt or if we need to refresh
  useEffect(() => {
    // Don't attempt to fetch data if auth is still loading or we don't have params yet
    if (!attemptId || authLoading || (!isAuthenticated && !hasAuthToken)) return;
    
    // Skip fetching if we already have initialTestAttempt and this is initial mount
    if (initialTestAttempt && !isMounted) return;
    
    const fetchTestData = async () => {
      setIsLoading(true);
      try {
        // Get test attempt data if not provided by server
        let attemptData = initialTestAttempt;
        
        if (!attemptData) {
          const attemptResponse = await getTestAttempt(attemptId);
          if (!attemptResponse.success) {
            throw new Error(attemptResponse.error?.message || 'Failed to load test attempt');
          }
          
          attemptData = attemptResponse.data;
          
          // Check if test belongs to current user (if we have user info)
          if (user?.uid && attemptData.user_id && 
              attemptData.user_id !== user.uid) {
            throw new Error('You do not have permission to access this test');
          }
          
          // Set the test attempt data
          setTestAttempt(attemptData);
        }
        
        // Only fetch test details and questions if not already loaded
        if (!test || !questions.length) {
          // Get test details and questions using the test_id from the attempt
          const testId = attemptData.test_id;
          
          if (!testId) {
            throw new Error('Invalid test attempt: no test ID found');
          }
          
          const testResponse = await getTestDetails(testId);
          if (!testResponse.success) {
            throw new Error(testResponse.error?.message || 'Failed to load test details');
          }
          
          setTest(testResponse.data.test);
          setQuestions(testResponse.data.questions || []);
          
          // Pass test data to parent for title update
          if (typeof onTestDataLoaded === 'function') {
            onTestDataLoaded(testResponse.data.test);
          }
        }
      } catch (error) {
        console.error('Error loading test data:', error);
        setError(error.message || 'Error loading test data');
        showError(error.message || 'Error loading test data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestData();
  }, [attemptId, router, showError, isAuthenticated, authLoading, user, hasAuthToken, onTestDataLoaded, initialTestAttempt, isMounted, test, questions]);

  // Handle server-side rendering to avoid hydration errors
  if (!isMounted) {
    // Show static loading UI that matches what will be shown client-side
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="rounded-full border-t-transparent border-blue-500 h-12 w-12 border-4" />
        </div>
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
  
  // Check if test is completed based on attempt status
  const isCompleted = testAttempt?.status === 'completed';
  
  // Get current test title
  const currentTestTitle = test?.title || testTitle || 'Take Test';
  
  // Render based on test status
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {isCompleted ? (
        // Display test results if completed 
        <TestResultsView 
          testAttempt={testAttempt}
          test={test}
          questions={questions}
          mode={testAttempt?.mode || mode}
          showSuccess={showSuccess}
          showError={showError}
          testTitle={currentTestTitle}
          attemptId={attemptId}
        />
      ) : (
        // Display test questions if in progress
        <TestAttemptView 
          testAttempt={testAttempt}
          test={test}
          questions={questions}
          mode={testAttempt?.mode || mode}
          attemptId={attemptId}
          showSuccess={showSuccess}
          showError={showError}
          testTitle={currentTestTitle}
        />
      )}
    </div>
  );
};

export default TestContainer;
