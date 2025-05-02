import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  IconChevronLeft, 
  IconChevronRight, 
  IconFlag, 
  IconClock, 
  IconLoader2, 
  IconCheck,
  IconX,
  IconAlertCircle
} from '@tabler/icons-react';
import { getDashboardLayout } from '../../../components/layouts/DashboardLayout';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Modal from '../../../components/ui/Modal';
import { getTestAttempt, submitAnswer, finishTestAttempt } from '../../../utils/services/testLibraryService';
import useToast from '../../../hooks/useToast';

/**
 * Test attempt page to display and answer test questions
 */
export default function TestAttempt() {
  const router = useRouter();
  const { id: attemptId } = router.query;
  const { showSuccess, showError } = useToast();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmFinishModal, setShowConfirmFinishModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [testResults, setTestResults] = useState(null);
  
  // Timer for exam mode
  useEffect(() => {
    if (!test || test.mode !== 'exam' || !timeRemaining) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [test, timeRemaining]);
  
  // Format time remaining
  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Load test attempt data
  useEffect(() => {
    if (!attemptId) return;
    
    const fetchTestAttempt = async () => {
      setIsLoading(true);
      try {
        const response = await getTestAttempt(attemptId);
        if (response.success) {
          setTest(response.data.test);
          setQuestions(response.data.questions || []);
          
          // Initialize answers if saved from previous session
          if (response.data.answers) {
            setUserAnswers(response.data.answers);
          }
          
          // Set time remaining for exam mode
          if (response.data.test.mode === 'exam' && response.data.time_remaining) {
            setTimeRemaining(response.data.time_remaining);
          }
          
          // Set flagged questions if any
          if (response.data.flagged_questions) {
            setFlaggedQuestions(response.data.flagged_questions);
          }
        } else {
          showError('Failed to load test attempt');
          router.push('/dashboard/tests');
        }
      } catch (error) {
        console.error('Error fetching test attempt:', error);
        showError('An error occurred while loading the test');
        router.push('/dashboard/tests');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTestAttempt();
  }, [attemptId, router, showError]);
  
  // Current question
  const currentQuestion = questions[currentQuestionIndex] || null;
  
  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswerFeedback(null);
    }
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswerFeedback(null);
    }
  };
  
  // Jump to a specific question
  const handleJumpToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      setAnswerFeedback(null);
    }
  };
  
  // Toggle flagging a question
  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    
    setFlaggedQuestions(prev => {
      const questionId = currentQuestion.id;
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };
  
  // Handle selecting an answer
  const handleSelectAnswer = (option) => {
    if (!currentQuestion || isSubmitting) return;
    
    // For multiple choice questions
    if (currentQuestion.question_type === 'multiple_choice') {
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: option
      }));
    }
    // For multiple answer questions
    else if (currentQuestion.question_type === 'multiple_answer') {
      setUserAnswers(prev => {
        const currentSelected = prev[currentQuestion.id] || [];
        if (currentSelected.includes(option)) {
          return {
            ...prev,
            [currentQuestion.id]: currentSelected.filter(opt => opt !== option)
          };
        } else {
          return {
            ...prev,
            [currentQuestion.id]: [...currentSelected, option]
          };
        }
      });
    }
  };
  
  // Submit answer and get feedback (for practice mode)
  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !attemptId || isSubmitting) return;
    if (!userAnswers[currentQuestion.id] || 
        (Array.isArray(userAnswers[currentQuestion.id]) && userAnswers[currentQuestion.id].length === 0)) {
      showError('Please select an answer');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const selectedOption = userAnswers[currentQuestion.id];
      const response = await submitAnswer(
        attemptId, 
        currentQuestion.id, 
        selectedOption,
        10 // time taken - placeholder value
      );
      
      if (response.success) {
        if (test.mode === 'practice') {
          // Show feedback for practice mode
          setAnswerFeedback({
            isCorrect: response.data.is_correct,
            correctAnswer: response.data.correct_answer,
            explanation: response.data.explanation
          });
        } else if (currentQuestionIndex < questions.length - 1) {
          // Move to next question in exam mode
          handleNextQuestion();
        }
      } else {
        showError('Failed to submit answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      showError('An error occurred while submitting your answer');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Finish the test
  const handleFinishTest = async () => {
    if (!attemptId || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await finishTestAttempt(attemptId);
      if (response.success) {
        setTestResults(response.data);
        setShowResultsModal(true);
      } else {
        showError('Failed to finish test');
      }
    } catch (error) {
      console.error('Error finishing test:', error);
      showError('An error occurred while finishing the test');
    } finally {
      setIsSubmitting(false);
      setShowConfirmFinishModal(false);
    }
  };
  
  // Go to dashboard
  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };
  
  // Get progress percentage
  const getProgressPercentage = () => {
    if (!questions || questions.length === 0) return 0;
    
    const answeredCount = Object.keys(userAnswers).length;
    return Math.round((answeredCount / questions.length) * 100);
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <IconLoader2 size={40} className="animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Test...</h2>
          <p className="text-gray-500 mt-2">Please wait while we prepare your test</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      {/* Header with test info */}
      <div className="py-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{test?.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            {test?.mode === 'exam' && (
              <div className="flex items-center text-gray-700 font-medium">
                <IconClock size={18} className="mr-1 text-gray-500" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            <Badge variant={test?.mode === 'practice' ? 'blue' : 'purple'}>
              {test?.mode === 'practice' ? 'Practice Mode' : 'Exam Mode'}
            </Badge>
            <Button 
              variant="danger" 
              size="sm"
              onClick={() => setShowConfirmFinishModal(true)}
            >
              Finish Test
            </Button>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="my-4">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>{getProgressPercentage()}% completed</span>
          <span>{Object.keys(userAnswers).length}/{questions.length} questions answered</span>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Question navigator sidebar (desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Question Navigator</h3>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-5 gap-2">
                {questions.map((question, index) => {
                  const isAnswered = !!userAnswers[question.id];
                  const isFlagged = flaggedQuestions.includes(question.id);
                  const isCurrent = index === currentQuestionIndex;
                  
                  return (
                    <button
                      key={question.id}
                      className={`h-10 w-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                        isCurrent 
                          ? 'bg-blue-600 text-white' 
                          : isAnswered 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } ${isFlagged ? 'ring-2 ring-amber-500' : ''}`}
                      onClick={() => handleJumpToQuestion(index)}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="h-4 w-4 bg-green-100 rounded-sm mr-2"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="h-4 w-4 bg-gray-100 rounded-sm mr-2"></div>
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="h-4 w-4 bg-blue-600 rounded-sm mr-2"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="h-4 w-4 bg-gray-100 rounded-sm ring-2 ring-amber-500 mr-2"></div>
                  <span>Flagged</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Question and answers */}
        <div className="lg:col-span-3">
          {currentQuestion ? (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Question header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <Badge variant="blue" size="sm" className="mr-2">
                        Question {currentQuestionIndex + 1}
                      </Badge>
                      <Badge 
                        variant={flaggedQuestions.includes(currentQuestion.id) ? "amber" : "default"}
                        size="sm"
                        leftIcon={<IconFlag size={12} />}
                        className="cursor-pointer"
                        onClick={handleToggleFlag}
                      >
                        {flaggedQuestions.includes(currentQuestion.id) ? 'Flagged' : 'Flag for review'}
                      </Badge>
                    </div>
                    <h2 className="text-lg font-medium text-gray-900 mb-2">{currentQuestion.question_text}</h2>
                    {currentQuestion.description && (
                      <p className="text-gray-600 text-sm">{currentQuestion.description}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Answer options */}
              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {currentQuestion.question_type === 'multiple_choice' 
                    ? 'Select one answer:' 
                    : 'Select all that apply:'}
                </h3>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = currentQuestion.question_type === 'multiple_choice'
                      ? userAnswers[currentQuestion.id] === option.id
                      : (userAnswers[currentQuestion.id] || []).includes(option.id);
                    
                    // For practice mode feedback
                    const isCorrectAnswer = answerFeedback && (
                      Array.isArray(answerFeedback.correctAnswer)
                        ? answerFeedback.correctAnswer.includes(option.id)
                        : answerFeedback.correctAnswer === option.id
                    );
                    
                    const isWrongAnswer = answerFeedback && isSelected && !isCorrectAnswer;
                    
                    return (
                      <div 
                        key={option.id}
                        className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/30'
                        } ${
                          answerFeedback 
                            ? isCorrectAnswer 
                              ? 'border-green-500 bg-green-50' 
                              : isWrongAnswer 
                                ? 'border-red-500 bg-red-50'
                                : ''
                            : ''
                        }`}
                        onClick={() => !answerFeedback && handleSelectAnswer(option.id)}
                      >
                        <div className={`flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-sm border mr-3 mt-0.5 ${
                          isSelected 
                            ? 'bg-blue-500 border-blue-500 text-white' 
                            : 'border-gray-300'
                        } ${
                          answerFeedback 
                            ? isCorrectAnswer 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : isWrongAnswer 
                                ? 'bg-red-500 border-red-500 text-white'
                                : ''
                            : ''
                        }`}>
                          {isSelected && <IconCheck size={14} />}
                          {answerFeedback && isCorrectAnswer && !isSelected && <IconCheck size={14} />}
                          {answerFeedback && isWrongAnswer && <IconX size={14} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800">{option.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Feedback for practice mode */}
                {answerFeedback && (
                  <div className={`mt-6 p-4 rounded-lg ${
                    answerFeedback.isCorrect 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                        answerFeedback.isCorrect 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {answerFeedback.isCorrect ? <IconCheck size={16} /> : <IconX size={16} />}
                      </div>
                      <div className="ml-3">
                        <h4 className={`text-sm font-medium ${
                          answerFeedback.isCorrect ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {answerFeedback.isCorrect ? 'Correct!' : 'Incorrect'}
                        </h4>
                        <div className="mt-2 text-sm">
                          <p className="text-gray-600">
                            {answerFeedback.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Navigation buttons */}
              <div className="p-6 border-t border-gray-200 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  leftIcon={<IconChevronLeft size={16} />}
                >
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  {test?.mode === 'practice' && !answerFeedback && (
                    <Button
                      variant="primary"
                      onClick={handleSubmitAnswer}
                      disabled={isSubmitting || !userAnswers[currentQuestion.id] || (Array.isArray(userAnswers[currentQuestion.id]) && userAnswers[currentQuestion.id].length === 0)}
                      isLoading={isSubmitting}
                    >
                      Submit Answer
                    </Button>
                  )}
                  
                  {(test?.mode === 'exam' || answerFeedback) && currentQuestionIndex < questions.length - 1 && (
                    <Button
                      variant="primary"
                      onClick={handleNextQuestion}
                      rightIcon={<IconChevronRight size={16} />}
                    >
                      Next
                    </Button>
                  )}
                  
                  {(test?.mode === 'exam' || answerFeedback) && currentQuestionIndex === questions.length - 1 && (
                    <Button
                      variant="danger"
                      onClick={() => setShowConfirmFinishModal(true)}
                    >
                      Finish Test
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions available</h3>
              <p className="text-gray-500 mb-4">This test does not contain any questions yet.</p>
              <Button variant="primary" onClick={handleGoToDashboard}>
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Question navigator (mobile) */}
      <div className="block lg:hidden mt-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Question Navigator</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const isAnswered = !!userAnswers[question.id];
                const isFlagged = flaggedQuestions.includes(question.id);
                const isCurrent = index === currentQuestionIndex;
                
                return (
                  <button
                    key={question.id}
                    className={`h-10 w-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      isCurrent 
                        ? 'bg-blue-600 text-white' 
                        : isAnswered 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } ${isFlagged ? 'ring-2 ring-amber-500' : ''}`}
                    onClick={() => handleJumpToQuestion(index)}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirm finish modal */}
      <Modal
        isOpen={showConfirmFinishModal}
        onClose={() => !isSubmitting && setShowConfirmFinishModal(false)}
        title="Finish Test"
      >
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <IconAlertCircle size={24} className="text-amber-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Are you sure you want to finish this test?
              </h3>
              <p className="text-gray-500 mb-4">
                {test?.mode === 'exam' 
                  ? 'You will not be able to return to the test after finishing. Your answers will be submitted and scored.'
                  : 'Your progress will be saved and you'll be able to see your results.'}
              </p>
              
              {/* Show unanswered questions warning */}
              {Object.keys(userAnswers).length < questions.length && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    <strong>Warning:</strong> You have {questions.length - Object.keys(userAnswers).length} unanswered questions.
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => !isSubmitting && setShowConfirmFinishModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleFinishTest}
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Finish Test'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      
      {/* Results modal */}
      <Modal
        isOpen={showResultsModal}
        onClose={() => router.push('/dashboard')}
        title="Test Results"
        size="lg"
      >
        <div className="p-6">
          {testResults && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-full mb-3">
                  <IconCheck size={30} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Completed!</h2>
                <p className="text-gray-600">
                  You've completed the {test.title} test
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {testResults.score}%
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Correct Answers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {testResults.correct_answers}/{testResults.total_questions}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Time Taken</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.floor(testResults.time_taken / 60)}m {testResults.time_taken % 60}s
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Performance by Topic</h3>
                {testResults.topics && testResults.topics.map((topic) => (
                  <div key={topic.name} className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{topic.name}</span>
                      <span className="text-sm text-gray-500">{topic.score}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ width: `${topic.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/dashboard/test-results/${attemptId}`)}
                >
                  View Detailed Results
                </Button>
                <Button
                  variant="primary"
                  onClick={() => router.push('/dashboard')}
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

TestAttempt.getLayout = getDashboardLayout;
