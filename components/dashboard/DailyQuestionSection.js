import { useState } from 'react';
import { IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react';
import { submitDailyAnswer } from '../../utils/services/dashboardService';
import Section from './Section';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { cn } from '../../utils/helpers';

/**
 * Daily Question Section component for dashboard
 */
export default function DailyQuestionSection({ question, className }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnswered, setIsAnswered] = useState(!!question?.user_answer);
  const [feedback, setFeedback] = useState(null);
  
  // Handle option selection
  const handleOptionSelect = (optionId) => {
    if (isAnswered) return;
    setSelectedOption(optionId);
  };
  
  // Handle submit answer
  const handleSubmit = async () => {
    if (!selectedOption || isAnswered || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await submitDailyAnswer(question.id, selectedOption);
      if (response.success) {
        setIsAnswered(true);
        setFeedback({
          isCorrect: response.data.is_correct,
          explanation: response.data.explanation
        });
      } else {
        setFeedback({
          isCorrect: false,
          explanation: 'Failed to submit answer. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setFeedback({
        isCorrect: false,
        explanation: 'An error occurred while submitting your answer.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If no question is available
  if (!question) {
    return (
      <Section 
        title="Daily Question"
        description="Maintain your learning streak by answering the daily question"
        className={className}
      >
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-500">No daily question available. Check back later!</p>
        </div>
      </Section>
    );
  }
  
  // Determine if user has already answered the question
  const userAnswer = question.user_answer || selectedOption;
  const correctAnswer = isAnswered ? question.correct_option_id : null;
  
  return (
    <Section
      title="Daily Question"
      description="Maintain your learning streak by answering the daily question"
      className={className}
      headerContent={
        <Badge 
          variant={question.category_color || 'blue'} 
          size="sm"
        >
          {question.category}
        </Badge>
      }
    >
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
        {/* Question header */}
        <div className="p-5 border-b border-gray-200 relative">
          <h3 className="font-medium text-gray-900">{question.question_text}</h3>
        </div>
        
        {/* Options */}
        <div className="p-5 relative">
          <div className="space-y-3 relative">
            {question.options && question.options.map((option) => {
              const isSelected = userAnswer === option.id;
              const isCorrect = correctAnswer === option.id;
              
              let optionClass = 'border-gray-200 bg-white hover:bg-gray-50';
              
              if (isAnswered) {
                if (isCorrect) {
                  optionClass = 'border-green-200 bg-green-50';
                } else if (isSelected && !isCorrect) {
                  optionClass = 'border-red-200 bg-red-50';
                }
              } else if (isSelected) {
                optionClass = 'border-blue-200 bg-blue-50';
              }
              
              return (
                <QuestionOption
                  key={option.id}
                  option={option}
                  isSelected={isSelected}
                  isCorrect={isAnswered && isCorrect}
                  isIncorrect={isAnswered && isSelected && !isCorrect}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={isAnswered}
                  className={optionClass}
                />
              );
            })}
          </div>
          
          {/* Submit button */}
          {!isAnswered && (
            <div className="mt-6">
              <Button
                onClick={handleSubmit}
                disabled={!selectedOption || isSubmitting}
                isLoading={isSubmitting}
                fullWidth
              >
                Submit Answer
              </Button>
            </div>
          )}
          
          {/* Explanation */}
          {isAnswered && feedback && (
            <QuestionExplanation 
              isCorrect={feedback.isCorrect}
              explanation={feedback.explanation || question.explanation}
            />
          )}
        </div>
      </div>
    </Section>
  );
}

/**
 * Question Option component
 */
function QuestionOption({ 
  option, 
  isSelected, 
  isCorrect, 
  isIncorrect,
  onClick, 
  disabled,
  className 
}) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={cn(
        'p-4 border rounded-lg flex items-start cursor-pointer transition-colors relative',
        disabled && !isSelected && 'opacity-70 cursor-default',
        className
      )}
    >
      <div className="flex-1 relative">
        <p className="text-sm font-medium text-gray-900">{option.text}</p>
      </div>
      
      <div className="ml-3 relative">
        {isCorrect && (
          <div className="p-1 bg-green-100 rounded-full text-green-600 relative">
            <IconCheck size={16} />
          </div>
        )}
        {isIncorrect && (
          <div className="p-1 bg-red-100 rounded-full text-red-600 relative">
            <IconX size={16} />
          </div>
        )}
        {isSelected && !isCorrect && !isIncorrect && (
          <div className="p-1 bg-blue-100 rounded-full text-blue-600 relative">
            <IconCheck size={16} />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Question Explanation component
 */
function QuestionExplanation({ isCorrect, explanation }) {
  return (
    <div className={cn(
      'mt-6 p-4 rounded-lg relative',
      isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
    )}>
      <div className="flex items-start relative">
        <div className={cn(
          'p-1 rounded-full mr-3 relative',
          isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        )}>
          {isCorrect ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
        </div>
        <div className="relative">
          <p className={cn(
            'text-sm font-medium',
            isCorrect ? 'text-green-800' : 'text-red-800'
          )}>
            {isCorrect ? 'Correct!' : 'Incorrect!'}
          </p>
          <p className="mt-1 text-sm text-gray-700">{explanation}</p>
        </div>
      </div>
    </div>
  );
}