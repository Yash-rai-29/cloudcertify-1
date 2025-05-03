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
  onSelectQuestion 
}) {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-sm font-medium text-gray-700 mb-3">Question Navigator</h2>
      
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => {
          const isAnswered = userAnswers[question.id];
          const isFlagged = flaggedQuestions.includes(question.id);
          const isCurrent = index === currentIndex;
          
          return (
            <button
              key={`question-${index}-${question.id}`}
              className={`w-8 h-8 text-xs font-medium flex items-center justify-center rounded transition-all 
                ${isCurrent ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                ${isAnswered ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                ${isFlagged ? 'border-2 border-amber-400' : ''}
                hover:bg-gray-200`}
              onClick={() => onSelectQuestion(index)}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 space-y-2 border-t pt-4">
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
          <span>Answered</span>
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
          <span>Unanswered</span>
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-3 h-3 border-2 border-amber-400 rounded mr-2"></div>
          <span>Flagged for review</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="text-sm font-medium text-gray-700 mb-2">Progress</div>
        <div className="flex items-center text-xs mb-1">
          <span className="text-gray-500 mr-2">Answered:</span>
          <span className="font-medium text-gray-700">
            {Object.keys(userAnswers).length} / {questions.length}
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
            style={{ width: `${Math.round((Object.keys(userAnswers).length / questions.length) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default QuestionNavigation;
