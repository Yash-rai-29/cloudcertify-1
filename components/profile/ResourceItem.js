import React from 'react';
import { cn } from '../../utils/cn';

/**
 * Resource Item component for displaying completed modules or saved resources
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Resource icon
 * @param {string} props.title - Resource title
 * @param {string} props.iconColor - Icon background color class
 */
const ResourceItem = ({
  icon,
  title,
  iconColor = 'bg-green-100 text-green-700',
  className = '',
  ...props
}) => {
  return (
    <div 
      className={cn(
        'p-3 border border-gray-200 rounded-lg flex items-center gap-3',
        className
      )}
      {...props}
    >
      <div className={cn('p-1 rounded-full', iconColor)}>
        {icon}
      </div>
      <span className="text-gray-800">{title}</span>
    </div>
  );
};

export default ResourceItem;