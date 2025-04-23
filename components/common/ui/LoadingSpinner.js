"use client";
import { cn } from "../../../utils/helpers";

/**
 * Loading spinner component with customizable size and text
 * 
 * @param {Object} props - Component props
 * @param {string} props.size - Size of spinner (small, medium, large)
 * @param {string|null} props.text - Optional text to display with the spinner
 * @param {string} props.className - Additional CSS classes
 */
export default function LoadingSpinner({ 
  size = "medium", 
  text = null,
  className
}) {
  // Size mappings
  const sizeClasses = {
    small: "w-5 h-5 border-2",
    medium: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4",
  };

  // Text size mappings
  const textSizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.medium;
  const textSize = textSizeClasses[size] || textSizeClasses.medium;

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div 
        className={cn(
          "rounded-full border-blue-300 border-t-blue-600 animate-spin", 
          spinnerSize
        )} 
      />
      {text && (
        <p className={cn("mt-3 text-gray-600 font-medium", textSize)}>
          {text}
        </p>
      )}
    </div>
  );
}