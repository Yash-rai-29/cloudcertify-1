"use client";
import { useState } from 'react';
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
  src = null,
  alt = 'User avatar',
  initials = '',
  size = 'md',
  className,
}) {
  const [imageError, setImageError] = useState(false);
  
  // Size mappings
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };
  
  const avatarSize = sizeClasses[size] || sizeClasses.md;
  
  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };
  
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium",
        avatarSize,
        className
      )}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <span>{initials?.toUpperCase() || '?'}</span>
      )}
    </div>
  );
}