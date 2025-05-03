import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  IconCheck, 
  IconX, 
  IconClock, 
  IconArrowRight,
  IconArrowLeft,
  IconRefresh,
  IconChartBar,
  IconClipboardList,
  IconCheckCircle
} from '@tabler/icons-react';
import Button from '../ui/Button';

/**
 * Test Results View component for displaying test results after completion
 */
export default function TestResultsView({ testAttempt, test, questions, mode, showSuccess, showError, testTitle, attemptId }) {
  const router = useRouter();
  const [showQuestionDetails, setShowQuestionDetails] = useState(false);
  
  console.log("Test attempt data:", testAttempt);
  console.log("Test data:", test);
  console.log("Questions data:", questions);
  
  // Basic validation - return early if we don't have required data
  if (!testAttempt || !test) {
    return <div className="text-center py-10 bg-white rounded-lg shadow-md">No results available</div>;
  }
  
  // Safely extract basic data with fallbacks
  const score = testAttempt.score || 0;
  const correctAnswers = testAttempt.correct_answers || 0;
  const wrongAnswers = testAttempt.wrong_answers || 0;
  const title = test.title || testTitle || 'Test';
  const totalQuestions = testAttempt.total_questions || questions.length || 0;
  
  // Handle attempted questions count safely
  let attemptedCount = 0;
  
  // Calculate based on the data we have
  if (Array.isArray(testAttempt.attempted_questions)) {
    attemptedCount = testAttempt.attempted_questions.length;
  } else if (typeof correctAnswers === 'number' && typeof wrongAnswers === 'number') {
    attemptedCount = correctAnswers + wrongAnswers;
  }
  
  // Simple toggle function
  const toggleDetails = () => setShowQuestionDetails(!showQuestionDetails);
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8 bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <IconCheck className="text-blue-600" size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Test Completed!</h1>
        <p className="text-gray-600">
          You completed <span className="font-medium">{title}</span> in {testAttempt.mode || mode} mode
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Score Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-gray-500 mb-1">Score</p>
            <p className="text-3xl font-bold">{score}%</p>
          </div>
        </div>
        
        {/* Questions Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-gray-500 mb-1">Questions</p>
            <p className="text-3xl font-bold">{attemptedCount} / {totalQuestions}</p>
          </div>
        </div>
        
        {/* Accuracy Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center">
            <p className="text-gray-500 mb-1">Results</p>
            <div className="flex items-center justify-center space-x-4">
              <div>
                <span className="text-green-600 text-xl font-bold">{correctAnswers}</span>
                <span className="text-gray-500 text-sm block">Correct</span>
              </div>
              <div>
                <span className="text-red-600 text-xl font-bold">{wrongAnswers}</span>
                <span className="text-gray-500 text-sm block">Incorrect</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
        <Button 
          variant="primary"
          onClick={() => router.push(`/dashboard/test-results/${testAttempt.id || attemptId}`)}
        >
          View Detailed Results
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => router.push('/dashboard/tests')}
        >
          Take Another Test
        </Button>
      </div>
      
      {/* Bottom Navigation */}
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline"
          onClick={() => router.push('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
