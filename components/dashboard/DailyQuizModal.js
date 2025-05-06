import { useState, useEffect } from 'react';
import { getDailyQuestion, submitDailyAnswer } from '../../utils/services/dashboardService';
import { IconX, IconFlame, IconCheck, IconX as IconClose, IconBrain, IconConfetti } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLoading } from '../../contexts/LoadingContext';

const CORRECT_QUOTES = [
  "Brilliant work! Your knowledge is expanding every day.",
  "Excellent! You're one step closer to certification mastery.",
  "Perfect! Keep building this momentum with each question.",
  "Spot on! Your understanding of cloud concepts is impressive.",
  "That's right! You're consistently proving your expertise."
];

const INCORRECT_QUOTES = [
  "Learning is a journey! This explanation will help you next time.",
  "Great attempt! Every question brings new knowledge.",
  "Not quite, but you're learning! Review the explanation to strengthen your understanding.",
  "A stepping stone to mastery. Remember this for next time!",
  "Close! The detailed explanation will help solidify this concept."
];

const getRandomQuote = (quotes) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

const triggerConfetti = () => {
  const duration = 2000;
  const end = Date.now() + duration;

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#4F46E5', '#60A5FA', '#34D399'],
    disableForReducedMotion: true
  });

  const interval = setInterval(() => {
    if (Date.now() > end) {
      return clearInterval(interval);
    }

    confetti({
      particleCount: 50,
      angle: random(60, 120),
      spread: random(50, 70),
      origin: { y: 0.7 },
      colors: ['#4F46E5', '#60A5FA', '#34D399'],
      disableForReducedMotion: true
    });
  }, 250);
};

const random = (min, max) => Math.random() * (max - min) + min;

export default function DailyQuizModal({ isOpen, onClose, onSubmit }) {
  const [question, setQuestion] = useState(null);
  const [userAttempt, setUserAttempt] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasResult, setHasResult] = useState(false);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [animation, setAnimation] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    if (isOpen) {
      fetchDailyQuestion();
    }
  }, [isOpen]);

  const getCurrentDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  const fetchDailyQuestion = async () => {
    setIsLoading(true);
    setError(null);
    startLoading();
    
    try {
      const date = getCurrentDate();
      const response = await getDailyQuestion(date);
      
      if (response.success && response.data) {
        setQuestion(response.data.question);
        setUserAttempt(response.data.user_attempt);
        setHasResult(response.data.user_attempt.attempted);
        
        if (response.data.user_attempt.attempted) {
          setSelectedAnswer(response.data.user_attempt.answer);
          const isCorrect = response.data.user_attempt.answer === response.data.question.correct_answer;
          setMotivationalQuote(getRandomQuote(isCorrect ? CORRECT_QUOTES : INCORRECT_QUOTES));
        }
      } else {
        setError('Failed to load today\'s question');
      }
    } catch (err) {
      setError('Error fetching daily question');
      console.error('Error fetching daily question:', err);
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  };

  const handleSelectAnswer = (answer) => {
    if (!userAttempt.attempted) {
      setSelectedAnswer(answer);
      setAnimation(true);
      setTimeout(() => setAnimation(false), 300);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || isSubmitting) return;
    
    setIsSubmitting(true);
    startLoading();
    
    try {
      const response = await submitDailyAnswer(question.id, selectedAnswer);
      
      if (response.success) {
        setUserAttempt(response.data);
        setHasResult(true);
        
        // Set motivational quote based on whether answer was correct
        const isCorrect = selectedAnswer === question.correct_answer;
        setMotivationalQuote(getRandomQuote(isCorrect ? CORRECT_QUOTES : INCORRECT_QUOTES));
        
        // If correct, trigger confetti animation
        if (isCorrect) {
          setTimeout(() => triggerConfetti(), 300);
        }
        
        // Pass the updated streak data back to parent component
        if (onSubmit && typeof onSubmit === 'function') {
          onSubmit();
        }

        // Create a notification about streak achievement
        if (response.data && response.data.current_streak > 1) {
          // We could add a toast notification here
          console.log(`Great job! You're on a ${response.data.current_streak} day streak!`);
        }
      } else {
        setError('Failed to submit answer');
      }
    } catch (err) {
      setError('Error submitting answer');
      console.error('Error submitting answer:', err);
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };
  
  const handleClose = () => {
    // Re-fetch streak data when closing the modal to ensure it's updated
    if (hasResult && onSubmit && typeof onSubmit === 'function') {
      onSubmit();
    }
    
    onClose();
    
    // Reset states 
    setSelectedAnswer('');
    setError(null);
  };

  const isCorrect = hasResult && question?.correct_answer === selectedAnswer;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-60" 
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          
          <motion.div 
            className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10 transition-colors"
              onClick={handleClose}
            >
              <IconX size={20} />
              <span className="sr-only">Close</span>
            </button>
            
            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-t-lg flex items-center"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <IconBrain className="h-6 w-6 mr-2 text-blue-200" />
              </motion.div>
              <h3 className="text-lg font-medium">Daily Challenge</h3>
            </motion.div>
            
            <div className="px-6 py-4">
              {isLoading ? (
                <div className="py-8 text-center">
                  <motion.div 
                    className="rounded-full h-12 w-12 border-t-2 border-r-2 border-blue-500 mx-auto mb-3"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                  <p className="text-gray-500">Loading today's challenge...</p>
                </div>
              ) : error ? (
                <motion.div 
                  className="py-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-red-500 mb-3">{error}</p>
                  <motion.button 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    onClick={fetchDailyQuestion}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try Again
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  <motion.div 
                    className="mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="font-medium text-gray-900 mb-3 text-lg">{question?.question}</h4>
                    
                    <div className="space-y-3">
                      {question?.options.map((option, index) => (
                        <motion.button
                          key={index}
                          className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all
                            ${selectedAnswer === option 
                              ? hasResult 
                                ? option === question.correct_answer
                                  ? 'bg-green-50 border-green-400 text-green-800'
                                  : 'bg-red-50 border-red-400 text-red-800'
                                : 'bg-blue-50 border-blue-400 text-blue-800'
                              : hasResult && option === question.correct_answer
                                ? 'bg-green-50 border-green-400 text-green-800'
                                : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 hover:border-gray-300'
                            } 
                            ${userAttempt?.attempted ? 'cursor-default' : 'cursor-pointer'}
                            ${selectedAnswer === option && animation ? 'transform scale-[1.02]' : ''}`}
                          onClick={() => !userAttempt?.attempted && handleSelectAnswer(option)}
                          disabled={userAttempt?.attempted}
                          whileHover={!userAttempt?.attempted ? { scale: 1.01, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" } : {}}
                          whileTap={!userAttempt?.attempted ? { scale: 0.99 } : {}}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + (index * 0.1) }}
                        >
                          <div className="flex items-center">
                            {selectedAnswer === option && hasResult && (
                              <motion.span 
                                className="mr-2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                {option === question.correct_answer ? (
                                  <IconCheck className="h-5 w-5 text-green-600" />
                                ) : (
                                  <IconClose className="h-5 w-5 text-red-600" />
                                )}
                              </motion.span>
                            )}
                            {option}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                  
                  {hasResult ? (
                    <motion.div 
                      className={`p-5 rounded-lg mb-4 ${isCorrect ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
                    >
                      <div className="flex items-center mb-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
                        >
                          {isCorrect ? (
                            <IconConfetti className={`h-6 w-6 mr-2 text-green-600`} />
                          ) : (
                            <IconBrain className={`h-6 w-6 mr-2 text-red-600`} />
                          )}
                        </motion.div>
                        <h5 className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                          {isCorrect ? 'Correct Answer!' : 'Incorrect Answer'} 
                        </h5>
                      </div>
                      
                      <motion.p 
                        className={`text-${isCorrect ? 'green' : 'red'}-700 mb-3 font-medium italic`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        "{motivationalQuote}"
                      </motion.p>
                      
                      <motion.div 
                        className="mt-3 bg-white rounded-lg p-3 border border-gray-100"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <p className="text-gray-800 font-medium">Explanation:</p>
                        <p className="text-gray-700 mt-1">{question?.explanation}</p>
                      </motion.div>
                      
                      {isCorrect && (
                        <motion.div 
                          className="mt-4 flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 }}
                        >
                          <div className="mr-3 bg-orange-100 text-orange-600 rounded-full px-3 py-1 flex items-center">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <IconFlame className="h-5 w-5 mr-1" />
                            </motion.div>
                            <span className="font-medium">Streak: {userAttempt?.current_streak || 0}</span>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="flex justify-end"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <motion.button
                        className={`px-5 py-2 rounded-lg font-medium flex items-center
                          ${!selectedAnswer || isSubmitting 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                          }`}
                        onClick={handleSubmit}
                        disabled={!selectedAnswer || isSubmitting}
                        whileHover={selectedAnswer && !isSubmitting ? { scale: 1.05, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" } : {}}
                        whileTap={selectedAnswer && !isSubmitting ? { scale: 0.95 } : {}}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                            />
                            Submitting...
                          </>
                        ) : (
                          <>Submit Answer</>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
