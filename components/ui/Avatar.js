"use client";
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '../../utils/helpers';

/**
 * Avatar component that displays user avatar or initials
 * 
 * @param {Object} props - Component props
 * @param {string} props.src - Avatar image source URL
 * @param {string} props.alt - Avatar image alt text
 * @param {string} props.initials - Initials to display if no image
 * @param {string} props.size - Avatar size (sm, md, lg, xl)
 * @param {string} props.className - Additional CSS classes
 */
export default function Avatar({
  src,
  alt = "User",
  initials = "U",
  size = "md",
  className,
  ...props
}) {
  const [imageError, setImageError] = useState(false);
  
  // Size classes
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-14 w-14 text-lg',
    xl: 'h-20 w-20 text-xl',
  };
  
  // Determine the size class to use
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  
  // If no src or image failed to load, render initials
  if (!src || imageError) {
    return (
      <div 
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-medium',
          sizeClass,
          className
        )}
        {...props}
      >
        {initials?.substring(0, 2).toUpperCase()}
      </div>
    );
  }
  
  // Otherwise, render the image
  return (
    <div 
      className={cn(
        'relative inline-flex rounded-full overflow-hidden',
        sizeClass,
        className
      )}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}