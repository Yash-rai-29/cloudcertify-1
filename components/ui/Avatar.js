import React from 'react';
import { cn } from '../../utils/cn';

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
const Avatar = ({
  src,
  alt = 'User',
  initials = 'U',
  size = 'md',
  className = '',
  ...props
}) => {
  // Size variants
  const sizes = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16 text-xl',
    xl: 'h-24 w-24 text-3xl',
  };

  // Combine classNames
  const avatarClasses = cn(
    'rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600',
    sizes[size],
    className
  );

  return (
    <div className={avatarClasses} {...props}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full rounded-full object-cover" 
        />
      ) : (
        initials?.charAt(0) || 'U'
      )}
    </div>
  );
};

export default Avatar;