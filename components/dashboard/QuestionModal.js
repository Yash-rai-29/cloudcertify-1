import { useState } from 'react';
import { submitDailyQuestionAnswer } from '../../utils/services/activityService';
import { FiX, FiCheck, FiLoader } from 'react-icons/fi';

/**
 * Question Modal component for displaying the daily question
 *
 * @param {Object} props - Component props
 * @param {Object} props.question - Question data
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onSubmitSuccess - Function called on successful answer submission
 * @param {Function} props.onSubmitError - Function called on answer submission error
 */
export default function QuestionModal({
  question,
  isOpen,
  onClose,
  onSubmitSuccess,
  onSubmitError
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // { correct: boolean, feedback: string }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedOption) {
      setError('Please select an answer option');
      return;
    }

    setSubmitting(true);
    setError(null);
    
    try {
      const response = await submitDailyQuestionAnswer(question.id, selectedOption);
      
      if (response.success) {
        setResult({
          correct: response.data.correct,
          feedback: response.data.feedback || 'Answer submitted successfully.'
        });
        
        if (response.data.correct && onSubmitSuccess) {
          onSubmitSuccess(response.data.streak);
        } else if (!response.data.correct && onSubmitError) {
          onSubmitError('That answer was incorrect. Try again tomorrow!');
        }
        
        // Auto-close on success after a delay
        if (response.data.correct) {
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } else {
        setError(response.error || 'Failed to submit answer.');
        if (onSubmitError) {
          onSubmitError(response.error);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      if (onSubmitError) {
        onSubmitError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle option selection
  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    setError(null);
  };

  // Reset modal state when closing
  const handleClose = () => {
    if (!submitting) {
      setSelectedOption(null);
      setError(null);
      setResult(null);
      onClose();
    }
  };

  // Early return if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
          onClick={handleClose}
          aria-hidden="true"
        />
        
        {/* Modal panel */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {/* Close button */}
          <button
            onClick={handleClose}
            disabled={submitting}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
          
          {/* Modal content */}
          <div className="mt-2">
            <h3 className="text-xl font-semibold text-gray-800">Daily Challenge Question</h3>
            
            {/* Question text */}
            <div className="mt-4 mb-6">
              <p className="text-gray-700">{question.text}</p>
            </div>
            
            {/* Options */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                {question.options?.map((option) => (
                  <label
                    key={option.id}
                    className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedOption === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    } ${
                      result && option.id === selectedOption
                        ? result.correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                        : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="question-option"
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={() => handleOptionSelect(option.id)}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                        disabled={submitting || result !== null}
                      />
                      <span className="text-gray-700">{option.text}</span>
                      
                      {/* Success/error icon for selected option */}
                      {result && option.id === selectedOption && (
                        <span className="ml-auto">
                          {result.correct ? (
                            <FiCheck className="text-green-500" size={18} />
                          ) : (
                            <FiX className="text-red-500" size={18} />
                          )}
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              
              {/* Error message */}
              {error && (
                <div className="mt-3 text-sm text-red-600">{error}</div>
              )}
              
              {/* Result message */}
              {result && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  result.correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                  {result.feedback}
                </div>
              )}
              
              {/* Submit button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={submitting}
                  className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedOption || result !== null}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <FiLoader className="animate-spin mr-2" size={16} />
                      Submitting...
                    </div>
                  ) : (
                    'Submit Answer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}