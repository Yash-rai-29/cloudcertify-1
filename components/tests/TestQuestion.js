import { memo } from 'react';
import QuestionContent from './QuestionContent';
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
  userAnswers,
  startTimeRef,
  submittedQuestions
}) => {
  if (!currentQuestion) {
    return <div className="text-center py-10">No question available</div>;
  }
  
  // Determine if the question has been submitted already
  const isQuestionSubmitted = submittedQuestions && submittedQuestions.includes(currentQuestion.id);
  
  // Determine if the previous/next buttons should be disabled
  const isPreviousDisabled = currentQuestionIndex === 0;
  const isNextDisabled = currentQuestionIndex === questions.length - 1;
  
  // Determine if the submit button should be disabled (no selection made or already submitted)
  const isSubmitDisabled = !selectedOptions || selectedOptions.length === 0 || isQuestionSubmitted;

  // Calculate how many questions have been answered for display in the footer
  const answeredCount = Object.keys(userAnswers).length;
  const questionsRemaining = questions.length - answeredCount;
  const completionPercentage = Math.floor((answeredCount / questions.length) * 100);

  return (
    <div className="bg-white rounded-lg shadow p-6 lg:p-8 mb-4">
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
        startTimeRef={startTimeRef}
        submittedQuestions={submittedQuestions}
      />
      
      {/* Navigation Controls */}
      <div className="flex flex-wrap md:flex-nowrap justify-between mt-8 border-t pt-4">
        <Button
          variant="outline"
          onClick={onPreviousQuestion}
          disabled={isPreviousDisabled}
          leftIcon={<IconChevronLeft size={16} />}
          className="order-1 md:order-1"
        >
          Previous
        </Button>
        
        <div className="flex items-center justify-center text-sm text-gray-500 w-full md:w-auto order-3 md:order-2 mt-4 md:mt-0">
          {completionPercentage < 100 ? (
            <span>{answeredCount} of {questions.length} questions answered ({completionPercentage}%)</span>
          ) : (
            <span className="text-green-600 font-medium">All questions answered!</span>
          )}
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-2 order-2 md:order-3">
          {mode === 'practice' && !answerFeedback && !isQuestionSubmitted && (
            <Button
              variant="primary"
              onClick={onSubmitAnswer}
              isLoading={isSubmitting}
              disabled={isSubmitDisabled}
              className="flex-1"
            >
              Check Answer
            </Button>
          )}
          
          {mode === 'practice' && isQuestionSubmitted && !answerFeedback && (
            <div className="flex-1 flex items-center justify-center bg-gray-100 text-gray-600 rounded-md px-4 py-2 text-sm font-medium">
              Answer Already Submitted
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={onNextQuestion}
            disabled={isNextDisabled}
            rightIcon={<IconChevronRight size={16} />}
            className="hidden md:flex"
          >
            Next
          </Button>
        </div>
        
        <Button
          variant="outline"
          onClick={onNextQuestion}
          disabled={isNextDisabled}
          rightIcon={<IconChevronRight size={16} />}
          className="w-full mt-2 md:hidden order-4"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default memo(TestQuestion);
