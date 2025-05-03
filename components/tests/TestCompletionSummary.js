import { IconChartBar, IconCheckCircle, IconXCircle, IconClipboardList } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import Button from '../ui/Button';

/**
 * Displays a summary of test results after completion
 */
const TestCompletionSummary = ({
  attemptId,
  totalQuestions,
  attemptedQuestions,
  correctAnswers,
  wrongAnswers,
  score,
  mode
}) => {
  const router = useRouter();
  
  // Calculate completion percentage
  const completionPercentage = Math.round((attemptedQuestions / totalQuestions) * 100) || 0;
  
  // Calculate accuracy percentage (correct answers out of attempted)
  const accuracyPercentage = attemptedQuestions > 0 
    ? Math.round((correctAnswers / attemptedQuestions) * 100) 
    : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <IconChartBar size={24} className="text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Completed!</h2>
        <p className="text-gray-600">
          {mode === 'practice' 
            ? 'Great job finishing your practice test. Here\'s how you did:' 
            : 'Thank you for completing your exam. Here\'s your result summary:'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-1">
            <IconClipboardList size={20} className="text-blue-600 mr-2" />
            <h3 className="font-medium text-gray-800">Completion</h3>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Questions Completed</span>
              <span className="font-medium">{attemptedQuestions} of {totalQuestions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center mb-1">
            <IconCheckCircle size={20} className="text-green-600 mr-2" />
            <h3 className="font-medium text-gray-800">Accuracy</h3>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Correct Answers</span>
              <span className="font-medium">{correctAnswers} of {attemptedQuestions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${accuracyPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <IconCheckCircle size={20} className="text-green-600" />
              </div>
            </div>
            <div className="text-sm text-gray-600">Correct</div>
            <div className="text-xl font-bold text-gray-800">{correctAnswers}</div>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <IconXCircle size={20} className="text-red-600" />
              </div>
            </div>
            <div className="text-sm text-gray-600">Incorrect</div>
            <div className="text-xl font-bold text-gray-800">{wrongAnswers}</div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button 
          variant="primary"
          className="flex-1"
          onClick={() => router.push(`/dashboard/test-results/${attemptId}`)}
        >
          View Detailed Results
        </Button>
        
        <Button 
          variant="outline"
          className="flex-1"
          onClick={() => router.push('/dashboard/tests')}
        >
          Return to Test Library
        </Button>
      </div>
    </div>
  );
};

export default TestCompletionSummary;
