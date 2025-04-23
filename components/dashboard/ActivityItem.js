import { IconClock } from '@tabler/icons-react';
import { timeAgo } from '../../utils/helpers';

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
export default function ActivityItem({
  id,
  icon,
  title,
  description,
  timestamp,
  className
}) {
  return (
    <div 
      className={`
        p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative
        ${className || ''}
      `}
    >
      <div className="flex items-start">
        {icon && (
          <div className="p-2 bg-gray-100 rounded-md text-gray-500 mr-3 relative">
            {icon}
          </div>
        )}
        
        <div className="flex-1 min-w-0 relative">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
          
          {timestamp && (
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <IconClock size={14} className="mr-1" />
              {timeAgo(timestamp * 1000)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}