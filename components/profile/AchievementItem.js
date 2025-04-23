import React from 'react';
import { FiStar } from 'react-icons/fi';
import { cn } from '../../utils/cn';

/**
 * Achievement Item component for displaying user achievements
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Achievement icon
 * @param {string} props.title - Achievement title
 * @param {string} props.description - Achievement description
 * @param {string} props.bgClass - Background color class
 * @param {string} props.iconClass - Icon color class
 * @param {number} props.stars - Number of stars (1-3)
 * @param {string} props.className - Additional CSS classes
 */
const AchievementItem = ({
  icon,
  title,
  description,
  bgClass = 'bg-amber-50 border-amber-100',
  iconClass = 'bg-amber-100 text-amber-700',
  stars = 0,
  className = '',
  ...props
}) => {
  // Ensure stars is between 0 and 3
  const starCount = Math.max(0, Math.min(3, stars));
  
  return (
    <div 
      className={cn(
        'flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 border rounded-lg',
        bgClass,
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-full', iconClass)}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      
      {starCount > 0 && (
        <div className="flex items-center gap-1 text-amber-700">
          {[...Array(starCount)].map((_, i) => (
            <FiStar key={i} size={16} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementItem;