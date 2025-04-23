import { IconArrowUpRight, IconStar, IconClockHour3, IconTrendingUp } from '@tabler/icons-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { cn } from '../../utils/helpers';

/**
 * Get difficulty colors for badge
 */
const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'green';
    case 'intermediate':
      return 'amber';
    case 'advanced':
      return 'red';
    default:
      return 'blue';
  }
};

/**
 * Get recommendation type badge variant
 */
const getRecommendationBadge = (type) => {
  switch (type?.toLowerCase()) {
    case 'popular':
      return {
        variant: 'purple',
        icon: <IconStar size={14} />,
        text: 'Popular'
      };
    case 'trending':
      return {
        variant: 'amber',
        icon: <IconTrendingUp size={14} />,
        text: 'Trending'
      };
    case 'recommended':
      return {
        variant: 'blue',
        icon: <IconArrowUpRight size={14} />,
        text: 'Recommended'
      };
    default:
      return {
        variant: 'blue',
        icon: <IconArrowUpRight size={14} />,
        text: type || 'Recommended'
      };
  }
};

/**
 * Test Recommendation Card component
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Test title
 * @param {string} props.category - Test category
 * @param {string} props.difficulty - Test difficulty level
 * @param {string} props.recommendationType - Recommendation type
 * @param {number} props.popularityScore - Test popularity score
 * @param {function} props.onStartTest - Handler for starting test
 */
export default function TestRecommendationCard({
  title,
  category,
  difficulty,
  recommendationType,
  popularityScore,
  onStartTest
}) {
  const difficultyColor = getDifficultyColor(difficulty);
  const recommendation = getRecommendationBadge(recommendationType);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <Badge
          variant={recommendation.variant}
          leftIcon={recommendation.icon}
          size="sm"
        >
          {recommendation.text}
        </Badge>
        <Badge
          variant={difficultyColor}
          size="sm"
        >
          {difficulty || 'All Levels'}
        </Badge>
      </div>
      
      <h3 className="mt-3 font-semibold text-gray-900 line-clamp-2">
        {title}
      </h3>
      
      <div className="mt-2 flex items-center text-sm text-gray-500">
        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
          {category}
        </span>
        {popularityScore > 0 && (
          <div className="ml-2 flex items-center">
            <IconStar size={14} className={cn(
              "mr-1",
              popularityScore > 3 ? "text-amber-400" : "text-gray-400"
            )} />
            <span>{popularityScore.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <IconClockHour3 size={16} className="mr-1" />
          <span>20 min</span>
        </div>
        <Button 
          variant="outline"
          size="sm"
          rightIcon={<IconArrowUpRight size={16} />}
          onClick={onStartTest}
        >
          Start Test
        </Button>
      </div>
    </div>
  );
}