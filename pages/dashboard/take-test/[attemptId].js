import { useState } from 'react';
import { useRouter } from 'next/router';
import { getTestLayout } from '../../../components/layouts/TestLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { getStoredAuthToken } from '../../../utils/services/authService';

// Components
import AuthStateHandler from '../../../components/tests/AuthStateHandler';
import TestContainer from '../../../components/tests/TestContainer';

// Server-side imports
import { getTestAttempt } from '../../../lib/server/testService';

/**
 * Test Attempt Page - Handles both test taking and results viewing
 * This page uses the test attempt ID from the URL and mode from query parameter
 */
export default function TakeTest({ initialTestAttempt, error }) {
  const router = useRouter();
  const { attemptId } = router.query;
  const mode = router.query.mode || 'practice'; // Default to practice mode if not specified
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [testTitle, setTestTitle] = useState(initialTestAttempt?.test?.title || 'Take Test');
  
  // Verify authentication token is present
  const hasAuthToken = !!getStoredAuthToken();

  // Update page title based on test data
  const updatePageTitle = (testData) => {
    if (testData?.title) {
      setTestTitle(testData.title);
    }
  };

  // If there was an error fetching the initial test attempt, show error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Test</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard/tests')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthStateHandler
      authLoading={authLoading}
      isAuthenticated={isAuthenticated}
      hasAuthToken={hasAuthToken}
    >
      <TestContainer
        attemptId={attemptId}
        mode={mode}
        isAuthenticated={isAuthenticated}
        hasAuthToken={hasAuthToken}
        authLoading={authLoading}
        user={user}
        onTestDataLoaded={updatePageTitle}
        testTitle={testTitle}
        initialTestAttempt={initialTestAttempt}
      />
    </AuthStateHandler>
  );
}

/**
 * Server-side data fetching for the test attempt page
 * This moves API calls to the server, reducing client-side network requests
 */
export async function getServerSideProps(context) {
  const { attemptId } = context.params;
  
  // Get the auth token from cookies
  const token = context.req.cookies.auth_token;
  
  // If no token is available, redirect to login
  if (!token) {
    return {
      redirect: {
        destination: '/login?returnUrl=/dashboard/tests',
        permanent: false,
      }
    };
  }
  
  try {
    // Fetch test attempt data server-side
    const response = await getTestAttempt(token, attemptId);
    
    if (!response.success) {
      // Handle error case
      return {
        props: {
          initialTestAttempt: null,
          error: response.error.message || 'Failed to load test attempt'
        }
      };
    }
    
    // Return the test attempt data as props
    return {
      props: {
        initialTestAttempt: response.data,
        error: null
      }
    };
  } catch (error) {
    console.error('Error fetching test attempt:', error);
    return {
      props: {
        initialTestAttempt: null,
        error: 'An unexpected error occurred while loading the test'
      }
    };
  }
}

// Use the test-specific layout instead of dashboard layout
TakeTest.getLayout = (page) => getTestLayout(page, { title: 'Take Test' });
