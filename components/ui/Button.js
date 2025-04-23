"use client";
import { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '../../utils/helpers';

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
const Button = forwardRef(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  type = 'button',
  ...props
}, ref) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 border border-transparent',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300',
    outline: 'bg-transparent text-blue-600 hover:bg-blue-50 border border-blue-600',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 border border-transparent',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-2.5 px-5',
  };
  
  // Disabled and loading styles
  const stateStyles = {
    disabled: 'opacity-50 cursor-not-allowed',
    loading: 'relative text-transparent pointer-events-none',
  };
  
  // Get styles based on props
  const buttonVariant = variantStyles[variant] || variantStyles.primary;
  const buttonSize = sizeStyles[size] || sizeStyles.md;
  const buttonState = disabled 
    ? stateStyles.disabled 
    : isLoading 
      ? stateStyles.loading 
      : '';
  
  // Base button styles
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50';
  
  // Combined classes
  const buttonClasses = cn(
    baseStyles,
    buttonVariant,
    buttonSize,
    buttonState,
    fullWidth ? 'w-full' : '',
    className
  );
  
  // Loading spinner
  const LoadingSpinner = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg 
        className="animate-spin h-4 w-4 text-current" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
  
  // Content with icons
  const ButtonContent = () => (
    <>
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
      {isLoading && <LoadingSpinner />}
    </>
  );
  
  // Render as link if href is provided
  if (href) {
    return (
      <Link href={href} passHref className={buttonClasses} ref={ref} {...props}>
        <ButtonContent />
      </Link>
    );
  }
  
  // Otherwise, render as button
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      <ButtonContent />
    </button>
  );
});

Button.displayName = 'Button';

export default Button;