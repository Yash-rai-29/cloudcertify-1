import React from 'react';
import Link from 'next/link';
import { cn } from '../../utils/cn';

/**
 * Button component that can be rendered as a button or link
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, outline, ghost)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {string} props.href - Link URL (if button should be a link)
 * @param {React.ReactNode} props.leftIcon - Icon to display on the left
 * @param {React.ReactNode} props.rightIcon - Icon to display on the right
 * @param {boolean} props.isLoading - Whether button is in loading state
 * @param {boolean} props.disabled - Whether button is disabled
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  // Style variants
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    outline: 'bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700',
    ghost: 'bg-transparent hover:bg-gray-50 text-gray-700',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };

  // Size variants
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  // Combine classNames
  const buttonClasses = cn(
    'rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    (disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : '',
    className
  );

  // If href is provided, render as Link
  if (href) {
    return (
      <Link 
        href={href} 
        className={buttonClasses}
        {...props}
      >
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {isLoading ? 'Loading...' : children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;