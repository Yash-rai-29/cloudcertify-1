"use client";
import { cn } from '../../utils/helpers';

/**
 * Badge component for displaying labels, status indicators, or tags
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Badge variant (default, blue, green, amber, red, purple, indigo)
 * @param {string} props.size - Badge size (sm, md)
 * @param {React.ReactNode} props.leftIcon - Icon to display on the left
 * @param {React.ReactNode} props.rightIcon - Icon to display on the right
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  className,
  ...props
}) {
  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
  };
  
  // Get styles based on props
  const badgeVariant = variantStyles[variant] || variantStyles.default;
  const badgeSize = sizeStyles[size] || sizeStyles.md;
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        badgeVariant,
        badgeSize,
        className
      )}
      {...props}
    >
      {leftIcon && <span className="mr-1 -ml-0.5">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-1 -mr-0.5">{rightIcon}</span>}
    </span>
  );
}