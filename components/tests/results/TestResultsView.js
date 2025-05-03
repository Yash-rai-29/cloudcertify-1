import { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  IconCheck, 
  IconX, 
  IconClock, 
  IconArrowRight,
  IconArrowLeft,
  IconRefresh
} from '@tabler/icons-react';
import Button from '../ui/Button';

/**
 * Test Results View component for displaying test results after completion
 */
export default function TestResultsView({ testAttempt, test, questions, mode }) {
  const router = useRouter();
  const [showQuestionDetails, setShowQuestionDetails] = useState(false);
  
  if (!testAttempt || !test) {
    return <div className="text-center py-10">No results available</div>;
  }

  // Calculate time taken in minutes and seconds
  const calculateTimeTaken = () => {
    if (!testAttempt.start_time || !testAttempt.end_time) return '0m 0s';
    
    const timeTakenSeconds = testAttempt.end_time - testAttempt.start_time;
    const minutes = Math.floor(timeTakenSeconds / 60);
    const seconds = timeTakenSeconds % 60;
    
    return `${minutes}m ${seconds}s`;
  };
  
  // Handle retaking the test
  const handleRetakeTest = () => {
    router.push(`/dashboard/tests`);
  };
  
  // Handle going back to dashboard
  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };
  
  // Toggle showing question details
  const toggleQuestionDetails = () => {
    setShowQuestionDetails(prev => !prev);
  };

  // Helper function to safely get the user's answer for a question
  const getUserAnswer = (questionId) => {
    try {
      if (!testAttempt.answers) return null;
      
      // Handle different answer formats
      const answer = testAttempt.answers[questionId];
      
      // If the answer is an object, extract the selected_option
      if (answer && typeof answer === 'object' && answer.selected_option) {
        return Array.isArray(answer.selected_option) 
          ? answer.selected_option[0] 
          : answer.selected_option;
      }
      
      // If the answer is an array, take the first element
      if (Array.isArray(answer)) {
        return answer[0];
      }
      
      // Otherwise return the answer directly if it's a primitive
      return typeof answer === 'object' ? null : answer;
    } catch (e) {
      console.error('Error processing answer:', e);
      return null;
    }
  };
  
  // Helper function to check if an answer is correct
  const isAnswerCorrect = (question, userAnswer) => {
    if (!userAnswer || !question.correct_option) return false;
    
    // Handle different correct answer formats
    if (Array.isArray(question.correct_option)) {
      return question.correct_option.includes(userAnswer);
    }
    
    return userAnswer.toString() === question.correct_option.toString();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-3">
          <IconCheck size={30} className="text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Completed!</h1>
        <p className="text-gray-600">
          You've completed the {test.title} test in {mode} mode
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">Score</p>
          <p className="text-2xl font-bold text-gray-900">
            {testAttempt.score}%
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                testAttempt.score >= 80 ? 'bg-green-500' :
                testAttempt.score >= 60 ? 'bg-amber-500' :
                'bg-red-500'
              }`}
              style={{ width: `${testAttempt.score}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">Questions</p>
          <div className="flex items-end">
            <p className="text-2xl font-bold text-gray-900">{testAttempt.correct_answers}</p>
            <p className="text-sm text-gray-500 ml-1 mb-1">correct</p>
            <span className="mx-1 text-gray-400 mb-1">/</span>
            <p className="text-sm text-gray-500 mb-1">{testAttempt.attempted_questions} attempted</p>
            <span className="mx-1 text-gray-400 mb-1">/</span>
            <p className="text-sm text-gray-500 mb-1">{testAttempt.total_questions} total</p>
          </div>
          <div className="flex mt-2">
            <span className="text-sm text-green-600 flex items-center">
              <IconCheck size={16} className="mr-1" /> {testAttempt.correct_answers}
            </span>
            <span className="text-sm text-red-600 flex items-center ml-4">
              <IconX size={16} className="mr-1" /> {testAttempt.wrong_answers}
            </span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">Time Taken</p>
          <p className="text-2xl font-bold text-gray-900 flex items-center">
            <IconClock size={20} className="mr-2 text-gray-400" />
            {calculateTimeTaken()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {mode === 'practice' ? 'Practice Mode' : 'Exam Mode'}
          </p>
        </div>
      </div>
      
      {/* Topic Performance */}
      {testAttempt.topics && testAttempt.topics.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Performance by Topic</h2>
          <div className="space-y-4">
            {testAttempt.topics.map((topic) => (
              <div key={topic.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{topic.name}</span>
                  <span className="text-sm text-gray-500">{topic.score}%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      topic.score >= 80 ? 'bg-green-500' :
                      topic.score >= 60 ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${topic.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Question Details (Practice Mode) */}
      {mode === 'practice' && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div 
            className="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
            onClick={toggleQuestionDetails}
          >
            <h2 className="text-lg font-medium text-gray-900">Question Details</h2>
            <Button variant="outline" size="sm">
              {showQuestionDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
          
          {showQuestionDetails && (
            <div className="divide-y divide-gray-200">
              {questions.map((question, index) => {
                const userAnswer = getUserAnswer(question.id);
                const isCorrect = isAnswerCorrect(question, userAnswer);
                
                return (
                  <div key={question.id} className="p-4">
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 rounded-full w-6 h-6 flex items-center justify-center ${
                        isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {isCorrect ? <IconCheck size={14} /> : <IconX size={14} />}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Question {index + 1}: {question.question}
                        </p>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <p className="font-medium">Your answer: 
                            <span className={isCorrect ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                              {userAnswer ? question.options[userAnswer] : 'Not answered'}
                            </span>
                          </p>
                          
                          {!isCorrect && (
                            <p className="font-medium mt-1">
                              Correct answer: 
                              <span className="text-green-600 ml-1">
                                {Array.isArray(question.correct_option) 
                                  ? question.correct_option.map(opt => question.options[opt]).join(', ')
                                  : question.options[question.correct_option]}
                              </span>
                            </p>
                          )}
                        </div>
                        
                        {question.explanation && (
                          <div className="mt-2 text-sm bg-blue-50 p-3 rounded-md">
                            <p className="font-medium text-blue-700">Explanation:</p>
                            <p className="text-blue-600">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline"
          leftIcon={<IconArrowLeft size={16} />}
          onClick={handleGoToDashboard}
        >
          Back to Dashboard
        </Button>
        
        <Button 
          variant="primary"
          rightIcon={<IconRefresh size={16} />}
          onClick={handleRetakeTest}
        >
          Take Another Test
        </Button>
      </div>
    </div>
  );
}
