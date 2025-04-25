import { IconClock, IconTestPipe, IconNotebook, IconFlashcard, IconMessage, IconCertificate } from '@tabler/icons-react';
import { timeAgo } from '../../utils/helpers';

/**
 * Get icon for activity type
 * @param {string} type - Activity type
 * @returns {JSX.Element} - Icon component
 */
const getActivityIcon = (type) => {
  switch (type?.toUpperCase()) {
    case 'TEST_COMPLETED':
    case 'TEST_STARTED':
      return <IconTestPipe size={18} />;
    case 'FLASHCARD_REVIEWED':
      return <IconFlashcard size={18} />;
    case 'MODULE_COMPLETED':
      return <IconNotebook size={18} />;
    case 'CERTIFICATE_EARNED':
      return <IconCertificate size={18} />;
    case 'AI_CHAT':
      return <IconMessage size={18} />;
    default:
      return <IconClock size={18} />;
  }
};

/**
 * Get background color for activity type
 * @param {string} type - Activity type
 * @returns {string} - Tailwind classes for background and text
 */
const getActivityColors = (type) => {
  switch (type?.toUpperCase()) {
    case 'TEST_COMPLETED':
      return 'bg-blue-100 text-blue-600';
    case 'TEST_STARTED':
      return 'bg-indigo-100 text-indigo-600';
    case 'FLASHCARD_REVIEWED':
      return 'bg-purple-100 text-purple-600';
    case 'MODULE_COMPLETED':
      return 'bg-green-100 text-green-600';
    case 'CERTIFICATE_EARNED':
      return 'bg-amber-100 text-amber-600';
    case 'AI_CHAT':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-500';
  }
};

/**
 * ActivityItem component for displaying user activity in a consistent format
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Activity ID
 * @param {string} props.type - Activity type (TEST_COMPLETED, FLASHCARD_REVIEWED, etc.)
 * @param {string} props.title - Activity title
 * @param {string} props.timestamp - Activity timestamp in ISO format
 * @param {string} props.className - Additional CSS classes
 */
export default function ActivityItem({
  id,
  type,
  title,
  timestamp,
  className
}) {
  const icon = getActivityIcon(type);
  const iconColors = getActivityColors(type);
  const formattedTime = timestamp ? timeAgo(new Date(timestamp)) : '';
  
  return (
    <div 
      className={`
        px-4 py-3 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors relative last:border-b-0
        ${className || ''}
      `}
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-full mr-3 ${iconColors}`}>
          {icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
          
          {formattedTime && (
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <IconClock size={12} className="mr-1" />
              {formattedTime}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}