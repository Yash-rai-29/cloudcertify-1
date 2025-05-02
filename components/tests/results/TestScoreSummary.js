import { IconCheck, IconX, IconClock, IconFileAnalytics } from '@tabler/icons-react';

/**
 * Test Score Summary Component
 * Displays score, time taken, and other performance metrics
 */
const TestScoreSummary = ({ testResults, formatTimeTaken, formatPercentage }) => {
  if (!testResults) return null;

  // Calculate percentage if needed
  const score = typeof testResults.score === 'number' 
    ? testResults.score
    : (testResults.score_percentage || 0);
  
  // Format score for display
  const scorePercentage = typeof formatPercentage === 'function'
    ? formatPercentage(score)
    : Math.round(score * 100);

  // Determine score color and label
  const getScoreColor = () => {
    if (scorePercentage >= 80) return 'bg-green-500';
    if (scorePercentage >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Count correct/incorrect answers
  const correctAnswers = testResults.correct_answers || 0;
  const totalAnswered = testResults.attempted_questions?.length || 0;
  const incorrectAnswers = totalAnswered - correctAnswers;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Score Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium text-gray-900">Score</h2>
          <div className={`px-2 py-1 rounded-full ${
            testResults.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {testResults.passed ? 'Passed' : 'Failed'}
          </div>
        </div>
        
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {scorePercentage}%
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
          <div 
            className={`h-3 rounded-full ${getScoreColor()}`}
            style={{ width: `${scorePercentage}%` }}
          ></div>
        </div>
        
        {testResults.passing_score && (
          <p className="text-xs text-gray-500">
            Passing score: {typeof testResults.passing_score === 'number' 
              ? `${Math.round(testResults.passing_score * 100)}%` 
              : testResults.passing_score
            }
          </p>
        )}
      </div>
      
      {/* Questions Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Questions</h2>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-full w-6 h-6 bg-green-100 text-green-600 flex items-center justify-center mr-2">
              <IconCheck size={16} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{correctAnswers}</div>
              <div className="text-xs text-gray-500">Correct</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-full w-6 h-6 bg-red-100 text-red-600 flex items-center justify-center mr-2">
              <IconX size={16} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{incorrectAnswers}</div>
              <div className="text-xs text-gray-500">Incorrect</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex-shrink-0 rounded-full w-6 h-6 bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
              <span className="text-xs font-medium">{testResults.total_questions || totalAnswered}</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{testResults.total_questions || totalAnswered}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        
        {testResults.unattempted_questions?.length > 0 && (
          <p className="text-xs text-gray-500">
            {testResults.unattempted_questions.length} questions were skipped
          </p>
        )}
      </div>
      
      {/* Time Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Time</h2>
        
        <div className="flex items-center mb-4">
          <IconClock size={20} className="text-gray-400 mr-2" />
          <div className="text-2xl font-bold text-gray-900">
            {formatTimeTaken ? formatTimeTaken(testResults.time_taken) : `${Math.floor(testResults.time_taken / 60)}m ${testResults.time_taken % 60}s`}
          </div>
        </div>
        
        {testResults.average_time_per_question && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Avg. per question:</span> {formatTimeTaken ? formatTimeTaken(testResults.average_time_per_question) : `${testResults.average_time_per_question}s`}
          </div>
        )}
        
        {testResults.time_limit && (
          <div className="mt-3 text-xs text-gray-500">
            <span className="font-medium">Time limit:</span> {formatTimeTaken ? formatTimeTaken(testResults.time_limit) : `${Math.floor(testResults.time_limit / 60)}m ${testResults.time_limit % 60}s`}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestScoreSummary;