import { IconArrowRight, IconStar, IconClockHour3, IconTrendingUp, IconBookmark } from '@tabler/icons-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { cn } from '../../utils/helpers';

/**
 * Get tag colors for badge
 */
const getTagColor = (tag) => {
  switch (tag?.toLowerCase()) {
    case 'practice':
      return 'blue';
    case 'recommended':
      return 'green';
    case 'new':
      return 'yellow';
    default:
      return 'blue';
  }
};

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
  questions_count,
  duration_minutes,
  tag = 'Practice',
  onStartTest
}) {
  const tagColor = getTagColor(tag);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <Badge
            variant={tagColor}
            size="sm"
          >
            {tag}
          </Badge>
        </div>
        
        <h3 className="mt-3 font-semibold text-gray-900 line-clamp-2">
          {title}
        </h3>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <IconClockHour3 size={16} className="mr-1" />
            <span>{duration_minutes} min</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <span>{questions_count} questions</span>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
        <Button 
          variant="text"
          size="sm"
          className="text-blue-600 hover:text-blue-700"
          rightIcon={<IconArrowRight size={16} />}
          onClick={() => onStartTest(id)}
        >
          Start Test
        </Button>
      </div>
    </div>
  );
}