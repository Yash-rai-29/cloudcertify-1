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

// Constants
const FLAGGED_QUESTIONS_KEY = 'flagged_questions_';

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
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [questionFeedbackData, setQuestionFeedbackData] = useState({});
  const [hasAnswerResults, setHasAnswerResults] = useState(false);
  
  // Current question
  const currentQuestion = questions[currentQuestionIndex] || null;

  // Initialize state on component mount
  useEffect(() => {
    if (!testAttempt) return;
    
    // Initialize user answers from saved state if available
    if (testAttempt.attempted_questions) {
      const answers = {};
      const submitted = [];
      const feedbackData = {};
      
      testAttempt.attempted_questions.forEach((attemptedQuestion) => {
        const questionId = attemptedQuestion.question_id;
        
        // Set user answers
        answers[questionId] = attemptedQuestion.selected_option;
        
        // Track submitted questions
        submitted.push(questionId);
        
        // Find the corresponding question to get explanation and correct answer if needed
        const question = questions.find(q => q.id === questionId);
        
        // Get correct answer from question data if available
        let correctOption = attemptedQuestion.correct_option || '';
        let correctOptionIds = [];
        
        // If correct option not in attempt data, try to get from question data
        if ((!correctOption || correctOption === '') && question) {
          // Try different possible field names in the question data
          if (question.correct_options) {
            correctOption = question.correct_options;
          } else if (question.correct_answer) {
            correctOption = question.correct_answer;
          } else if (question.correct_option) {
            correctOption = question.correct_option;
          } else if (question.answer) {
            // Some question data might store the answer under 'answer' field
            correctOption = question.answer;
          }
        }
        
        // Convert to array format for consistency
        if (correctOption) {
          // Handle both comma-separated strings and single values
          correctOptionIds = typeof correctOption === 'string' && correctOption.includes(',') 
            ? correctOption.split(',').map(opt => opt.trim())
            : [correctOption.trim()];
        }
        
        // Initialize feedback data for this question
        feedbackData[questionId] = {
          isCorrect: attemptedQuestion.is_correct || false,
          correctOption: correctOption,
          correctOptionIds: correctOptionIds,
          explanation: attemptedQuestion.explanation || 
            (question ? question.explanation : null) || 
            'No explanation available for this question.',
          timeTaken: attemptedQuestion.time_taken || 0
        };
      });
      
      setUserAnswers(answers);
      setSubmittedQuestions(submitted);
      setQuestionFeedbackData(feedbackData);
      setHasAnswerResults(true);
    }
    
    // Initialize flagged questions from local storage if available
    const storedFlaggedQuestions = typeof window !== 'undefined' ? 
      JSON.parse(localStorage.getItem(`${FLAGGED_QUESTIONS_KEY}${attemptId}`)) : null;
    
    if (storedFlaggedQuestions) {
      setFlaggedQuestions(storedFlaggedQuestions);
    } else if (testAttempt.flagged_questions) {
      setFlaggedQuestions(testAttempt.flagged_questions);
      // Also save to local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${FLAGGED_QUESTIONS_KEY}${attemptId}`, JSON.stringify(testAttempt.flagged_questions));
      }
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
  }, [testAttempt, mode, test, attemptId]);
  
  // Effect to set answer feedback when question changes
  useEffect(() => {
    if (currentQuestion && submittedQuestions.includes(currentQuestion.id)) {
      // Show stored feedback for this question when navigating to it
      setAnswerFeedback(questionFeedbackData[currentQuestion.id]);
    }
  }, [currentQuestion, submittedQuestions, questionFeedbackData]);
  
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
    router,
    submittedQuestions,
    setSubmittedQuestions,
    questionFeedbackData,
    setQuestionFeedbackData
  });
  
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
    startTimeRef,
    mode,
    handleSubmitAnswer,
    submittedQuestions,
    questionFeedbackData
  });

  // Calculate accurate completion percentage based on attempted questions
  const calculateCompletionPercentage = () => {
    if (!questions.length) return 0;
    const attemptedCount = Object.keys(userAnswers).length;
    return Math.round((attemptedCount / questions.length) * 100);
  };

  // Toggle mobile navigation panel
  const toggleMobileNavigation = () => {
    setShowMobileNavigation(prev => !prev);
  };

  // Sanitize userAnswers for the FinishTestModal to prevent rendering objects directly
  const sanitizedUserAnswers = {};
  
  Object.keys(userAnswers || {}).forEach(key => {
    // If the user answer is an object, just record that an answer exists
    // If it's a primitive, store the actual value
    if (userAnswers[key] && typeof userAnswers[key] === 'object') {
      // For objects or arrays, we just want to know this question has been answered
      sanitizedUserAnswers[key] = true;
    } else {
      sanitizedUserAnswers[key] = userAnswers[key];
    }
  });

  if (!currentQuestion) {
    return <div className="text-center py-10">No questions available</div>;
  }

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
        percentComplete={calculateCompletionPercentage()}
        onToggleNavigation={toggleMobileNavigation}
        onFinishTest={() => setShowConfirmFinishModal(true)}
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
                submittedQuestions={submittedQuestions}
                questionFeedbackData={questionFeedbackData}
                mode={mode}
              />
            </div>
          </div>
        )}
        
        {/* Desktop Question Navigation Sidebar */}
        <div className="hidden md:block md:col-span-3">
          <div className=" top-24">
            <QuestionNavigation 
              questions={questions}
              currentIndex={currentQuestionIndex}
              userAnswers={userAnswers}
              flaggedQuestions={flaggedQuestions}
              onSelectQuestion={handleJumpToQuestion}
              submittedQuestions={submittedQuestions}
              questionFeedbackData={questionFeedbackData}
              mode={mode}
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
            startTimeRef={startTimeRef}
            submittedQuestions={submittedQuestions}
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
        userAnswers={sanitizedUserAnswers}
        questionsLength={questions.length}
      />
    </div>
  );
}

export default TestAttemptView;
