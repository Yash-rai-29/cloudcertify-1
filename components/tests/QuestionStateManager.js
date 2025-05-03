import { useCallback } from 'react';

/**
 * Manages the navigation and state related to questions in a test
 */
export const QuestionStateManager = ({
  currentQuestionIndex,
  setCurrentQuestionIndex,
  questions,
  setAnswerFeedback,
  startTimeRef,
  mode,
  handleSubmitAnswer,
  submittedQuestions,
  questionFeedbackData
}) => {
  // Clear or set feedback for a specific question
  const updateAnswerFeedbackForQuestion = useCallback((questionId) => {
    // Check if this question was already submitted
    if (questionId && submittedQuestions?.includes(questionId) && questionFeedbackData?.[questionId]) {
      // Show stored feedback for this question
      setAnswerFeedback(questionFeedbackData[questionId]);
    } else {
      // No feedback to show
      setAnswerFeedback(null);
    }
  }, [submittedQuestions, questionFeedbackData, setAnswerFeedback]);

  // Navigate to previous question
  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      const prevQuestionId = questions[newIndex]?.id;
      
      // Reset the timer for the new question
      startTimeRef.current = Date.now();
      
      // Update feedback for the previous question
      updateAnswerFeedbackForQuestion(prevQuestionId);
      
      setCurrentQuestionIndex(newIndex);
    }
  }, [currentQuestionIndex, setCurrentQuestionIndex, startTimeRef, 
      questions, updateAnswerFeedbackForQuestion]);
  
  // Navigate to next question
  const handleNextQuestion = useCallback(async () => {
    // For exam mode, try to submit the answer before moving to the next question
    if (mode === 'exam' && typeof handleSubmitAnswer === 'function') {
      const submitted = await handleSubmitAnswer();
      // Only proceed to next question if submission succeeded or there was no submission attempt
      if (!submitted) {
        return; // Stop if submission failed or wasn't completed
      }
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      const nextQuestionId = questions[newIndex]?.id;
      
      // Reset the timer for the new question
      startTimeRef.current = Date.now();
      
      // Update feedback for the next question
      updateAnswerFeedbackForQuestion(nextQuestionId);
      
      setCurrentQuestionIndex(newIndex);
    }
  }, [
    currentQuestionIndex, 
    questions.length, 
    setCurrentQuestionIndex, 
    startTimeRef, 
    mode, 
    handleSubmitAnswer,
    questions,
    updateAnswerFeedbackForQuestion
  ]);
  
  // Jump to a specific question by index
  const handleJumpToQuestion = useCallback((index) => {
    if (index >= 0 && index < questions.length && index !== currentQuestionIndex) {
      const jumpQuestionId = questions[index]?.id;
      
      // Reset the timer for the new question
      startTimeRef.current = Date.now();
      
      // Update feedback for the jumped-to question
      updateAnswerFeedbackForQuestion(jumpQuestionId);
      
      setCurrentQuestionIndex(index);
    }
  }, [
    currentQuestionIndex, 
    questions.length, 
    setCurrentQuestionIndex, 
    startTimeRef,
    questions,
    updateAnswerFeedbackForQuestion
  ]);
  
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
