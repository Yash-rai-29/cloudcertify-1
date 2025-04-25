import { 
  FiBook, 
  FiFileText, 
  FiMessageSquare, 
  FiBarChart2, 
  FiCheck, 
  FiAward, 
  FiStar 
} from 'react-icons/fi';
import { timeAgo } from '../../utils/helpers';

/**
 * Get icon for activity type
 * @param {string} type - Activity type
 * @returns {JSX.Element} - Icon component
 */
function getActivityIcon(type) {
  switch (type?.toLowerCase()) {
    case 'test_completed':
      return <FiCheck className="text-green-500" />;
    case 'test_started':
      return <FiBook className="text-blue-500" />;
    case 'flashcard_reviewed':
      return <FiFileText className="text-indigo-500" />;
    case 'resource_viewed':
      return <FiFileText className="text-purple-500" />;
    case 'chat_session':
      return <FiMessageSquare className="text-amber-500" />;
    case 'certification_progress':
      return <FiBarChart2 className="text-blue-500" />;
    case 'leaderboard_position':
      return <FiAward className="text-amber-500" />;
    case 'streak_milestone':
      return <FiStar className="text-amber-500" />;
    default:
      return <FiCheck className="text-gray-500" />;
  }
}

/**
 * Get background color for activity type
 * @param {string} type - Activity type
 * @returns {string} - Tailwind classes for background and text
 */
function getActivityBackground(type) {
  switch (type?.toLowerCase()) {
    case 'test_completed':
      return 'bg-green-50 border-green-100 text-green-800';
    case 'test_started':
      return 'bg-blue-50 border-blue-100 text-blue-800';
    case 'flashcard_reviewed':
      return 'bg-indigo-50 border-indigo-100 text-indigo-800';
    case 'resource_viewed':
      return 'bg-purple-50 border-purple-100 text-purple-800';
    case 'chat_session':
      return 'bg-amber-50 border-amber-100 text-amber-800';
    case 'certification_progress':
      return 'bg-blue-50 border-blue-100 text-blue-800';
    case 'leaderboard_position':
      return 'bg-amber-50 border-amber-100 text-amber-800';
    case 'streak_milestone':
      return 'bg-amber-50 border-amber-100 text-amber-800';
    default:
      return 'bg-gray-50 border-gray-100 text-gray-800';
  }
}

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
  className = '',
}) {
  const activityTime = timeAgo(timestamp);
  const bgColorClass = getActivityBackground(type);
  
  return (
    <div className={`p-4 border rounded-lg mb-3 ${bgColorClass} ${className}`} data-activity-id={id}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 p-2 rounded-full bg-white">
          {getActivityIcon(type)}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-medium text-sm truncate">
              {title || 'Activity'}
            </h4>
            <span className="text-xs opacity-75 whitespace-nowrap ml-2">
              {activityTime}
            </span>
          </div>
          <div className="text-xs capitalize">
            {type?.replace(/_/g, ' ').toLowerCase() || 'General activity'}
          </div>
        </div>
      </div>
    </div>
  );
}