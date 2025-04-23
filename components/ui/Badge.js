import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Badge component for displaying labels, status indicators, or tags
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Badge variant (default, blue, green, amber, red, purple, indigo)
 * @param {string} props.size - Badge size (sm, md)
 * @param {React.ReactNode} props.leftIcon - Icon to display on the left
 * @param {React.ReactNode} props.rightIcon - Icon to display on the right
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  // Style variants
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    emerald: 'bg-emerald-100 text-emerald-700',
  };

  // Size variants
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  // Combine classNames
  const badgeClasses = cn(
    'inline-flex items-center gap-1 font-medium rounded-full',
    variants[variant],
    sizes[size],
    className
  );

  return (
    <span className={badgeClasses} {...props}>
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </span>
  );
};

export default Badge;