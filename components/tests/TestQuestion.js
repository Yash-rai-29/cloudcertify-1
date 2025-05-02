import { memo } from 'react';
import QuestionContent from './QuestionContent';
import QuestionNavigation from './QuestionNavigation';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Button from '../ui/Button';

/**
 * TestQuestion component - Displays a single question in the test
 * This is a focused component to handle just the question display and navigation
 */
const TestQuestion = ({ 
  currentQuestion,
  currentQuestionIndex,
  questions,
  selectedOptions,
  onSelectOption,
  answerFeedback,
  mode,
  isFlagged,
  onToggleFlag,
  onPreviousQuestion,
  onNextQuestion,
  onFinishTest,
  onSubmitAnswer,
  isSubmitting,
  userAnswers
}) => {
  if (!currentQuestion) {
    return <div className="text-center py-10">No question available</div>;
  }
  
  // Determine if the previous/next buttons should be disabled
  const isPreviousDisabled = currentQuestionIndex === 0;
  const isNextDisabled = currentQuestionIndex === questions.length - 1;
  
  // Determine if the submit button should be disabled (no selection made)
  const isSubmitDisabled = !selectedOptions || selectedOptions.length === 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Question Content */}
      <QuestionContent 
        question={currentQuestion}
        questionIndex={currentQuestionIndex}
        selectedOptions={selectedOptions}
        onSelectOption={onSelectOption}
        isFlagged={isFlagged}
        onToggleFlag={onToggleFlag}
        answerFeedback={answerFeedback}
        mode={mode}
        totalQuestions={questions.length}
      />
      
      {/* Navigation Controls */}
      <div className="flex justify-between mt-8 border-t pt-4">
        <Button
          variant="outline"
          onClick={onPreviousQuestion}
          disabled={isPreviousDisabled}
          leftIcon={<IconChevronLeft size={16} />}
        >
          Previous
        </Button>
        
        <div>
          {mode === 'practice' && !answerFeedback && (
            <Button
              variant="primary"
              onClick={onSubmitAnswer}
              isLoading={isSubmitting}
              disabled={isSubmitDisabled}
              className="mr-3"
            >
              Check Answer
            </Button>
          )}
          
          <Button
            variant="danger"
            onClick={onFinishTest}
          >
            Finish Test
          </Button>
        </div>
        
        <Button
          variant="outline"
          onClick={onNextQuestion}
          disabled={isNextDisabled}
          rightIcon={<IconChevronRight size={16} />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default memo(TestQuestion);
