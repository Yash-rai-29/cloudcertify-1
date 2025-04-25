import { useState, useEffect } from 'react';
import { IconX, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import Button from '../ui/Button';
import { cn } from '../../utils/helpers';
import { submitDailyAnswer } from '../../utils/services/dashboardService';
import { showSuccess, showError } from '../../utils/toast';

/**
 * Question Modal component for displaying the daily question
 * 
 * @param {Object} props - Component props
 * @param {Object} props.question - Question data
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmitSuccess - Function called on successful answer submission
 */
export default function QuestionModal({ 
  question,
  isOpen,
  onClose,
  onSubmitSuccess
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Reset state when question changes
  useEffect(() => {
    if (question) {
      setSelectedOption(null);
      setFeedback(null);
    }
  }, [question]);

  if (!isOpen || !question) return null;

  const handleOptionSelect = (option) => {
    if (feedback) return;
    setSelectedOption(option);
  };

  const handleSubmit = async () => {
    if (!selectedOption || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await submitDailyAnswer(question.id, selectedOption);
      if (response.success) {
        setFeedback({
          isCorrect: response.data.is_correct,
          explanation: response.data.explanation,
          streak: response.data.streak
        });
        
        if (response.data.is_correct) {
          showSuccess('Correct answer! Your streak has been maintained.');
        } else {
          showError('That wasn\'t the correct answer. Keep learning!');
        }
        
        // Call the success callback with the updated streak data
        onSubmitSuccess({
          streak: response.data.streak,
          last_streak_date: response.data.last_streak_date
        });
      } else {
        setFeedback({
          isCorrect: false,
          explanation: 'Failed to submit answer. Please try again.',
          streak: 0
        });
        showError('Failed to submit answer. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setFeedback({
        isCorrect: false,
        explanation: 'An error occurred while submitting your answer.',
        streak: 0
      });
      showError('An error occurred while submitting your answer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-md mx-auto my-6">
        {/* Modal content */}
        <div className="relative flex flex-col bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-blue-600 text-white rounded-t-lg">
            <h3 className="text-lg font-medium">Question of the Day</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm">
                <span className="bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center mr-1.5">
                  <IconCheck size={12} />
                </span>
                <span>Streak Day: {feedback?.streak || question.streak || 0}</span>
              </div>
              <button
                className="text-white hover:text-gray-200 focus:outline-none"
                onClick={onClose}
              >
                <IconX size={20} />
              </button>
            </div>
          </div>
          
          {!feedback ? (
            <>
              {/* Question */}
              <div className="p-6 border-b border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">{question.question_text}</h4>
                
                <div className="space-y-3">
                  {question.options && question.options.map((option, index) => {
                    const isSelected = selectedOption === option;
                    
                    return (
                      <div
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className={cn(
                          'p-4 border rounded-lg flex items-start cursor-pointer transition-colors relative',
                          isSelected ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                        )}
                      >
                        <div className="mr-3">
                          <div className={cn(
                            'w-5 h-5 rounded-full border flex items-center justify-center',
                            isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
                          )}>
                            {isSelected && <IconCheck size={12} />}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{option}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedOption || isSubmitting}
                  isLoading={isSubmitting}
                >
                  Submit Answer
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Feedback */}
              <div className={cn(
                'p-6',
                feedback.isCorrect ? 'bg-green-50' : 'bg-red-50'
              )}>
                <div className="flex items-start">
                  <div className={cn(
                    'p-2 rounded-full mr-3',
                    feedback.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  )}>
                    {feedback.isCorrect ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
                  </div>
                  <div>
                    <h4 className={cn(
                      'text-lg font-medium mb-2',
                      feedback.isCorrect ? 'text-green-800' : 'text-red-800'
                    )}>
                      {feedback.isCorrect ? 'Correct!' : 'Incorrect!'}
                    </h4>
                    <p className="text-gray-700">{feedback.explanation}</p>
                  </div>
                </div>
                
                {feedback.isCorrect && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-blue-800 flex items-center">
                    <IconCheck size={16} className="mr-2 text-blue-500" />
                    <span>Streak maintained!</span>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 flex justify-end">
                <Button
                  onClick={handleContinue}
                  variant={feedback.isCorrect ? 'success' : 'primary'}
                >
                  Continue
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}