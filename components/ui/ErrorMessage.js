"use client";
import { cn } from '../../utils/helpers';
import { FiAlertTriangle } from 'react-icons/fi';

/**
 * Error message component to display error feedback consistently
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Error title/heading
 * @param {string} props.message - Detailed error message
 * @param {React.ReactNode} props.action - Optional action button or link
 * @param {string} props.variant - Error variant (warning, error, info)
 * @param {string} props.className - Additional CSS classes
 */
export default function ErrorMessage({
  title,
  message,
  action = null,
  variant = 'error',
  className,
}) {
  // Variant styles
  const variantStyles = {
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };
  
  // Icon styles
  const iconStyles = {
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
  };
  
  const style = variantStyles[variant] || variantStyles.error;
  const iconStyle = iconStyles[variant] || iconStyles.error;
  
  return (
    <div className={cn("p-4 rounded-lg border", style, className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <FiAlertTriangle className={cn("w-5 h-5", iconStyle)} />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          {message && (
            <div className="mt-1 text-sm opacity-90">
              <p>{message}</p>
            </div>
          )}
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}