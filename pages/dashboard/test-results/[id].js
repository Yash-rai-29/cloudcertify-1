import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { format } from 'date-fns';
import { 
  IconShare2, 
  IconArrowRight, 
  IconCalendar, 
  IconCheck, 
  IconX, 
  IconClock, 
  IconFileAnalytics, 
  IconArrowLeft
} from '@tabler/icons-react';

import { getDashboardLayout } from '../../../components/layouts/DashboardLayout';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { getTestAttemptDetails } from '../../../utils/services/testLibraryService';
import useToast from '../../../hooks/useToast';

// Import our modular components
import TestResultsHeader from '../../../components/tests/results/TestResultsHeader';
import TestScoreSummary from '../../../components/tests/results/TestScoreSummary';
import QuestionsResultsList from '../../../components/tests/results/QuestionsResultsList';

/**
 * Test Results Page
 * 
 * Displays the results of a completed test attempt including score, questions, and answers
 */
export default function TestResults() {
  const router = useRouter();
  const { id: attemptId } = router.query;
  const { error, success } = useToast();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [testResults, setTestResults] = useState(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  
  // Load test results
  useEffect(() => {
    if (!attemptId) return;
    
    const fetchTestResults = async () => {
      setIsLoading(true);
      try {
        const response = await getTestAttemptDetails(attemptId);
        if (response.success) {
          setTestResults(response.data);
        } else {
          error('Failed to load test results');
          router.push('/dashboard/tests');
        }
      } catch (err) {
        console.error('Error loading test results:', err);
        error('An error occurred while loading the test results');
        router.push('/dashboard/tests');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestResults();
  }, [attemptId, router, error]);
  
  // Handle share results
  const handleShare = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: `${testResults.test_title} Results`,
        text: `Check out my results for ${testResults.test_title}! I scored ${formatPercentage(testResults.score)}%`,
        url: url,
      }).catch((err) => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        success('Link copied to clipboard');
      }).catch((err) => {
        console.error('Error copying link:', err);
        error('Failed to copy link');
      });
    }
  };
  
  // Format percentage for display
  const formatPercentage = (value) => {
    if (typeof value !== 'number') return '0';
    return Math.round(value * 100);
  };
  
  // Format time taken
  const formatTimeTaken = (seconds) => {
    if (!seconds) return '0s';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    } else if (remainingSeconds === 0) {
      return `${minutes}m`;
    } else {
      return `${minutes}m ${remainingSeconds}s`;
    }
  };
  
  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = new Date(timestamp * 1000);
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
        </div>
      </div>
    );
  }
  
  // Error or no test results
  if (!testResults) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Results Not Available</h2>
          <p className="text-gray-500 mb-4">We couldn't find the test results you're looking for.</p>
          <Button onClick={() => router.push('/dashboard/tests')}>Return to Tests</Button>
        </div>
      </div>
    );
  }
  
  // Empty attempted and unattempted arrays prevention
  const attemptedQuestions = testResults.attempted_questions || [];
  const unattemptedQuestions = testResults.unattempted_questions || [];
  
  return (
    <>
      <Head>
        <title>{testResults.test_title} Results | Cloud Certify</title>
      </Head>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <TestResultsHeader 
          testResults={testResults} 
          formatDate={formatDate} 
          onShare={handleShare} 
        />
        
        {/* Score Summary Section */}
        <TestScoreSummary 
          testResults={testResults} 
          formatTimeTaken={formatTimeTaken}
          formatPercentage={formatPercentage}
        />
        
        {/* Questions Results List Section */}
        <QuestionsResultsList 
          attemptedQuestions={attemptedQuestions}
          unattemptedQuestions={unattemptedQuestions}
          formatTimeTaken={formatTimeTaken}
          showAllQuestions={showAllQuestions}
          setShowAllQuestions={setShowAllQuestions}
        />
        
        {/* Actions Section */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mt-6">
          <Button
            variant="outline"
            size="md"
            onClick={() => router.push('/dashboard/tests')}
          >
            Back to Tests
          </Button>
          
          <Button
            size="md"
            onClick={() => router.push(`/dashboard/tests?practice=${testResults.test_id}`)}
            className="flex items-center"
          >
            Practice Again
            <IconArrowRight size={18} className="ml-1" />
          </Button>
        </div>
      </div>
    </>
  );
}

TestResults.getLayout = getDashboardLayout;
