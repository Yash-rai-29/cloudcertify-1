import { useCallback } from 'react';

/**
 * Manages the navigation and state related to questions in a test
 */
export const QuestionStateManager = ({
  currentQuestionIndex,
  setCurrentQuestionIndex,
  questions,
  setAnswerFeedback,
  startTimeRef
}) => {
  // Navigate to previous question
  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      // Reset the answer feedback and timer
      setAnswerFeedback(null);
      startTimeRef.current = Date.now();
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, setAnswerFeedback, setCurrentQuestionIndex, startTimeRef]);
  
  // Navigate to next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      // Reset the answer feedback and timer
      setAnswerFeedback(null);
      startTimeRef.current = Date.now();
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions.length, setAnswerFeedback, setCurrentQuestionIndex, startTimeRef]);
  
  // Jump to a specific question by index
  const handleJumpToQuestion = useCallback((index) => {
    if (index >= 0 && index < questions.length && index !== currentQuestionIndex) {
      // Reset the answer feedback and timer
      setAnswerFeedback(null);
      startTimeRef.current = Date.now();
      setCurrentQuestionIndex(index);
    }
  }, [currentQuestionIndex, questions.length, setAnswerFeedback, setCurrentQuestionIndex, startTimeRef]);
  
  // Calculate progress percentage
  const getProgressPercentage = useCallback(() => {
    if (!questions.length) return 0;
    return Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  }, [currentQuestionIndex, questions.length]);

  // This is a utility component that returns handler functions
  return {
    handlePreviousQuestion,
    handleNextQuestion,
    handleJumpToQuestion,
    getProgressPercentage
  };
};

export default QuestionStateManager;
