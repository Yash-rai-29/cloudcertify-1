import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { 
  IconAlertCircle
} from '@tabler/icons-react';

import Button from '../ui/Button';
import Modal from '../ui/Modal';
import useToast from '../../hooks/useToast';
import { submitAnswer, finishTestAttempt } from '../../utils/services/testLibraryService';
import TestHeader from './TestHeader';
import TestQuestion from './TestQuestion';
import QuestionNavigation from './QuestionNavigation';
import KeyboardShortcuts from './KeyboardShortcuts';

/**
 * Test Attempt View component for displaying and interacting with test questions
 */
export function TestAttemptView({ testAttempt, test, questions, mode, attemptId }) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const answerTimerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  
  // State for test navigation and interaction
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmFinishModal, setShowConfirmFinishModal] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  
  // Current question
  const currentQuestion = questions[currentQuestionIndex] || null;

  // Initialize state on component mount
  useEffect(() => {
    if (!testAttempt) return;
    
    // Initialize user answers from saved state if available
    if (testAttempt.answers) {
      setUserAnswers(testAttempt.answers);
    }
    
    // Initialize flagged questions if available
    if (testAttempt.flagged_questions) {
      setFlaggedQuestions(testAttempt.flagged_questions);
    }
    
    // Set time remaining for exam mode
    if (mode === 'exam' && testAttempt.time_remaining) {
      setTimeRemaining(testAttempt.time_remaining);
    } else if (mode === 'exam' && test?.duration) {
      // If no time remaining is provided but there's a duration
      setTimeRemaining(test.duration * 60); // Convert minutes to seconds
    }

    // Reset answer timer
    startTimeRef.current = Date.now();
  }, [testAttempt, mode, test]);
  
  // Timer for exam mode
  useEffect(() => {
    if (mode !== 'exam' || !timeRemaining) return;
    
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
  }, [mode, timeRemaining]);
  
  // Format time remaining (mm:ss or hh:mm:ss format)
  const formatTime = useCallback((seconds) => {
    if (!seconds) return '--:--';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  // Calculate time spent on current question
  const getTimeTaken = useCallback(() => {
    const now = Date.now();
    const timeTaken = Math.floor((now - startTimeRef.current) / 1000); // Convert to seconds
    return Math.max(1, timeTaken); // Ensure at least 1 second
  }, []);
  
  // Navigate to previous question
  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      // Reset the answer feedback and timer
      setAnswerFeedback(null);
      startTimeRef.current = Date.now();
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);
  
  // Navigate to next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      // Reset the answer feedback and timer
      setAnswerFeedback(null);
      startTimeRef.current = Date.now();
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions.length]);
  
  // Jump to a specific question
  const handleJumpToQuestion = useCallback((index) => {
    if (index >= 0 && index < questions.length) {
      // Reset the answer feedback and timer
      setAnswerFeedback(null);
      startTimeRef.current = Date.now();
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);
  
  // Toggle flagging a question
  const handleToggleFlag = useCallback(() => {
    if (!currentQuestion) return;
    
    setFlaggedQuestions(prev => {
      const questionId = currentQuestion.id;
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  }, [currentQuestion]);
  
  // Handle selecting an answer
  const handleSelectAnswer = useCallback((option) => {
    if (!currentQuestion) return;
    
    const questionId = currentQuestion.id;
    
    setUserAnswers(prev => {
      // Handle multiple choice vs. single choice
      if (currentQuestion.assessment_type === 'multiple_choice') {
        const currentSelections = prev[questionId] || [];
        if (currentSelections.includes(option)) {
          return {
            ...prev,
            [questionId]: currentSelections.filter(opt => opt !== option)
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentSelections, option]
          };
        }
      } else {
        // Single choice - replace previous answer
        return {
          ...prev,
          [questionId]: [option]
        };
      }
    });
    
    // For practice mode, submit answer automatically after selection
    if (mode === 'practice') {
      // Clear any existing timeout
      if (answerTimerRef.current) {
        clearTimeout(answerTimerRef.current);
      }
      
      // Set a small delay to avoid too many API calls if user is clicking through options
      answerTimerRef.current = setTimeout(() => {
        handleSubmitAnswer();
      }, 500);
    }
  }, [currentQuestion, mode]);
  
  // Submit answer and get feedback (for practice mode)
  const handleSubmitAnswer = useCallback(async () => {
    if (!currentQuestion || !attemptId || mode !== 'practice') return;
    
    const questionId = currentQuestion.id;
    const selectedOptions = userAnswers[questionId] || [];
    
    if (selectedOptions.length === 0) {
      showError('Please select an answer');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get time spent on this question
      const timeTaken = getTimeTaken();
      
      const response = await submitAnswer(attemptId, questionId, selectedOptions, timeTaken);
      
      if (response.success) {
        setAnswerFeedback({
          isCorrect: response.data.is_correct,
          correctOption: response.data.correct_option,
          explanation: response.data.explanation,
          selectedOption: selectedOptions
        });
        
        // Show success/error message
        if (response.data.is_correct) {
          showSuccess('Correct answer!');
        } else {
          showError('Incorrect answer');
        }
        
        // Reset the question timer
        startTimeRef.current = Date.now();
      } else {
        showError('Failed to submit answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      showError('An error occurred while submitting your answer');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentQuestion, attemptId, mode, userAnswers, showSuccess, showError, getTimeTaken]);
  
  // Finish the test
  const handleFinishTest = useCallback(async () => {
    if (!attemptId) return;
    
    setIsSubmitting(true);
    try {
      const response = await finishTestAttempt(attemptId);
      
      if (response.success) {
        showSuccess('Test completed successfully');
        
        // Stay on the same page - it will show results since status is now 'completed'
        window.location.reload();
      } else {
        showError('Failed to complete test');
      }
    } catch (error) {
      console.error('Error completing test:', error);
      showError('An error occurred while completing the test');
    } finally {
      setIsSubmitting(false);
      setShowConfirmFinishModal(false);
    }
  }, [attemptId, showSuccess, showError]);
  
  // Get progress percentage
  const getProgressPercentage = useCallback(() => {
    if (!questions.length) return 0;
    
    const answeredCount = Object.keys(userAnswers).length;
    return Math.round((answeredCount / questions.length) * 100);
  }, [questions.length, userAnswers]);

  if (!currentQuestion) {
    return <div className="text-center py-10">No questions available</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Test Header */}
      <TestHeader 
        test={test}
        mode={mode}
        timeRemaining={timeRemaining}
        formatTime={formatTime}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        percentComplete={getProgressPercentage()}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
        {/* Question Navigation Sidebar */}
        <div className="md:col-span-3 order-2 md:order-1">
          <QuestionNavigation 
            questions={questions}
            currentIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            flaggedQuestions={flaggedQuestions}
            onSelectQuestion={handleJumpToQuestion}
          />
        </div>
        
        {/* Main Question Content */}
        <div className="md:col-span-9 order-1 md:order-2">
          <TestQuestion 
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            questions={questions}
            selectedOptions={userAnswers[currentQuestion.id] || []}
            onSelectOption={handleSelectAnswer}
            answerFeedback={answerFeedback}
            mode={mode}
            isFlagged={flaggedQuestions.includes(currentQuestion.id)}
            onToggleFlag={handleToggleFlag}
            onPreviousQuestion={handlePreviousQuestion}
            onNextQuestion={handleNextQuestion}
            onFinishTest={() => setShowConfirmFinishModal(true)}
            onSubmitAnswer={handleSubmitAnswer}
            isSubmitting={isSubmitting}
            userAnswers={userAnswers}
          />
          
          {/* Keyboard Shortcuts */}
          <KeyboardShortcuts />
        </div>
      </div>
      
      {/* Finish Confirmation Modal */}
      <Modal
        isOpen={showConfirmFinishModal}
        onClose={() => !isSubmitting && setShowConfirmFinishModal(false)}
        title=""
        size="md"
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
                {mode === 'exam' 
                  ? 'You will not be able to return to the test after finishing. Your answers will be submitted and scored.'
                  : 'Your progress will be saved and you\'ll be able to see your results.'}
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
    </div>
  );
}

export default TestAttemptView;
