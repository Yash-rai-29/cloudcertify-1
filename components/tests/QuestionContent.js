import { IconFlag, IconCheck, IconX, IconInfoCircle } from '@tabler/icons-react';
import Button from '../ui/Button';

/**
 * Question Content component for displaying a test question and handling answer selection
 */
export function QuestionContent({ 
  question, 
  questionIndex, 
  selectedOptions = [], 
  onSelectOption, 
  isFlagged, 
  onToggleFlag, 
  answerFeedback,
  mode,
  totalQuestions
}) {
  if (!question) {
    return <div className="text-center p-4">No question available</div>;
  }

  // Determine if this is a multiple choice question
  const isMultipleChoice = question.assessment_type === 'multiple_choice';
  
  // Convert options object to array for rendering
  const optionsArray = Object.entries(question.options).map(([key, value]) => ({
    id: key,
    text: value
  }));

  return (
    <div>
      {/* Question Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded mb-2">
            Question {questionIndex + 1} of {totalQuestions || '?'}
          </span>
          {question.topic && (
            <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded mb-2">
              {question.topic}
            </span>
          )}
          {question.difficulty && (
            <span className="inline-block bg-gray-100 text-gray-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded mb-2">
              {question.difficulty}
            </span>
          )}
        </div>
        
        <Button
          variant={isFlagged ? 'danger-outline' : 'outline'}
          size="sm"
          onClick={onToggleFlag}
          leftIcon={<IconFlag size={16} className={isFlagged ? 'text-red-500' : ''} />}
        >
          {isFlagged ? 'Flagged' : 'Flag for Review'}
        </Button>
      </div>
      
      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{question.question}</h3>
        {question.context && (
          <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 mb-4">
            {question.context}
          </div>
        )}
        
        {/* Question Type Indicator */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <IconInfoCircle size={16} className="mr-1" />
          <span>
            {isMultipleChoice 
              ? "Select all that apply (multiple answers)" 
              : "Select one answer only (single choice)"}
          </span>
        </div>
      </div>
      
      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {optionsArray.map((option) => {
          // Determine if this option is selected
          const isSelected = selectedOptions.includes(option.id);
          
          // Determine if this option is correct based on the API response
          let isCorrectOption = false;
          
          if (answerFeedback) {
            if (answerFeedback.correctOption === option.id) {
              isCorrectOption = true;
            } else if (answerFeedback.correctOptionIds && 
                      Array.isArray(answerFeedback.correctOptionIds) && 
                      answerFeedback.correctOptionIds.includes(option.id)) {
              isCorrectOption = true;
            }
          }
              
          const isIncorrectSelection = answerFeedback && isSelected && !isCorrectOption;
          
          // Styling based on selection and feedback state
          let optionClass = 'border rounded-md p-3 transition-all duration-150';
          if (isSelected) {
            optionClass += ' border-blue-500 bg-blue-50';
          } else {
            optionClass += ' border-gray-200 hover:border-blue-200 hover:bg-blue-50/30';
          }
          
          // Make options non-clickable when feedback is shown or in review mode
          const isClickable = !answerFeedback && mode !== 'review';
          if (isClickable) {
            optionClass += ' cursor-pointer';
          } else {
            if (isCorrectOption) {
              optionClass = 'border rounded-md p-3 border-green-500 bg-green-50';
            } else if (isIncorrectSelection) {
              optionClass = 'border rounded-md p-3 border-red-500 bg-red-50';
            }
          }
          
          return (
            <div
              key={`${question.id}-option-${option.id}`}
              className={optionClass}
              onClick={() => {
                if (!isClickable) return;
                onSelectOption(option.id, isMultipleChoice);
              }}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
                  e.preventDefault();
                  onSelectOption(option.id, isMultipleChoice);
                }
              }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  {isMultipleChoice ? (
                    // Checkbox for multiple choice
                    <div 
                      className={`w-5 h-5 rounded border ${
                        isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                      } flex items-center justify-center transition-colors`}
                      aria-hidden="true"
                    >
                      {isSelected && <IconCheck size={12} className="text-white" />}
                    </div>
                  ) : (
                    // Radio button for single choice
                    <div 
                      className={`w-5 h-5 rounded-full border ${
                        isSelected ? 'border-blue-500' : 'border-gray-300'
                      } flex items-center justify-center transition-colors`}
                      aria-hidden="true"
                    >
                      {isSelected && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">{option.id}. </span>
                  <span className="text-sm text-gray-700">{option.text}</span>
                </div>
                
                {/* Feedback indicators for practice mode */}
                {answerFeedback && (
                  <div className="ml-2">
                    {isCorrectOption && (
                      <IconCheck size={20} className="text-green-500" />
                    )}
                    {isIncorrectSelection && (
                      <IconX size={20} className="text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Answer Feedback (Practice Mode) */}
      {mode === 'practice' && answerFeedback && (
        <div className={`mt-4 p-4 rounded-md ${
          answerFeedback.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {answerFeedback.isCorrect ? (
                <IconCheck size={20} className="text-green-500" />
              ) : (
                <IconX size={20} className="text-red-500" />
              )}
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium mb-1">
                {answerFeedback.isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
              </h4>
              {!answerFeedback.isCorrect && answerFeedback.correctOption && (
                <p className="text-sm text-gray-700 mb-2">
                  Correct answer: {question.options[answerFeedback.correctOption] || ''}
                </p>
              )}
              {answerFeedback.explanation && (
                <div className="text-sm">
                  <p className="font-medium mb-1">Explanation:</p>
                  <p className="text-gray-700">{answerFeedback.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionContent;
