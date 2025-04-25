import { useState } from 'react';
import { IconFlame } from '@tabler/icons-react';
import { getDailyQuestion } from '../../utils/services/dashboardService';
import QuestionModal from './QuestionModal';
import Section from './Section';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { showError } from '../../utils/toast';

/**
 * Daily Streak Challenge component for dashboard
 * @param {Object} props - Component props
 * @param {Object} props.question - Daily question data (fetch indicator)
 * @param {Object} props.streak - User streak data
 * @param {Function} props.onStreakUpdate - Callback when streak is updated
 * @param {string} props.className - Additional CSS classes
 */
export default function DailyQuestionSection({ question: initialQuestion, streak, onStreakUpdate, className }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questionData, setQuestionData] = useState(initialQuestion); 
 
  // Handle click on Take Question button
  const handleTakeQuestion = async () => {
    setIsLoading(true);
    
    try {
      // Fetch the daily question when user clicks "Take Question"
      const response = await getDailyQuestion();
      
      if (response.success && response.data?.question) {
        setQuestionData(response.data.question);
        setIsModalOpen(true);
      } else {
        showError('Failed to load the daily question. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching daily question:', error);
      showError('An error occurred while loading the daily question.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Called when a daily question is successfully answered
  const handleQuestionSubmitted = (updatedStreak) => {
    if (onStreakUpdate) {
      onStreakUpdate(updatedStreak);
    }
  };
  
  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // Generate streak display
  const renderStreakIndicator = () => {
    const streakCount = streak?.streak || 0;
    const streakClass = streakCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200';
    
    return (
      <div className={`flex items-center px-4 py-2 rounded-t-lg border ${streakClass} border-b-0`}>
        <div className={`p-1.5 rounded-full ${streakCount > 0 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
          <IconFlame size={18} />
        </div>
        <div className="ml-2">
          <p className={`text-sm font-medium ${streakCount > 0 ? 'text-amber-800' : 'text-gray-700'}`}>
            {streakCount === 0 
              ? 'Start your streak today!' 
              : `${streakCount} day${streakCount !== 1 ? 's' : ''} streak! 🔥`
            }
          </p>
        </div>
        
        <div className="ml-auto">
          <Badge variant="orange" size="sm">
            Day {streakCount}
          </Badge>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <Section
        title="Daily Streak Challenge"
        description="Maintain Your Learning Streak"
        className={className}
        headerContent={
          <Badge 
            variant="blue"
            size="sm"
          >
            Question of the Day
          </Badge>
        }
      >
        <div className="overflow-hidden relative">
          {renderStreakIndicator()}
          
          <div className="bg-white rounded-b-lg border border-gray-200 overflow-hidden px-5 py-4">
            <p className="text-sm text-gray-600 mb-1">
              Consistency is key to mastering GCP. Complete the daily question to maintain your streak.
            </p>
            
            <div className="flex justify-between items-center mt-3">
              <p className="text-sm text-gray-500">
                Answer one question to maintain your streak
              </p>
              
              <Button
                onClick={handleTakeQuestion}
                isLoading={isLoading}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                size="sm"
                leftIcon={
                  <div className="w-5 h-5 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-white">
                    {streak?.streak > 0 ? '🔥' : '✓'}
                  </div>
                }
              >
                Take Question
              </Button>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <strong>Pro tip:</strong> Answer daily questions to boost your readiness for the exam.
              </p>
            </div>
          </div>
        </div>
      </Section>
      
      {/* Question Modal */}
      <QuestionModal
        question={questionData}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmitSuccess={handleQuestionSubmitted}
      />
    </>
  );
}