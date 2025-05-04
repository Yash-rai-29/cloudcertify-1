import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * @param {any} value - The value to be debounced
 * @param {number} delay - Delay in milliseconds
 * @returns {any} The debounced value
 */
export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up the timeout
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up function will be executed if value changes or component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
