import { useState, useEffect } from 'react';
import { getDailyQuestion, submitDailyAnswer } from '../../utils/services/dashboardService';
import { IconX, IconFlame, IconCheck, IconX as IconClose } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Motivational quotes for correct answers
const CORRECT_QUOTES = [
  "Brilliant work! Your knowledge is expanding every day.",
  "Excellent! You're one step closer to certification mastery.",
  "Perfect! Keep building this momentum with each question.",
  "Spot on! Your understanding of cloud concepts is impressive.",
  "That's right! You're consistently proving your expertise."
];

// Encouraging quotes for incorrect answers
const INCORRECT_QUOTES = [
  "Learning is a journey! This explanation will help you next time.",
  "Great attempt! Every question brings new knowledge.",
  "Not quite, but you're learning! Review the explanation to strengthen your understanding.",
  "A stepping stone to mastery. Remember this for next time!",
  "Close! The detailed explanation will help solidify this concept."
];

/**
 * Get a random quote from an array
 * @param {Array} quotes - Array of quote strings
 * @returns {string} A randomly selected quote
 */
const getRandomQuote = (quotes) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

/**
 * Trigger confetti animation for correct answers
 */
const triggerConfetti = () => {
  const duration = 2000;
  const end = Date.now() + duration;

  // Configure and start confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#4F46E5', '#60A5FA', '#34D399'],
    disableForReducedMotion: true
  });

  // Create a more complete celebration with additional bursts
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

// Helper for random number in range
const random = (min, max) => Math.random() * (max - min) + min;

/**
 * Modal component for daily quiz questions
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call to close modal
 * @param {Function} props.onSubmit - Function to call after submitting answer
 */
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

  // Fetch the daily question when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDailyQuestion();
    }
  }, [isOpen]);

  // Format current date as YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  };

  // Fetch daily question from API
  const fetchDailyQuestion = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const date = getCurrentDate();
      const response = await getDailyQuestion(date);
      
      if (response.success && response.data) {
        setQuestion(response.data.question);
        setUserAttempt(response.data.user_attempt);
        setHasResult(response.data.user_attempt.attempted);
        
        if (response.data.user_attempt.attempted) {
          setSelectedAnswer(response.data.user_attempt.answer);
          // Set appropriate quote if user has already answered
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
    }
  };

  // Handle answer selection
  const handleSelectAnswer = (answer) => {
    if (!userAttempt.attempted) {
      setSelectedAnswer(answer);
      // Add selection animation
      setAnimation(true);
      setTimeout(() => setAnimation(false), 300);
    }
  };

  // Submit the selected answer
  const handleSubmit = async () => {
    if (!selectedAnswer || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await submitDailyAnswer(question.id, selectedAnswer);
      
      if (response.success) {
        // Update user attempt state
        const isCorrect = question.correct_answer === selectedAnswer;
        
        setUserAttempt({
          attempted: true,
          answer: selectedAnswer,
          is_correct: isCorrect
        });
        
        setHasResult(true);
        
        // Set a motivational quote based on correctness
        setMotivationalQuote(getRandomQuote(isCorrect ? CORRECT_QUOTES : INCORRECT_QUOTES));
        
        // Trigger confetti animation for correct answers
        if (isCorrect) {
          setTimeout(() => triggerConfetti(), 300);
        }
        
        // Notify parent component about successful submission
        if (onSubmit) {
          onSubmit(response.data);
        }
      } else {
        setError('Failed to submit answer');
      }
    } catch (err) {
      setError('Error submitting answer');
      console.error('Error submitting answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close button click handler with confirmation if needed
  const handleClose = () => {
    if (!userAttempt?.attempted && selectedAnswer) {
      if (confirm('You haven\'t submitted your answer yet. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Determine if the selected answer is correct after submission
  const isCorrect = hasResult && question?.correct_answer === selectedAnswer;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-60" 
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Modal */}
          <motion.div 
            className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {/* Close button */}
            <button 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10 transition-colors"
              onClick={handleClose}
            >
              <IconX size={20} />
              <span className="sr-only">Close</span>
            </button>
            
            {/* Modal header */}
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex items-center">
              <IconFlame className="h-6 w-6 mr-2 text-orange-300" />
              <h3 className="text-lg font-medium">Daily Challenge</h3>
            </div>
            
            {/* Modal content */}
            <div className="px-6 py-4">
              {isLoading ? (
                <div className="py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
                  <p className="text-gray-500">Loading question...</p>
                </div>
              ) : error ? (
                <div className="py-6 text-center">
                  <p className="text-red-500 mb-3">{error}</p>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    onClick={fetchDailyQuestion}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {/* Question */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">{question?.question}</h4>
                    
                    {/* Options */}
                    <div className="space-y-2">
                      {question?.options.map((option, index) => (
                        <motion.button
                          key={index}
                          className={`w-full text-left px-4 py-3 rounded border transition-all
                            ${selectedAnswer === option 
                              ? hasResult 
                                ? option === question.correct_answer
                                  ? 'bg-green-50 border-green-300 text-green-800'
                                  : 'bg-red-50 border-red-300 text-red-800'
                                : 'bg-blue-50 border-blue-300 text-blue-800'
                              : hasResult && option === question.correct_answer
                                ? 'bg-green-50 border-green-300 text-green-800'
                                : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                            } 
                            ${userAttempt?.attempted ? 'cursor-default' : 'cursor-pointer'}
                            ${selectedAnswer === option && animation ? 'transform scale-[1.02]' : ''}`}
                          onClick={() => !userAttempt?.attempted && handleSelectAnswer(option)}
                          disabled={userAttempt?.attempted}
                          whileHover={!userAttempt?.attempted ? { scale: 1.01 } : {}}
                          whileTap={!userAttempt?.attempted ? { scale: 0.99 } : {}}
                        >
                          <div className="flex items-center">
                            {selectedAnswer === option && hasResult && (
                              <span className="mr-2">
                                {option === question.correct_answer ? (
                                  <IconCheck className="h-5 w-5 text-green-600" />
                                ) : (
                                  <IconClose className="h-5 w-5 text-red-600" />
                                )}
                              </span>
                            )}
                            {option}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Results or Submit button */}
                  {hasResult ? (
                    <motion.div 
                      className={`p-4 rounded mb-4 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h5 className={`font-medium mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? 'Correct!' : 'Incorrect'} 
                      </h5>
                      {/* Motivational quote */}
                      <p className={`text-${isCorrect ? 'green' : 'red'}-700 mb-3 font-medium italic`}>
                        "{motivationalQuote}"
                      </p>
                      <p className="text-gray-700">{question?.explanation}</p>
                      {isCorrect && (
                        <div className="mt-3 flex items-center text-orange-500">
                          <IconFlame className="h-5 w-5 mr-1" />
                          <span className="font-medium">Current Streak: {userAttempt?.current_streak || 0}</span>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="flex justify-end">
                      <motion.button
                        className={`px-4 py-2 rounded font-medium 
                          ${!selectedAnswer || isSubmitting 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        onClick={handleSubmit}
                        disabled={!selectedAnswer || isSubmitting}
                        whileHover={selectedAnswer && !isSubmitting ? { scale: 1.05 } : {}}
                        whileTap={selectedAnswer && !isSubmitting ? { scale: 0.95 } : {}}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                      </motion.button>
                    </div>
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
