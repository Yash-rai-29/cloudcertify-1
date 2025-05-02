import { useEffect, useCallback } from 'react';

/**
 * Component to manage test timing functionality
 * Handles time formatting and countdown logic
 */
export const TestTimerManager = ({ 
  mode, 
  timeRemaining,
  setTimeRemaining,
  onTimeExpired
}) => {
  // Timer for exam mode
  useEffect(() => {
    if (mode !== 'exam' || !timeRemaining) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [mode, timeRemaining, setTimeRemaining, onTimeExpired]);

  // No UI rendered - this is a utility component
  return null;
};

/**
 * Format time remaining (mm:ss or hh:mm:ss format)
 */
export const formatTime = (seconds) => {
  if (!seconds) return '--:--';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    : `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export default TestTimerManager;
