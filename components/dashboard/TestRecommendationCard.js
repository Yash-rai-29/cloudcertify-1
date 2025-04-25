import { FiClock, FiHelpCircle, FiChevronRight } from 'react-icons/fi';
import { trackUserActivity } from '../../utils/services/activityService';

/**
 * Get tag colors for badge
 */
function getTagColors(tag) {
  switch (tag?.toLowerCase()) {
    case 'recommended':
      return 'bg-blue-100 text-blue-700';
    case 'new':
      return 'bg-green-100 text-green-700';
    case 'practice':
      return 'bg-purple-100 text-purple-700';
    case 'popular':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

/**
 * Test Recommendation Card component
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Test ID
 * @param {string} props.title - Test title
 * @param {number} props.questions_count - Number of questions
 * @param {number} props.duration_minutes - Test duration in minutes
 * @param {string} props.tag - Test tag (Practice, Recommended, New)
 * @param {function} props.onStartTest - Handler for starting test
 */
export default function TestRecommendationCard({
  id,
  title,
  questions_count = 0,
  duration_minutes = 0,
  tag,
  onStartTest
}) {
  const tagColorClass = getTagColors(tag);
  
  const handleStartTest = () => {
    // Track activity
    trackUserActivity('test_started', { test_id: id, test_title: title });
    
    // Call handler if provided
    if (typeof onStartTest === 'function') {
      onStartTest(id);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow transition-shadow duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-gray-800 line-clamp-2">{title}</h3>
          
          {tag && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ml-2 whitespace-nowrap ${tagColorClass}`}>
              {tag}
            </span>
          )}
        </div>
        
        <div className="flex text-sm text-gray-600 mb-4">
          <div className="flex items-center mr-4">
            <FiHelpCircle size={16} className="mr-1 text-gray-400" />
            <span>{questions_count} questions</span>
          </div>
          <div className="flex items-center">
            <FiClock size={16} className="mr-1 text-gray-400" />
            <span>{duration_minutes} minutes</span>
          </div>
        </div>
        
        <button
          onClick={handleStartTest}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          Start Test
          <FiChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
}