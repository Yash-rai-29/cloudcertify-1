import { useState } from 'react';
import { IconCheck, IconX, IconClock, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import Button from '../../ui/Button';

/**
 * Questions Results List Component
 * Displays a list of answered and unanswered questions from a test attempt
 */
const QuestionsResultsList = ({
  attemptedQuestions = [],
  unattemptedQuestions = [],
  formatTimeTaken,
  showAllQuestions,
  setShowAllQuestions
}) => {
  // If we don't have any questions, show a fallback message
  if (!attemptedQuestions.length && !unattemptedQuestions.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6 text-center">
        <p className="text-gray-500">No question data available for this test.</p>
      </div>
    );
  }

  // Default to showing first 5 questions only
  const questionsToShow = showAllQuestions 
    ? attemptedQuestions 
    : attemptedQuestions.slice(0, 5);

  return (
    <div className="mt-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Questions</h2>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">
              <span className="font-medium">{attemptedQuestions.length}</span> attempted
              {unattemptedQuestions.length > 0 && (
                <span>, <span className="font-medium">{unattemptedQuestions.length}</span> skipped</span>
              )}
            </span>
          </div>
        </div>

        {/* Attempted Questions */}
        {questionsToShow.length > 0 && (
          <div className="divide-y divide-gray-200">
            {questionsToShow.map((question, index) => (
              <div key={question.id || index} className="p-4 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 rounded-full w-6 h-6 flex items-center justify-center mr-3 ${
                    question.is_correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {question.is_correct ? <IconCheck size={16} /> : <IconX size={16} />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        Question {index + 1}
                      </h3>
                      {question.time_taken && (
                        <div className="flex items-center text-xs text-gray-500">
                          <IconClock size={14} className="mr-1" />
                          {formatTimeTaken(question.time_taken)}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{question.text || question.question}</p>
                    
                    <div className="mt-2 text-sm">
                      <div className="flex items-start mt-1">
                        <div className="mr-2 font-medium text-gray-700">Your answer:</div>
                        <div className={question.is_correct ? 'text-green-600' : 'text-red-600'}>
                          {renderAnswer(question.selected_option, question.options)}
                        </div>
                      </div>
                      
                      {!question.is_correct && (
                        <div className="flex items-start mt-1">
                          <div className="mr-2 font-medium text-gray-700">Correct answer:</div>
                          <div className="text-green-600">
                            {renderAnswer(question.correct_option, question.options)}
                          </div>
                        </div>
                      )}
                      
                      {question.explanation && (
                        <div className="mt-2 bg-blue-50 p-3 rounded text-blue-700 text-sm">
                          <p className="font-medium mb-1">Explanation:</p>
                          <p>{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show more/less button */}
        {attemptedQuestions.length > 5 && (
          <div className="border-t border-gray-200 px-6 py-3">
            <Button
              variant="ghost"
              onClick={() => setShowAllQuestions(!showAllQuestions)}
              className="w-full justify-center"
            >
              {showAllQuestions ? (
                <>
                  <span>Show Less</span>
                  <IconChevronUp size={16} className="ml-1" />
                </>
              ) : (
                <>
                  <span>Show All Questions ({attemptedQuestions.length})</span>
                  <IconChevronDown size={16} className="ml-1" />
                </>
              )}
            </Button>
          </div>
        )}
        
        {/* Unattempted Questions */}
        {showAllQuestions && unattemptedQuestions.length > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <div className="px-6 py-2 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-500">Unattempted Questions</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {unattemptedQuestions.map((question, index) => (
                <div key={question.id || index} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 rounded-full w-6 h-6 flex items-center justify-center mr-3 bg-gray-100 text-gray-400">
                      <span className="text-xs">{index + 1 + attemptedQuestions.length}</span>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 mb-2">{question.text || question.question}</p>
                      
                      <div className="mt-2 text-sm">
                        <div className="flex items-start mt-1">
                          <div className="mr-2 font-medium text-gray-700">Correct answer:</div>
                          <div className="text-green-600">
                            {renderAnswer(question.correct_option, question.options)}
                          </div>
                        </div>
                        
                        {question.explanation && (
                          <div className="mt-2 bg-blue-50 p-3 rounded text-blue-700 text-sm">
                            <p className="font-medium mb-1">Explanation:</p>
                            <p>{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to render answers properly
function renderAnswer(answer, options = {}) {
  if (!answer) return 'Not answered';
  
  // Handle array of answers (multiple choice)
  if (Array.isArray(answer)) {
    if (answer.length === 0) return 'Not answered';
    return answer.map(opt => options[opt] || opt).join(', ');
  }
  
  // Handle object with selected_option property
  if (typeof answer === 'object' && answer.selected_option) {
    return renderAnswer(answer.selected_option, options);
  }
  
  // Handle single answer (string or other primitive)
  return options[answer] || answer;
}

export default QuestionsResultsList;