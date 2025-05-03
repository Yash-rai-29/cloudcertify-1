import { IconCheck, IconX, IconFlag } from '@tabler/icons-react';

/**
 * Question Navigation component for test attempts
 * Displays a grid of question numbers that can be clicked to navigate
 */
export function QuestionNavigation({ 
  questions, 
  currentIndex, 
  userAnswers, 
  flaggedQuestions, 
  onSelectQuestion,
  submittedQuestions,
  questionFeedbackData,
  mode // Add mode parameter to check if we're in exam mode
}) {
  if (!questions || questions.length === 0) {
    return null;
  }

  // Calculate the number of attempted questions for progress
  const attemptedCount = Object.keys(userAnswers).length;
  const completionPercentage = Math.round((attemptedCount / questions.length) * 100);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-sm font-medium text-gray-700 mb-3">Question Navigator</h2>
      
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => {
          const isAnswered = userAnswers[question.id];
          const isFlagged = flaggedQuestions.includes(question.id);
          const isCurrent = index === currentIndex;
          const isSubmitted = submittedQuestions && submittedQuestions.includes(question.id);
          const isCorrect = isSubmitted && questionFeedbackData && 
                           questionFeedbackData[question.id] && 
                           questionFeedbackData[question.id].isCorrect;
          
          // Determine the button color based on status
          let bgColorClass = 'bg-gray-100 text-gray-600'; // Default: Unattempted (gray)
          
          if (isCurrent) {
            bgColorClass = 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'; // Current: Blue
          } else if (mode !== 'exam' && isSubmitted) {
            // Only show correctness indicators in practice mode
            bgColorClass = isCorrect ? 
              'bg-green-100 text-green-800' : // Correct: Green
              'bg-red-100 text-red-800';      // Incorrect: Red
          } else if (isSubmitted) {
            // In exam mode, just show as attempted without indicating correctness
            bgColorClass = 'bg-blue-50 text-blue-600';
          }
          
          return (
            <button
              key={`question-${index}-${question.id}`}
              className={`w-10 h-10 text-xs font-medium flex items-center justify-center rounded transition-all 
                ${bgColorClass}
                ${isFlagged ? 'border-2 border-amber-400' : ''}
                hover:bg-gray-200 relative`}
              onClick={() => onSelectQuestion(index)}
              title={getQuestionPrompt(question)}
            >
              {index + 1}
              {isFlagged && (
                <span className="absolute -top-1 -right-1 text-amber-500">
                  <IconFlag size={12} />
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 space-y-2 border-t pt-4">
        {/* Show different legends based on mode */}
        {mode !== 'exam' ? (
          <>
            <div className="flex items-center text-xs text-gray-500">
              <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
              <span> Correct</span>
            </div>
            
            <div className="flex items-center text-xs text-gray-500">
              <div className="w-3 h-3 bg-red-100 rounded mr-2"></div>
              <span> Incorrect</span>
            </div>
          </>
        ) : (
          <div className="flex items-center text-xs text-gray-500">
            <div className="w-3 h-3 bg-blue-50 rounded mr-2"></div>
            <span>Attempted</span>
          </div>
        )}
        
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
          <span> Current question</span>
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
          <span> Unattempted</span>
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-3 h-3 border-2 border-amber-400 rounded mr-2"></div>
          <span>Flagged for review</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="text-sm font-medium text-gray-700 mb-2">Progress</div>
        <div className="flex items-center text-xs mb-1">
          <span className="text-gray-500 mr-2">Attempted:</span>
          <span className="font-medium text-gray-700">
            {attemptedCount} / {questions.length} ({completionPercentage}%)
          </span>
        </div>
        
        <div className="flex items-center text-xs mb-2">
          <span className="text-gray-500 mr-2">Flagged:</span>
          <span className="font-medium text-gray-700">
            {flaggedQuestions.length}
          </span>
        </div>
        
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper function to generate a concise question prompt for the tooltip
 */
function getQuestionPrompt(question) {
  // Use the first 50 characters of the question text as a preview
  if (!question || !question.question) return "Question";
  
  const maxLength = 50;
  const questionText = question.question.trim();
  
  if (questionText.length <= maxLength) {
    return questionText;
  }
  
  return questionText.substring(0, maxLength) + '...';
}

export default QuestionNavigation;
