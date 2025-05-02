import { useCallback } from 'react';
import { submitAnswer, finishTestAttempt } from '../../utils/services/testLibraryService';

/**
 * Handles answer submission, feedback, and flagging functionality
 */
const AnswerManager = ({
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
  showSuccess,
  showError,
  router
}) => {
  // Calculate time spent on current question
  const getTimeTaken = useCallback(() => {
    const now = Date.now();
    const timeTaken = Math.floor((now - startTimeRef.current) / 1000); // Convert to seconds
    return Math.max(1, timeTaken); // Ensure at least 1 second
  }, [startTimeRef]);

  // Handle selecting an answer option
  const handleSelectAnswer = useCallback((optionId, isMultipleChoice) => {
    if (!currentQuestion) return;
    
    const questionId = currentQuestion.id;
    const currentSelections = userAnswers[questionId] || [];
    
    setUserAnswers(prev => {
      // For single-choice questions (radio buttons), replace the selection
      if (!isMultipleChoice) {
        return {
          ...prev,
          [questionId]: [optionId] // Always an array with a single value
        };
      }
      
      // For multiple-choice questions (checkboxes), toggle the selection
      const isAlreadySelected = currentSelections.includes(optionId);
      
      return {
        ...prev,
        [questionId]: isAlreadySelected
          ? currentSelections.filter(id => id !== optionId) // Remove if selected
          : [...currentSelections, optionId] // Add if not selected
      };
    });
  }, [currentQuestion, userAnswers, setUserAnswers]);

  // Toggle flagging a question
  const handleToggleFlag = useCallback(() => {
    if (!currentQuestion) return;
    
    const questionId = currentQuestion.id;
    
    setFlaggedQuestions(prev => {
      return prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId];
    });
  }, [currentQuestion, setFlaggedQuestions]);

  // Helper function to safely extract error messages without causing React rendering issues
  const safelyExtractErrorMessage = useCallback((error) => {
    if (!error) return 'An unknown error occurred';
    
    // Handle string errors
    if (typeof error === 'string') return error;
    
    // Handle error objects with message property
    if (typeof error === 'object' && error.message) return error.message;
    
    // Handle FastAPI validation errors
    if (error.response?.data?.detail) {
      try {
        const detail = error.response.data.detail;
        
        // Handle array of validation errors
        if (Array.isArray(detail)) {
          // Convert each error object to a string
          return detail.map(item => {
            if (typeof item === 'object' && item.loc && item.msg) {
              return `${Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : ''}: ${item.msg}`;
            }
            return String(item);
          }).join(', ');
        }
        
        // Handle string details
        if (typeof detail === 'string') return detail;
        
        // Handle object details (convert to string)
        if (typeof detail === 'object') return JSON.stringify(detail);
      } catch (e) {
        console.error('Error parsing API error:', e);
        return 'Could not parse error details';
      }
    }
    
    // Default generic error message
    return 'An error occurred while submitting your answer';
  }, []);

  // Submit the current answer
  const handleSubmitAnswer = useCallback(async () => {
    if (!currentQuestion || !attemptId) return;
    
    const questionId = currentQuestion.id;
    const selectedOptions = userAnswers[questionId] || [];
    
    // Skip if no options selected
    if (selectedOptions.length === 0) {
      if (typeof showError === 'function') {
        showError('Please select an answer before submitting');
      } else {
        console.error('Please select an answer before submitting');
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const timeTaken = getTimeTaken();
      
      // Format data for API call
      const payload = {
        question_id: questionId,
        selected_option_ids: selectedOptions,
        time_taken: timeTaken
      };
      
      const response = await submitAnswer(attemptId, payload);
      
      if (response.success) {
        // In practice mode, show feedback
        if (mode === 'practice') {
          // Safely handle the API response
          const feedbackData = {
            isCorrect: response.data?.is_correct || false,
            correctOption: response.data?.correct_option || '',
            explanation: response.data?.explanation || currentQuestion.explanation || ''
          };
          
          setAnswerFeedback(feedbackData);
        }
        
        // In exam mode, move to next question automatically
        if (mode === 'exam') {
          // Reset the start time for the next question
          startTimeRef.current = Date.now();
          setAnswerFeedback(null);
        }
      } else {
        // Handle API error responses
        const errorMessage = safelyExtractErrorMessage(response.error);
        
        if (typeof showError === 'function') {
          showError(errorMessage);
        } else {
          console.error('Error submitting answer:', errorMessage);
        }
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Error submitting answer:', error);
      
      // Safely extract error message
      const errorMessage = safelyExtractErrorMessage(error);
      
      if (typeof showError === 'function') {
        showError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    currentQuestion, 
    attemptId, 
    userAnswers, 
    showError, 
    setIsSubmitting, 
    getTimeTaken, 
    mode, 
    setAnswerFeedback
  ]);

  // Finish the test and submit all answers
  const handleFinishTest = useCallback(async () => {
    if (!attemptId) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await finishTestAttempt(attemptId);
      
      if (response.success) {
        // Use showSuccess only if it's a function
        if (typeof showSuccess === 'function') {
          showSuccess('Test completed successfully');
        } else {
          console.log('Test completed successfully');
        }
        
        // Redirect to results page
        if (response.data && response.data.attempt_id) {
          router.push(`/dashboard/take-test/${response.data.attempt_id}?status=completed&mode=${mode}`);
        } else {
          router.push('/dashboard/tests');
        }
      } else {
        // Handle API error responses
        const errorMessage = safelyExtractErrorMessage(response.error);
        
        // Use showError only if it's a function
        if (typeof showError === 'function') {
          showError(errorMessage);
        } else {
          console.error('Failed to complete test:', errorMessage);
        }
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error finishing test:', error);
      
      // Safely extract error message
      const errorMessage = safelyExtractErrorMessage(error);
      
      // Use showError only if it's a function
      if (typeof showError === 'function') {
        showError(errorMessage);
      }
      setIsSubmitting(false);
    }
  }, [attemptId, setIsSubmitting, showSuccess, showError, router, mode]);

  return {
    handleSelectAnswer,
    handleToggleFlag,
    handleSubmitAnswer,
    handleFinishTest,
    getTimeTaken
  };
};

export default AnswerManager;
