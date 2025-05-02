import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconFlame, IconBrain, IconArrowRight } from '@tabler/icons-react';
import { getDailyQuestion } from '../../utils/services/dashboardService';

/**
 * Component to display daily quiz challenge on the dashboard
 * @param {Object} props - Component props
 * @param {Function} props.onStartQuiz - Function to call when starting the quiz
 * @param {Object} props.streakData - Current streak data
 */
export default function DailyQuizCard({ onStartQuiz, streakData }) {
  const [hasAttempted, setHasAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [todayDate, setTodayDate] = useState('');

  // Format current date as YYYY-MM-DD and more readable format
  useEffect(() => {
    const today = new Date();
    const formattedApiDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const formattedDisplayDate = today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
    
    setTodayDate(formattedDisplayDate);
    
    // Check if user has attempted today's question
    checkDailyQuizStatus(formattedApiDate);
  }, []);

  /**
   * Check if user has already attempted today's question
   * @param {string} date - Formatted date string (YYYY-MM-DD)
   */
  const checkDailyQuizStatus = async (date) => {
    setIsLoading(true);
    
    try {
      const response = await getDailyQuestion(date);
      
      if (response.success && response.data) {
        setHasAttempted(response.data.user_attempt.attempted);
      }
    } catch (error) {
      console.error('Error checking daily quiz status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If loading, show a skeleton loader
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {hasAttempted ? (
        // User has attempted today's question
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Daily Challenge Completed!</h3>
              <p className="text-gray-600">{todayDate}</p>
            </div>
            <div className="flex items-center text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full">
              <IconFlame className="h-5 w-5 mr-1" />
              <span className="font-medium">{streakData?.current_streak || 0} day streak</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-green-600 font-medium">
              Great job! Return tomorrow for your next challenge.
            </p>
          </div>
        </div>
      ) : (
        // User hasn't attempted today's question
        <div>
          {/* Colorful header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center">
                <IconBrain className="h-5 w-5 mr-2" />
                Today's Challenge
              </h3>
              <span className="text-sm">{todayDate}</span>
            </div>
          </div>
          
          <div className="p-5">
            <p className="text-lg font-medium mb-4">
              Test your cloud knowledge with the daily question!
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-orange-500">
                <IconFlame className="h-5 w-5 mr-1" />
                <span className="font-medium">Current streak: {streakData?.current_streak || 0}</span>
              </div>
              
              <motion.button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                onClick={onStartQuiz}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Challenge
                <IconArrowRight className="h-4 w-4 ml-2" />
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
