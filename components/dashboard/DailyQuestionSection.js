import React from 'react';
import ProgressBar from '../ui/ProgressBar';
import ErrorMessage from '../ui/ErrorMessage';
import Button from '../ui/Button';
import DashboardCard from '../ui/DashboardCard';

/**
 * Daily Question Section component for dashboard
 */
const DailyQuestionSection = ({
  streak,
  dailyQuestion,
  selectedOption,
  handleOptionSelect,
  handleSubmitAnswer,
  submitting,
  error
}) => {
  // Calculate streak percentage (max 30 days)
  const streakPercentage = Math.min((streak?.currentStreak || 0) / 30 * 100, 100);

  return (
    <DashboardCard title="Daily Streak Challenge" className="overflow-hidden">
      {error ? (
        <ErrorMessage
          title="Failed to load daily challenge"
          message={error}
          retry={() => window.location.reload()}
        />
      ) : dailyQuestion?.question ? (
        <div className="space-y-6">
          {/* Streak Progress */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Day {streak?.currentStreak || 0} of your streak
              </span>
              <span className="text-sm text-gray-500">Keep it going!</span>
            </div>
            <ProgressBar
              value={streakPercentage}
              variant="gradient"
              size="md"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">1 day</span>
              <span className="text-xs text-gray-500">30 days</span>
            </div>
          </div>

          {/* Daily Question */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg text-gray-800">Today's Question</h3>
            <p className="text-gray-800">{dailyQuestion.question.questionText}</p>
            
            <div className="space-y-2">
              {dailyQuestion.question.options.map((option, index) => (
                <QuestionOption
                  key={index}
                  index={index}
                  option={option}
                  dailyQuestion={dailyQuestion}
                  selectedOption={selectedOption}
                  handleOptionSelect={handleOptionSelect}
                />
              ))}
            </div>
            
            {/* Submit button or explanation */}
            {!dailyQuestion.userAttempt?.attempted ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption || submitting}
                variant="primary"
                isLoading={submitting}
                className="mt-2"
              >
                {submitting ? 'Submitting...' : 'Take Quiz'}
              </Button>
            ) : (
              <QuestionExplanation dailyQuestion={dailyQuestion} />
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No daily question available today</p>
        </div>
      )}
    </DashboardCard>
  );
};

/**
 * Question Option component
 */
const QuestionOption = ({ index, option, dailyQuestion, selectedOption, handleOptionSelect }) => {
  // Determine option state styling
  let optionClass = 'bg-white border-gray-200 hover:bg-gray-50';
  
  if (dailyQuestion.userAttempt?.attempted) {
    if (dailyQuestion.userAttempt?.answer === option && dailyQuestion.userAttempt?.isCorrect) {
      optionClass = 'bg-green-50 border-green-200';
    } else if (dailyQuestion.userAttempt?.answer === option && !dailyQuestion.userAttempt?.isCorrect) {
      optionClass = 'bg-red-50 border-red-200';
    } else if (option === dailyQuestion.question.correctAnswer) {
      optionClass = 'bg-green-50 border-green-200';
    }
  } else if (selectedOption === option) {
    optionClass = 'bg-blue-50 border-blue-200';
  }

  return (
    <div 
      onClick={() => handleOptionSelect(option)}
      className={`p-3 border rounded-lg cursor-pointer transition-colors ${optionClass}`}
    >
      <div className="flex items-center">
        <div className="mr-3 h-5 w-5 flex items-center justify-center rounded-full border border-gray-300">
          {String.fromCharCode(65 + index)}
        </div>
        <span>{option}</span>
      </div>
    </div>
  );
};

/**
 * Question Explanation component
 */
const QuestionExplanation = ({ dailyQuestion }) => {
  const isCorrect = dailyQuestion.userAttempt?.isCorrect;
  const bgColorClass = isCorrect ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200';
  
  return (
    <div className={`mt-4 p-4 rounded-lg border ${bgColorClass}`}>
      <h3 className="font-medium text-gray-800 mb-2">
        {isCorrect ? 'Correct! Great job!' : 'Not quite right. Here\'s the explanation:'}
      </h3>
      <p className="text-gray-700">{dailyQuestion.question.explanation}</p>
    </div>
  );
};

export default DailyQuestionSection;