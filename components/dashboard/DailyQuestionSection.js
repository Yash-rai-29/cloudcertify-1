import { useState, useEffect } from 'react';
import { FiFire, FiCalendar, FiChevronRight } from 'react-icons/fi';
import { getDailyQuestion, trackUserActivity } from '../../utils/services/activityService';
import Section from './Section';
import QuestionModal from './QuestionModal';
import { showSuccess, showError } from '../../utils/toast';

/**
 * Daily Streak Challenge component for dashboard
 * @param {Object} props - Component props
 * @param {Object} props.streak - User streak data
 * @param {Function} props.onStreakUpdate - Callback when streak is updated
 * @param {string} props.className - Additional CSS classes
 */
export default function DailyQuestionSection({ streak, onStreakUpdate, className }) {
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [questionAttempted, setQuestionAttempted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchDailyQuestion = async () => {
      setLoading(true);
      try {
        const response = await getDailyQuestion();
        if (response.success) {
          setQuestion(response.data.question);
          setQuestionAttempted(response.data.attempted || false);
        }
      } catch (error) {
        console.error('Error fetching daily question:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyQuestion();
  }, []);

  const handleTakeQuestion = () => {
    if (questionAttempted) {
      showSuccess('You\'ve already answered today\'s question. Come back tomorrow!');
      return;
    }
    
    trackUserActivity('open_daily_question');
    setIsModalOpen(true);
  };

  const handleQuestionSuccess = (updatedStreak) => {
    setQuestionAttempted(true);
    if (onStreakUpdate && updatedStreak) {
      onStreakUpdate(updatedStreak);
    }

    // Show success message
    const streakMessage = updatedStreak?.current_streak > 1 
      ? `Your streak is now ${updatedStreak.current_streak} days!` 
      : 'Great job on your first daily question!';
      
    showSuccess(`Correct answer! ${streakMessage}`);
  };

  const handleQuestionError = (error) => {
    showError(error || 'There was a problem submitting your answer.');
  };

  return (
    <Section
      title="Daily Streak Challenge"
      description="Answer a question every day to build your streak and improve your knowledge."
      className={className}
    >
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiFire className="text-amber-500" size={20} />
                <span className="text-gray-700 font-medium">Current Streak:</span>
                <span className="text-amber-500 font-semibold text-xl">{streak?.current_streak || 0}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCalendar className="text-blue-500" size={20} />
                <span className="text-gray-700 font-medium">Longest Streak:</span>
                <span className="text-blue-500 font-semibold text-xl">{streak?.longest_streak || 0}</span>
              </div>
            </div>
            <div>
              <button 
                onClick={handleTakeQuestion}
                disabled={loading || !question}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                  questionAttempted 
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                } ${loading || !question ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>
                  {loading 
                    ? 'Loading...' 
                    : questionAttempted
                      ? 'Completed Today'
                      : 'Take Daily Question'}
                </span>
                {!loading && !questionAttempted && (
                  <FiChevronRight className="ml-1" size={16} />
                )}
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-medium text-gray-800 mb-1">Today's Question</h4>
            {loading ? (
              <div className="animate-pulse h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
            ) : question ? (
              <p className="text-gray-600 mb-2 line-clamp-2">{question.text}</p>
            ) : (
              <p className="text-gray-500 italic">No question available for today.</p>
            )}
          </div>
        </div>
      </div>

      {question && (
        <QuestionModal
          question={question}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmitSuccess={handleQuestionSuccess}
          onSubmitError={handleQuestionError}
        />
      )}
    </Section>
  );
}