import React from 'react';
import { timeAgo } from '../../utils/services/dashboardService';
import { cn } from '../../utils/cn';

/**
 * ActivityItem component for displaying user activity in a consistent format
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Activity ID
 * @param {React.ReactNode} props.icon - Activity icon
 * @param {string} props.title - Activity title
 * @param {string} props.description - Activity description
 * @param {number} props.timestamp - Activity timestamp (Unix timestamp in seconds)
 * @param {string} props.className - Additional CSS classes
 */
const ActivityItem = ({
  id,
  icon,
  title,
  description,
  timestamp,
  className = '',
  ...props
}) => {
  return (
    <div className={cn('pl-5 relative', className)} {...props}>
      <div className="absolute left-0 top-1.5">
        <div className="bg-white border border-gray-200 rounded-full p-1 shadow-sm">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-gray-800 font-medium">{title}</h3>
        {description && <p className="text-sm text-gray-600">{description}</p>}
        {timestamp && <p className="text-xs text-gray-500 mt-1">{timeAgo(timestamp)}</p>}
      </div>
    </div>
  );
};

export default ActivityItem;