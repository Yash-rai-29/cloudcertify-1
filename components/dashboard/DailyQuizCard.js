import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconFlame, 
  IconBrain, 
  IconArrowRight, 
  IconConfetti, 
  IconCalendarEvent, 
  IconCheck 
} from '@tabler/icons-react';
import { getDailyQuestion } from '../../utils/services/dashboardService';

export default function DailyQuizCard({ onStartQuiz, streakData }) {
  const [hasAttempted, setHasAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedApiDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const formattedDisplayDate = today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
    
    setTodayDate(formattedDisplayDate);
    checkDailyQuizStatus(formattedApiDate);
  }, []);

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

  if (isLoading) {
    return (
      <motion.div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="h-4 bg-gray-200 rounded w-1/3 mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <motion.div 
          className="h-6 bg-gray-200 rounded w-3/4 mb-3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
        />
        <motion.div 
          className="h-4 bg-gray-200 rounded w-1/2 mb-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
        />
        <div className="flex justify-between items-center">
          <motion.div 
            className="h-8 bg-gray-200 rounded w-1/4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
          />
          <motion.div 
            className="h-8 bg-gray-200 rounded w-1/4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.8 }}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      whileHover={{ 
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      <AnimatePresence mode="wait">
        {hasAttempted ? (
          <motion.div 
            className="p-5"
            key="completed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <motion.h3 
                  className="text-lg font-medium text-gray-900 flex items-center"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <IconConfetti className="h-5 w-5 mr-2 text-yellow-500" />
                  Daily Challenge Completed!
                </motion.h3>
                <motion.p 
                  className="text-gray-600 flex items-center mt-1"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <IconCalendarEvent className="h-4 w-4 mr-1 text-gray-400" />
                  {todayDate}
                </motion.p>
              </div>
              <motion.div 
                className="flex items-center text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.4 }}
              >
                <IconFlame className="h-5 w-5 mr-1" />
                <span className="font-medium">{streakData?.current_streak || 0} day streak</span>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex items-center justify-between mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.p 
                className="text-green-600 font-medium flex items-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <IconCheck className="h-5 w-5 mr-1" />
                Great job! Return tomorrow for your next challenge.
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="not-completed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-white"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <IconBrain className="h-5 w-5 mr-2" />
                  </motion.div>
                  Today's Challenge
                </h3>
                <span className="text-sm">{todayDate}</span>
              </div>
            </motion.div>
            
            <div className="p-5">
              <motion.p 
                className="text-lg font-medium mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Test your cloud knowledge with the daily question!
              </motion.p>
              
              <div className="flex items-center justify-between">
                <motion.div 
                  className="flex items-center text-orange-500"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <IconFlame className="h-5 w-5 mr-1" />
                  </motion.div>
                  <span className="font-medium">Current streak: {streakData?.current_streak || 0}</span>
                </motion.div>
                
                <motion.button
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                  onClick={onStartQuiz}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Challenge
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <IconArrowRight className="h-4 w-4 ml-2" />
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
