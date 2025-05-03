import { IconClock, IconProgressCheck, IconMenu2, IconLogout } from '@tabler/icons-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

/**
 * Test Header component for displaying test information and progress
 */
export function TestHeader({ 
  test, 
  mode, 
  timeRemaining, 
  formatTime, 
  currentQuestionIndex, 
  totalQuestions, 
  percentComplete,
  onToggleNavigation,
  onFinishTest
}) {
  if (!test) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-start">
          {/* Mobile navigation toggle button */}
          <button 
            className="mr-3 md:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100"
            onClick={onToggleNavigation}
            aria-label="Toggle question navigation"
          >
            <IconMenu2 size={24} />
          </button>
          
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-xl font-bold text-gray-900 mr-3">{test.title}</h1>
              <Badge variant={mode === 'practice' ? 'blue' : 'purple'}>
                {mode === 'practice' ? 'Practice Mode' : 'Exam Mode'}
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <div className="flex items-center">
                <IconProgressCheck size={16} className="mr-1 text-gray-400" />
                <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              </div>
              
              {test.total_questions && (
                <div className="flex items-center">
                  <span>{percentComplete}% complete</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 gap-3">
          {/* Exam Timer */}
          {mode === 'exam' && timeRemaining && (
            <div className={`flex items-center px-3 py-2 rounded-md ${
              timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <IconClock size={20} className="mr-2" />
              <div>
                <div className="text-xs font-medium">Time Remaining</div>
                <div className="text-lg font-bold">{formatTime(timeRemaining)}</div>
              </div>
            </div>
          )}
          
          {/* Finish Test Button */}
          <Button
            variant="danger"
            onClick={onFinishTest}
            className="whitespace-nowrap"
            leftIcon={<IconLogout size={16} />}
          >
            Finish Test
          </Button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${percentComplete}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default TestHeader;
