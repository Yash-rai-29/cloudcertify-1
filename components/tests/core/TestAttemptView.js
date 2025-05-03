import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import useToast from '../../hooks/useToast';

// Components
import TestHeader from './TestHeader';
import TestQuestion from './TestQuestion';
import QuestionNavigation from './QuestionNavigation';
import KeyboardShortcuts from './KeyboardShortcuts';
import FinishTestModal from './FinishTestModal';

// Utility managers
import TestTimerManager, { formatTime } from './TestTimerManager';
import { QuestionStateManager } from './QuestionStateManager';
import AnswerManager from './AnswerManager';

/**
 * Test Attempt View component for displaying and interacting with test questions
 */
export function TestAttemptView({ testAttempt, test, questions, mode, attemptId, showSuccess, showError }) {
  const router = useRouter();
  // Use the passed toast functions or initialize them from the hook if not provided
  const toast = useToast();
  const notifySuccess = showSuccess || toast.showSuccess;
  const notifyError = showError || toast.showError;
  
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
  const [showMobileNavigation, setShowMobileNavigation] = useState(false);
  
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
  
  // Question state management (navigation, progress, etc.)
  const {
    handlePreviousQuestion,
    handleNextQuestion,
    handleJumpToQuestion,
    getProgressPercentage
  } = QuestionStateManager({
    currentQuestionIndex,
    setCurrentQuestionIndex,
    questions,
    setAnswerFeedback,
    startTimeRef
  });
  
  // Answer management (submission, feedback, flagging)
  const {
    handleSelectAnswer,
    handleToggleFlag,
    handleSubmitAnswer,
    handleFinishTest,
    getTimeTaken
  } = AnswerManager({
    mode,
    currentQuestion,
    userAnswers,
    setUserAnswers,
    flaggedQuestions,
    setFlaggedQuestions,
    attemptId,
    startTimeRef,
    setAnswerFeedback,
    setIsSubmitting,
    showSuccess: notifySuccess,
    showError: notifyError,
    router
  });

  if (!currentQuestion) {
    return <div className="text-center py-10">No questions available</div>;
  }

  // Toggle mobile navigation panel
  const toggleMobileNavigation = () => {
    setShowMobileNavigation(prev => !prev);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Timer Management (invisible component) */}
      <TestTimerManager 
        mode={mode}
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}
        onTimeExpired={handleFinishTest}
      />
      
      {/* Test Header */}
      <TestHeader 
        test={test}
        mode={mode}
        timeRemaining={timeRemaining}
        formatTime={formatTime}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        percentComplete={getProgressPercentage()}
        onToggleNavigation={toggleMobileNavigation}
      />
      
      <div className="mt-4 flex flex-col md:grid md:grid-cols-12 md:gap-6">
        {/* Mobile Navigation Overlay */}
        {showMobileNavigation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden flex items-center justify-center p-4" onClick={toggleMobileNavigation}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Question Navigator</h3>
                <button className="text-gray-500" onClick={toggleMobileNavigation}>×</button>
              </div>
              <QuestionNavigation 
                questions={questions}
                currentIndex={currentQuestionIndex}
                userAnswers={userAnswers}
                flaggedQuestions={flaggedQuestions}
                onSelectQuestion={(index) => {
                  handleJumpToQuestion(index);
                  setShowMobileNavigation(false);
                }}
              />
            </div>
          </div>
        )}
        
        {/* Desktop Question Navigation Sidebar */}
        <div className="hidden md:block md:col-span-3">
          <div className="sticky top-24">
            <QuestionNavigation 
              questions={questions}
              currentIndex={currentQuestionIndex}
              userAnswers={userAnswers}
              flaggedQuestions={flaggedQuestions}
              onSelectQuestion={handleJumpToQuestion}
            />
          </div>
        </div>
        
        {/* Main Question Content */}
        <div className="md:col-span-9">
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
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <KeyboardShortcuts />
          </div>
        </div>
      </div>
      
      {/* Finish Confirmation Modal */}
      <FinishTestModal
        isOpen={showConfirmFinishModal}
        onClose={() => setShowConfirmFinishModal(false)}
        onFinish={handleFinishTest}
        isSubmitting={isSubmitting}
        mode={mode}
        userAnswers={userAnswers}
        questionsLength={questions.length}
      />
    </div>
  );
}

export default TestAttemptView;
