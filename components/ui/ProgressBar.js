import React from 'react';
import { cn } from '../../utils/cn';

/**
 * ProgressBar component
 * 
 * @param {Object} props - Component props
 * @param {number} props.value - Current progress value (0-100)
 * @param {string} props.variant - Progress bar variant (default, gradient, success, danger)
 * @param {string} props.size - Progress bar height (sm, md, lg)
 * @param {boolean} props.showLabel - Whether to show percentage label
 * @param {string} props.labelPosition - Position of the label (inside, outside)
 */
const ProgressBar = ({
  value = 0,
  variant = 'default',
  size = 'md',
  showLabel = false,
  labelPosition = 'inside',
  className = '',
  barClassName = '',
  labelClassName = '',
  ...props
}) => {
  // Ensure value is between 0 and 100
  const progressValue = Math.max(0, Math.min(100, value));
  
  // Style variants
  const variants = {
    default: 'bg-blue-500',
    gradient: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    success: 'bg-green-500',
    danger: 'bg-red-500',
  };

  // Size variants
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };

  // Determine label style
  const labelStyle = labelPosition === 'inside' 
    ? 'absolute text-xs text-white font-medium' 
    : 'text-xs text-gray-600 font-medium';

  // Container classes
  const containerClasses = cn(
    'bg-gray-100 rounded-full overflow-hidden relative',
    sizes[size],
    className
  );

  // Progress bar classes
  const barClasses = cn(
    'h-full rounded-full transition-all duration-300',
    variants[variant],
    barClassName
  );

  return (
    <div className="relative">
      <div className={containerClasses} {...props}>
        <div 
          className={barClasses} 
          style={{ width: `${progressValue}%` }}
        >
          {showLabel && labelPosition === 'inside' && progressValue > 15 && (
            <span className={cn('ml-2', labelClassName)}>
              {progressValue}%
            </span>
          )}
        </div>
      </div>
      
      {showLabel && labelPosition === 'outside' && (
        <span className={cn('mt-1 block', labelClassName)}>
          {progressValue}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;