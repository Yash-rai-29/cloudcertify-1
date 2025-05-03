import { useCallback } from 'react';
import { submitAnswer, finishTestAttempt } from '../../utils/services/testLibraryService';

// Constants
const FLAGGED_QUESTIONS_KEY = 'flagged_questions_';

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
  router,
  submittedQuestions,
  setSubmittedQuestions,
  questionFeedbackData,
  setQuestionFeedbackData
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
      const updatedFlags = prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId];
      
      // Save to local storage
      if (typeof window !== 'undefined' && attemptId) {
        localStorage.setItem(`${FLAGGED_QUESTIONS_KEY}${attemptId}`, JSON.stringify(updatedFlags));
      }
      
      return updatedFlags;
    });
  }, [currentQuestion, setFlaggedQuestions, attemptId]);

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
    if (!currentQuestion || !attemptId) return false;
    
    const questionId = currentQuestion.id;

    // Check if this question has already been submitted
    if (submittedQuestions && submittedQuestions.includes(questionId)) {
      if (typeof showError === 'function') {
        showError('This question has already been submitted');
      }
      return false;
    }
    
    const selectedOptions = userAnswers[questionId] || [];
    
    // Skip if no options selected
    if (selectedOptions.length === 0) {
      if (typeof showError === 'function') {
        showError('Please select an answer before submitting');
      } else {
        console.error('Please select an answer before submitting');
      }
      return false; // Return false to indicate submission was not attempted
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
        // Add question to submitted questions list
        if (setSubmittedQuestions) {
          setSubmittedQuestions(prev => [...prev, questionId]);
        }
        
        // Get correct answer data
        let correctOption = response.data?.correct_option || '';
        let correctOptionIds = [];
        
        // If correct option not in response data, try to get from question data
        if ((!correctOption || correctOption === '') && currentQuestion) {
          // Try different possible field names in the question data
          if (currentQuestion.correct_options) {
            correctOption = currentQuestion.correct_options;
          } else if (currentQuestion.correct_answer) {
            correctOption = currentQuestion.correct_answer;
          } else if (currentQuestion.correct_option) {
            correctOption = currentQuestion.correct_option;
          } else if (currentQuestion.answer) {
            // Some question data might store the answer under 'answer' field
            correctOption = currentQuestion.answer;
          }
        }
        
        // Convert to array format for consistency
        if (correctOption) {
          // Handle both comma-separated strings and single values
          correctOptionIds = typeof correctOption === 'string' && correctOption.includes(',') 
            ? correctOption.split(',').map(opt => opt.trim())
            : [correctOption.trim()];
        }
        
        // Create feedback data
        const feedbackData = {
          isCorrect: response.data?.is_correct || false,
          correctOption: correctOption,
          correctOptionIds: correctOptionIds,
          explanation: response.data?.explanation || 
            currentQuestion.explanation || 
            'No explanation available for this question.',
          timeTaken: timeTaken
        };
        
        // Store feedback data for this question
        if (setQuestionFeedbackData) {
          setQuestionFeedbackData(prev => ({
            ...prev,
            [questionId]: feedbackData
          }));
        }
        
        // In practice mode, show feedback
        if (mode === 'practice') {
          setAnswerFeedback(feedbackData);
        }
        
        // In exam mode, move to next question automatically
        if (mode === 'exam') {
          // Reset the start time for the next question
          startTimeRef.current = Date.now();
          setAnswerFeedback(null);
        }
        
        return true; // Return true to indicate successful submission
      } else {
        // Handle API error responses
        const errorMessage = safelyExtractErrorMessage(response.error);
        
        if (typeof showError === 'function') {
          showError(errorMessage);
        } else {
          console.error('Error submitting answer:', errorMessage);
        }
        
        return false; // Return false to indicate submission failed
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Error submitting answer:', error);
      
      // Safely extract error message
      const errorMessage = safelyExtractErrorMessage(error);
      
      if (typeof showError === 'function') {
        showError(errorMessage);
      }
      
      return false; // Return false to indicate submission failed
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
    setAnswerFeedback,
    submittedQuestions,
    setSubmittedQuestions,
    setQuestionFeedbackData
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
        
        // Simply reload the current page to show results
        // This will trigger the TestContainer to fetch updated attempt data
        // with the 'completed' status and display results
        router.push(`/dashboard/take-test/${attemptId}`);
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
  }, [attemptId, setIsSubmitting, showSuccess, showError, router]);

  return {
    handleSelectAnswer,
    handleToggleFlag,
    handleSubmitAnswer,
    handleFinishTest,
    getTimeTaken
  };
};

export default AnswerManager;
