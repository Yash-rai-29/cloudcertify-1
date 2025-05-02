import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getTestLayout } from '../../../components/layouts/TestLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { getStoredAuthToken } from '../../../utils/services/authService';

// Components
import AuthStateHandler from '../../../components/tests/AuthStateHandler';
import TestContainer from '../../../components/tests/TestContainer';

/**
 * Test Attempt Page - Handles both test taking and results viewing
 * This page uses the test attempt ID from the URL and mode from query parameter
 */
export default function TakeTest() {
  const router = useRouter();
  const { attemptId } = router.query;
  const mode = router.query.mode || 'practice'; // Default to practice mode if not specified
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [testTitle, setTestTitle] = useState('Take Test');
  
  // Verify authentication token is present
  const hasAuthToken = !!getStoredAuthToken();

  // Update page title based on test data
  const updatePageTitle = (testData) => {
    if (testData?.title) {
      setTestTitle(testData.title);
    }
  };

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
      />
    </AuthStateHandler>
  );
}

// Use the test-specific layout instead of dashboard layout
TakeTest.getLayout = (page) => getTestLayout(page, { title: 'Take Test' });
